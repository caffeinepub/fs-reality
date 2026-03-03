import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Property {
    public type PropertyType = {
      #apartment;
      #villa;
      #plot;
      #commercial;
    };

    public type ListingType = {
      #buy;
      #rent;
    };

    public type Property = {
      id : Nat;
      title : Text;
      description : Text;
      price : Nat;
      location : Text;
      city : Text;
      state : Text;
      propertyType : PropertyType;
      listingType : ListingType;
      bedrooms : Nat;
      bathrooms : Nat;
      areaSqFt : Nat;
      postedBy : Principal;
      postedAt : Int;
      contactName : Text;
      contactPhone : Text;
      isActive : Bool;
    };

    public func compareByPrice(p1 : Property, p2 : Property) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };

    public func compareByDate(p1 : Property, p2 : Property) : Order.Order {
      Int.compare(p1.postedAt, p2.postedAt);
    };
  };

  public type Property = Property.Property;
  public type PropertyType = Property.PropertyType;
  public type ListingType = Property.ListingType;

  public type UserProfile = {
    name : Text;
  };

  let properties = Map.empty<Nat, Property>();
  var nextId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createProperty(
    title : Text,
    description : Text,
    price : Nat,
    location : Text,
    city : Text,
    state : Text,
    propertyType : PropertyType,
    listingType : ListingType,
    bedrooms : Nat,
    bathrooms : Nat,
    areaSqFt : Nat,
    contactName : Text,
    contactPhone : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create properties");
    };

    let property : Property = {
      id = nextId;
      title;
      description;
      price;
      location;
      city;
      state;
      propertyType;
      listingType;
      bedrooms;
      bathrooms;
      areaSqFt;
      postedBy = caller;
      postedAt = Time.now();
      contactName;
      contactPhone;
      isActive = true;
    };

    properties.add(nextId, property);
    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  public query ({ caller }) func getProperty(id : Nat) : async Property {
    switch (properties.get(id)) {
      case (?property) { property };
      case (null) { Runtime.trap("Property not found") };
    };
  };

  public query ({ caller }) func getProperties(
    city : ?Text,
    listingType : ?ListingType,
    propertyType : ?PropertyType,
    minPrice : ?Nat,
    maxPrice : ?Nat,
    minBedrooms : ?Nat,
    maxBedrooms : ?Nat,
  ) : async [Property] {
    let filtered = properties.values().toArray().filter(
      func(p) {
        if (not p.isActive) { return false };
        switch (city) { case (?c) { if (p.city != c) { return false } }; case (null) {} };
        switch (listingType) { case (?l) { if (p.listingType != l) { return false } }; case (null) {} };
        switch (propertyType) { case (?pt) { if (p.propertyType != pt) { return false } }; case (null) {} };
        switch (minPrice) { case (?minP) { if (p.price < minP) { return false } }; case (null) {} };
        switch (maxPrice) { case (?maxP) { if (p.price > maxP) { return false } }; case (null) {} };
        switch (minBedrooms) { case (?minB) { if (p.bedrooms < minB) { return false } }; case (null) {} };
        switch (maxBedrooms) { case (?maxB) { if (p.bedrooms > maxB) { return false } }; case (null) {} };
        true;
      }
    );
    filtered;
  };

  public shared ({ caller }) func updateProperty(
    id : Nat,
    title : Text,
    description : Text,
    price : Nat,
    location : Text,
    city : Text,
    state : Text,
    propertyType : PropertyType,
    listingType : ListingType,
    bedrooms : Nat,
    bathrooms : Nat,
    areaSqFt : Nat,
    contactName : Text,
    contactPhone : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update properties");
    };

    switch (properties.get(id)) {
      case (?existing) {
        if (existing.postedBy != caller) {
          Runtime.trap("Unauthorized: Only the owner can update property");
        };
        let updated : Property = {
          id;
          title;
          description;
          price;
          location;
          city;
          state;
          propertyType;
          listingType;
          bedrooms;
          bathrooms;
          areaSqFt;
          postedBy = caller;
          postedAt = existing.postedAt;
          contactName;
          contactPhone;
          isActive = existing.isActive;
        };
        properties.add(id, updated);
      };
      case (null) { Runtime.trap("Property not found") };
    };
  };

  public shared ({ caller }) func deleteProperty(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete properties");
    };

    switch (properties.get(id)) {
      case (?existing) {
        if (existing.postedBy != caller) {
          Runtime.trap("Unauthorized: Only the owner can delete property");
        };
        let updated : Property = {
          id = existing.id;
          title = existing.title;
          description = existing.description;
          price = existing.price;
          location = existing.location;
          city = existing.city;
          state = existing.state;
          propertyType = existing.propertyType;
          listingType = existing.listingType;
          bedrooms = existing.bedrooms;
          bathrooms = existing.bathrooms;
          areaSqFt = existing.areaSqFt;
          postedBy = existing.postedBy;
          postedAt = existing.postedAt;
          contactName = existing.contactName;
          contactPhone = existing.contactPhone;
          isActive = false;
        };
        properties.add(id, updated);
      };
      case (null) { Runtime.trap("Property not found") };
    };
  };

  public query ({ caller }) func getMyProperties() : async [Property] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their properties");
    };

    let myProps = properties.values().toArray().filter(
      func(p) {
        p.postedBy == caller and p.isActive
      }
    );
    myProps.sort(Property.compareByDate);
  };
};
