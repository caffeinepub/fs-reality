import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Migration "migration";


(with migration = Migration.run)
actor {
  include MixinStorage();

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
    contactName : Text;
    contactPhone : Text;
    photoUrls : [Text];
    videoUrls : [Text];
    postedBy : Principal.Principal;
    postedAt : Time.Time;
    isActive : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  let properties = Map.empty<Nat, Property>();
  var nextId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal.Principal, UserProfile>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
    photoUrls : [Text],
    videoUrls : [Text],
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
      contactName;
      contactPhone;
      photoUrls;
      videoUrls;
      postedBy = caller;
      postedAt = Time.now();
      isActive = true;
    };

    properties.add(nextId, property);
    nextId += 1;
    property.id;
  };

  public query ({ caller }) func getProperty(id : Nat) : async ?Property {
    properties.get(id);
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
    let filtered = properties.toArray().filter(
      func((_, p)) {
        var matches = p.isActive;
        switch (city, matches) {
          case (?c, true) { matches := p.city == c };
          case (_) {};
        };
        switch (listingType, matches) {
          case (?l, true) { matches := p.listingType == l };
          case (_) {};
        };
        switch (propertyType, matches) {
          case (?pt, true) { matches := p.propertyType == pt };
          case (_) {};
        };
        switch (minPrice, matches) {
          case (?minP, true) { matches := p.price >= minP };
          case (_) {};
        };
        switch (maxPrice, matches) {
          case (?maxP, true) { matches := p.price <= maxP };
          case (_) {};
        };
        switch (minBedrooms, matches) {
          case (?minB, true) { matches := p.bedrooms >= minB };
          case (_) {};
        };
        switch (maxBedrooms, matches) {
          case (?maxB, true) { matches := p.bedrooms <= maxB };
          case (_) {};
        };
        matches;
      }
    ).map(func((_, p)) { p });

    filtered.reverse();
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
    photoUrls : [Text],
    videoUrls : [Text],
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
          contactName;
          contactPhone;
          photoUrls;
          videoUrls;
          postedBy = caller;
          postedAt = existing.postedAt;
          isActive = existing.isActive;
        };
        properties.add(id, updated);
      };
      case (null) { Runtime.trap("Property not found") };
    };
  };

  public shared ({ caller }) func deleteProperty(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
          photoUrls = existing.photoUrls;
          videoUrls = existing.videoUrls;
          isActive = false;
        };
        properties.add(id, updated);
      };
      case (null) { Runtime.trap("Property not found") };
    };
  };

  public query ({ caller }) func getMyProperties() : async [Property] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their properties");
    };

    let myProps = properties.values().toArray().filter(
      func(p) {
        p.postedBy == caller and p.isActive
      }
    );
    myProps.reverse();
  };
};
