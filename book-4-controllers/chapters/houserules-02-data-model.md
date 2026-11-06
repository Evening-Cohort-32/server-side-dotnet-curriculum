# Creating the Data Model
In this chapter we will create the Models classes for House Rules, add code to `OnModelCreating` so that the database will be seeded with starting data, and finally build the database. 

## ERD for House Rules
You haven't been given user stories or wireframes for this project, but here is the ERD representing the data model for the system: 
![House Rules ERD](../../assets/house-rules-erd.png)

> **NOTE:** The ERD shows `UserName` and `Email` on `UserProfile`, but in this project they live on the `IdentityUser`, the same as in Bianca's Bikes. Use the `UserProfile` class you copied from Bianca's Bikes. Don't add `UserName` or `Email` columns to it, because the `Register` endpoint never sets them, and every registration would fail.

Use this ERD to create classes in the `Models` folder to match. Like the rest of this book, you can return entities directly from your endpoints, and you don't need to create any new DTOs unless you want to (the one exception is noted in the next chapter). Remember to use _composition_ to add `List` or single object properties to represent related data. For example, the `Chore` class will need a `List<ChoreCompletion>` property to allow getting all related `ChoreCompletion` objects, and `ChoreAssignment` will require a `Chore` property in order get related chore data. 

Remember that nullable types marked as `NOT NULL` (`NN` on the ERD) need the `[Required]` attribute to be `NOT NULL` in the database. Since you turned off `<Nullable>` in the setup chapter, every `string` is a nullable type, so use `[Required]` on every `string` the ERD marks `NN`. That includes `FirstName`, `LastName`, `Address`, and `IdentityUserId` on the `UserProfile` you copied, since Bianca's Bikes' `UserProfile` doesn't have them.

Then add a `DbSet` property to `HouseRulesDbContext` for each of your new classes (`Chores`, `ChoreAssignments`, and `ChoreCompletions`), next to the `UserProfiles` one you kept in the setup chapter.

> **NOTE:** When you return entities with related data, you'll see `null` in places you might not expect, like `"choreAssignments": [null]` inside a chore. This isn't broken data. The `Program.cs` you copied from Bianca's Bikes tells the JSON serializer to ignore cycles, so when an object would point back to one that's already being sent, it's written as `null` instead. Only use related data at the level you included it, and don't `.map` over a nested list like that one in the client, since its items can be `null`.

## Create Seed Data
Use the `OnModelCreating` method in the `HouseRulesDbContext` class to add data to the database when it is created. There should already be code for creating an Admin role, an admin `IdentityUser`, and giving that `IdentityUser` the role of `Admin` with a row in `UserRoles`. Add to that:
1. At least five chores (The difficulty can be between 1 and 5, though you can choose a different range if you like. `ChoreFrequencyDays` represents how often, in days, a chore should be completed. For example, "Mow the Lawn" needs to get done every 14 days, and has a difficult of 4). 
1. At least two `ChoreAssignment`s. These represent the chores a user is currently assigned. You can just assign them to the one admin user that will be created when the database is created. 
1. At least one `ChoreCompletion`. These represent individual completions of a chore, and can be completed by any user, not only users that are assigned that chore. 

## Migrate the Database
Create an initial migration, and then update the database!

Up Next: [Basic Endpoints](./houserules-03-basic-endpoints.md)