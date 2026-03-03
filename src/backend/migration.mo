import Map "mo:core/Map";
import Nat "mo:core/Nat";

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

  type Property = {
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
    postedBy : Principal;
    postedAt : Int;
    isActive : Bool;
  };

  type StripeConfiguration = {
    secretKey : Text;
    allowedCountries : [Text];
  };

  public type OldActor = {
    properties : Map.Map<Nat, Property>;
    nextId : Nat;
  };

  public type NewActor = {
    properties : Map.Map<Nat, Property>;
    nextId : Nat;
    stripeConfiguration : ?StripeConfiguration;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      stripeConfiguration = null
    };
  };
};
