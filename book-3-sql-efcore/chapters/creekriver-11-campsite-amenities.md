# Implementing Campsite Amenities
In this chapter we will implement the simpler of the two features from the last chapter: a many-to-many relationship, with no payload, between `Campsite` and a new `Amenity` entity.

## Adding the `Amenity` model
Add an `Amenity.cs` file to the `Models` folder:
``` csharp
using System.ComponentModel.DataAnnotations;

namespace CreekRiver.Models;

public class Amenity
{
    public int Id { get; set; }
    [Required]
    public string AmenityName { get; set; }
}
```

## Connecting `Campsite` and `Amenity`
Since there's nothing to track about the pairing beyond "this campsite has this amenity," we don't need to write a join class at all. We can let EF Core infer the whole join table for us, just by adding a list property to each side:

1. On the `Campsite` class, add:
    ``` csharp
    public List<Amenity> Amenities { get; set; }
    ```
1. On the `Amenity` class, add:
    ``` csharp
    public List<Campsite> Campsites { get; set; }
    ```
EF Core will notice that a `Campsite` has many (a List!) `Amenity` entities, and that an `Amenity` has many `Campsite`s for the same reason, and will infer a join table between them when it creates the database. You never have to write a class for that join table yourself.
1. Add an `AmenityDTO` with `Id` and `AmenityName`.
1. On `CampsiteDTO`, add:
    ``` csharp
    public List<AmenityDTO> Amenities { get; set; }
    ```

## Updating the `DbContext`
1. Add a `DbSet` property to `CreekRiverDbContext`:
    ``` csharp
    public DbSet<Amenity> Amenities { get; set; }
    ```
1. Seed a few amenities, inside `OnModelCreating`:
    ``` csharp
    modelBuilder.Entity<Amenity>().HasData(new Amenity[]
    {
        new Amenity {Id = 1, AmenityName = "WiFi"},
        new Amenity {Id = 2, AmenityName = "Fire Pit"},
        new Amenity {Id = 3, AmenityName = "Water Hookup"},
        new Amenity {Id = 4, AmenityName = "Pet Friendly"}
    });
    ```
1. Because there's no `CampsiteAmenity` class in your code, seeding that join table looks a little different, you have to identify it with a string instead of a type. EF Core names an inferred join table by combining the two entity names in alphabetical order, so this one is called `AmenityCampsite`. Its columns are named after each side's list property, with `Id` appended, `AmenitiesId` and `CampsitesId`:
    ``` csharp
    modelBuilder.Entity("AmenityCampsite").HasData(new object[]
    {
        new {AmenitiesId = 1, CampsitesId = 1},
        new {AmenitiesId = 2, CampsitesId = 1},
        new {AmenitiesId = 2, CampsitesId = 2}
    });
    ```
    Make sure the `AmenitiesId` and `CampsitesId` values you use match `Id`s that already exist in your `Amenities` and `Campsites` data.

## Creating and running the migration
1. Run:
    ``` bash
    dotnet ef migrations add CampsiteAmenities
    ```
1. Then:
    ``` bash
    dotnet ef database update
    ```
1. Open pgAdmin and confirm you now have an `Amenities` table and an `AmenityCampsite` table.

## Getting a campsite's amenities
Update the endpoint that gets a single campsite by id to include its amenities:
``` csharp
app.MapGet("/api/campsites/{id}", (CreekRiverDbContext db, int id) =>
{
    return db.Campsites
        .Include(c => c.CampsiteType)
        .Include(c => c.Amenities)
        .Select(c => new CampsiteDTO
        {
            Id = c.Id,
            Nickname = c.Nickname,
            CampsiteTypeId = c.CampsiteTypeId,
            CampsiteType = new CampsiteTypeDTO
            {
                Id = c.CampsiteType.Id,
                CampsiteTypeName = c.CampsiteType.CampsiteTypeName,
                FeePerNight = c.CampsiteType.FeePerNight,
                MaxReservationDays = c.CampsiteType.MaxReservationDays
            },
            Amenities = c.Amenities.Select(a => new AmenityDTO
            {
                Id = a.Id,
                AmenityName = a.AmenityName
            }).ToList()
        })
        .Single(c => c.Id == id);
});
```
Notice that `Include(c => c.Amenities)` works exactly the same way as any other `Include` you've written so far, even though there's no `CampsiteAmenity` class anywhere in your code. EF Core still knows how to join across that inferred table for you.

## Setting a campsite's amenities
Add an endpoint that lets you set which amenities a campsite offers, replacing whatever list it had before:
``` csharp
app.MapPut("/api/campsites/{id}/amenities", (CreekRiverDbContext db, int id, List<int> amenityIds) =>
{
    Campsite campsite = db.Campsites.Include(c => c.Amenities).SingleOrDefault(c => c.Id == id);
    if (campsite == null)
    {
        return Results.NotFound();
    }
    campsite.Amenities = db.Amenities.Where(a => amenityIds.Contains(a.Id)).ToList();
    db.SaveChanges();
    return Results.NoContent();
});
```
Because `Amenities` is just a regular `List<Amenity>` property, we can reassign it directly to whatever amenities the client asked for, and `SaveChanges` figures out on its own which rows to add or remove from the inferred join table. There's no join table code for you to manage by hand.

Test this endpoint with a body like:
``` json
[1, 2, 4]
```

## Testing the changes
1. Restart the debugger and `GET /api/campsites/{id}` for a campsite with amenities seeded. Confirm you see an `amenities` array with the names you expect.
1. `PUT` a different set of amenity ids to a campsite, then `GET` it again to confirm the list changed to match exactly what you sent.

Up Next: [Reservation Activities](./creekriver-12-reservation-activities.md)
