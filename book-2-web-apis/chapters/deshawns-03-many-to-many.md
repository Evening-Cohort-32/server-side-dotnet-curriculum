# Handling Walker Cities in Deshawn's Dog Walking
In DeShawn's Dog Walking, a city can have many walkers in it, and a walker can walk in many cities. Therefore, the relationship between walker and city is _many-to-many_, the same shape you already built for `ServiceTicket`s and `Employee`s back in [Honey Rae's](./honeyrae-12-many-to-many.md). The idea is the same here, applied to a new pair of entities. Work through the requirements below with your pair, using that chapter as a reference for the pattern, not a script to copy.

## Requirements
1. Add a `Walker` class, a `City` class, and a joining `WalkerCity` class to connect them, with a `WalkerId` and a `CityId`.
   - `Walker` needs a `Cities` property to hold a walker's related city data.
   - `City` needs a `Walkers` property to hold a city's related walker data.
1. Update the `GET` endpoints so that each walker in the response includes its cities, and each city includes its walkers.
1. Build a `PUT` endpoint for updating a walker's cities. The client will send a walker object with the full, correct list of `Cities` the walker should be associated with.
   - This one endpoint has to account for cities being added, cities being removed, and cities that are unaffected, since the client is only sending you the final list, not a diff.
1. Test each endpoint as you complete it.

Up Next: [Coding Self-Assessment](./assessment-02.md)