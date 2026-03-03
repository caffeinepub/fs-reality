import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";

module {
  type PropertyType = {
    #apartment;
    #villa;
    #plot;
    #commercial;
  };

  type ListingType = {
    #buy;
    #rent;
  };

  type OldProperty = {
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
    postedBy : Principal.Principal;
    postedAt : Int;
    isActive : Bool;
  };

  type NewProperty = {
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
    postedAt : Int;
    isActive : Bool;
  };

  type OldActor = {
    properties : Map.Map<Nat, OldProperty>;
    nextId : Nat;
    userProfiles : Map.Map<Principal.Principal, { name : Text }>;
    accessControlState : AccessControl.AccessControlState;
    stripeConfiguration : ?Stripe.StripeConfiguration;
  };

  type NewActor = {
    properties : Map.Map<Nat, NewProperty>;
    nextId : Nat;
    userProfiles : Map.Map<Principal.Principal, { name : Text }>;
    accessControlState : AccessControl.AccessControlState;
    stripeConfiguration : ?Stripe.StripeConfiguration;
  };

  public func run(old : OldActor) : NewActor {
    let newProperties = old.properties.map<Nat, OldProperty, NewProperty>(
      func(_id, oldProperty) {
        { oldProperty with videoUrls = [] };
      }
    );
    { old with properties = newProperties };
  };
};
