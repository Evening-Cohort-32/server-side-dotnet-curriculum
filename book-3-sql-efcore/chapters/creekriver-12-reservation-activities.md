# Implementing Reservation Activities
In this chapter we will implement the second feature from the planning chapter: a many-to-many relationship between `Reservation` and a new `Activity` entity, this time with a payload.

## Adding the `Activity` model
Add an `Activity.cs` file to the `Models` folder:
``` csharp
using System.ComponentModel.DataAnnotations;

namespace CreekRiver.Models;

public class Activity
{
    public int Id { get; set; }
    [Required]
    public string ActivityName { get; set; }
    public decimal Price { get; set; }
}
```

## Adding the join entity
Unlike `Amenity` and `Campsite` in the last chapter, this relationship needs a payload, the `Quantity` of an activity on a given reservation. That means we can't let EF Core infer the join table for us this time, we have to write its class ourselves, so that we have somewhere to put that extra column.

1. Add a `ReservationActivity.cs` file to the `Models` folder:
    ``` csharp
    namespace CreekRiver.Models;

    public class ReservationActivity
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; }
        public int ActivityId { get; set; }
        public Activity Activity { get; set; }
        public int Quantity { get; set; }
    }
    ```
    EF Core will notice `ReservationId` and `ActivityId` and create foreign key constraints to `Reservation` and `Activity`, the same way it has for every other foreign key you've defined so far. `Quantity` is just a regular column on this table, it's the payload we talked about in the planning chapter.
1. On the `Reservation` class, add a property to hold the activities added to it:
    ``` csharp
    public List<ReservationActivity> ReservationActivities { get; set; }
    ```
    Notice that this is a list of `ReservationActivity`, not a list of `Activity`, the way `Campsite.Amenities` was a list of `Amenity` directly. If we stored a `List<Activity>` directly on `Reservation`, we'd have no place to put each activity's `Quantity`. Going through the join entity gives us access to the payload alongside each related `Activity`.
1. Add matching DTOs: an `ActivityDTO` with `Id`, `ActivityName`, and `Price`, and a `ReservationActivityDTO` with `Id`, `ActivityId`, `Quantity`, and an `Activity` property of type `ActivityDTO`.
1. On `ReservationDTO`, add:
    ``` csharp
    public List<ReservationActivityDTO> ReservationActivities { get; set; }
    ```

## Updating the `DbContext`
1. Add two more `DbSet` properties to `CreekRiverDbContext`:
    ``` csharp
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ReservationActivity> ReservationActivities { get; set; }
    ```
1. Seed a few activities, inside `OnModelCreating`:
    ``` csharp
    modelBuilder.Entity<Activity>().HasData(new Activity[]
    {
        new Activity {Id = 1, ActivityName = "Guided Fishing Trip", Price = 45.00M},
        new Activity {Id = 2, ActivityName = "Firewood Bundle", Price = 8.00M},
        new Activity {Id = 3, ActivityName = "Canoe Rental", Price = 30.00M}
    });
    ```
1. Seed a couple of `ReservationActivity` rows too, connecting some of the reservations you already seeded to one or more activities. Because `ReservationActivity` is a real class, this seed call looks like every other `HasData` call you've written, no string-based table name needed this time:
    ``` csharp
    modelBuilder.Entity<ReservationActivity>().HasData(new ReservationActivity[]
    {
        new ReservationActivity {Id = 1, ReservationId = 1, ActivityId = 2, Quantity = 3},
        new ReservationActivity {Id = 2, ReservationId = 1, ActivityId = 1, Quantity = 1}
    });
    ```

## Creating and running the migration
1. Run:
    ``` bash
    dotnet ef migrations add ReservationActivities
    ```
1. Then:
    ``` bash
    dotnet ef database update
    ```
1. Open pgAdmin and confirm you now have `Activities` and `ReservationActivities` tables.

## Getting a reservation's activities
Update the `/api/reservations` endpoint from a few chapters back to include the new relationship:
``` csharp
app.MapGet("/api/reservations", (CreekRiverDbContext db) =>
{
    return db.Reservations
        .Include(r => r.UserProfile)
        .Include(r => r.Campsite)
        .ThenInclude(c => c.CampsiteType)
        .Include(r => r.ReservationActivities)
        .ThenInclude(ra => ra.Activity)
        .OrderBy(res => res.CheckinDate)
        .Select(r => new ReservationDTO
        {
            Id = r.Id,
            CampsiteId = r.CampsiteId,
            UserProfileId = r.UserProfileId,
            CheckinDate = r.CheckinDate,
            CheckoutDate = r.CheckoutDate,
            UserProfile = new UserProfileDTO
            {
                Id = r.UserProfile.Id,
                FirstName = r.UserProfile.FirstName,
                LastName = r.UserProfile.LastName,
                Email = r.UserProfile.Email
            },
            Campsite = new CampsiteDTO
            {
                Id = r.Campsite.Id,
                Nickname = r.Campsite.Nickname,
                ImageUrl = r.Campsite.ImageUrl,
                CampsiteTypeId = r.Campsite.CampsiteTypeId,
                CampsiteType = new CampsiteTypeDTO
                {
                    Id = r.Campsite.CampsiteType.Id,
                    CampsiteTypeName = r.Campsite.CampsiteType.CampsiteTypeName,
                    MaxReservationDays = r.Campsite.CampsiteType.MaxReservationDays,
                    FeePerNight = r.Campsite.CampsiteType.FeePerNight
                }
            },
            ReservationActivities = r.ReservationActivities.Select(ra => new ReservationActivityDTO
            {
                Id = ra.Id,
                ActivityId = ra.ActivityId,
                Quantity = ra.Quantity,
                Activity = new ActivityDTO
                {
                    Id = ra.Activity.Id,
                    ActivityName = ra.Activity.ActivityName,
                    Price = ra.Activity.Price
                }
            }).ToList()
        })
        .ToList();
});
```
Notice that `Include(r => r.ReservationActivities).ThenInclude(ra => ra.Activity)` reads the same way any other `Include`/`ThenInclude` pair has so far, a many-to-many relationship with a payload is still, under the hood, just two one-to-many relationships (`Reservation` to `ReservationActivity`, and `ReservationActivity` to `Activity`) glued together. Because `ReservationActivities` is a list, we build its DTOs with `Select` inside the outer `Select`, the same way you would map any other collection of related data.

## Updating `TotalCost`
Now that a reservation can have activities, its `TotalCost` should include what they cost too. Update the `TotalCost` property you added to `ReservationDTO` back in the Calculating Total Nights and Total Cost chapter:
``` csharp
public decimal TotalCost
{
    get
    {
        decimal activitiesCost = ReservationActivities.Sum(ra => ra.Activity.Price * ra.Quantity);
        return Campsite.CampsiteType.FeePerNight * TotalNights + _reservationBaseFee + activitiesCost;
    }
}
```
`Sum` is a Linq method you haven't used yet. It adds up a value across every item in a collection, here, the price of each activity multiplied by how many the guest wants, for every activity on the reservation. If a reservation has no activities, `ReservationActivities` will be an empty list, not `null` (the endpoint below always sets it, even when there's nothing in it), so `Sum` still works and just contributes `0`.

Test the reservations endpoint again, and confirm `totalCost` now reflects any activities you've added to a reservation.

## Adding an activity to a reservation
In the last chapter, setting a campsite's amenities was a single `PUT` that replaced the whole list at once, because a plain `List<Amenity>` was all EF Core needed to figure out the rest. That shortcut doesn't work here: there's no flat list of ids we could send that would also carry each activity's quantity. Instead, let's add one activity at a time:
``` csharp
app.MapPost("/api/reservations/{id}/activities", (CreekRiverDbContext db, int id, ReservationActivity newReservationActivity) =>
{
    newReservationActivity.ReservationId = id;
    try
    {
        db.ReservationActivities.Add(newReservationActivity);
        db.SaveChanges();
        return Results.Created($"/api/reservations/{id}/activities/{newReservationActivity.Id}", newReservationActivity);
    }
    catch (DbUpdateException)
    {
        return Results.BadRequest("Invalid data submitted");
    }
});
```
This should look familiar, it's the same shape as creating a reservation back in the Booking Reservations chapter: take the `id` from the route to set the foreign key, add the new row, save, and catch the `DbUpdateException` that would come from an `ActivityId` that doesn't exist.

Test this endpoint with a body like:
``` json
{
    "activityId": 3,
    "quantity": 1
}
```

## Testing the changes
1. Restart the debugger and `GET /api/reservations`. Confirm each reservation now has a `reservationActivities` array, with the nested `activity` data and a `quantity` for each.
1. `POST` a new activity onto one of your reservations, then `GET /api/reservations` again to confirm it shows up.

## Summary
This is the end of the walk-through for Entity Framework Core. Before moving to the second column, do the "Up Next" Chapter on Inheritance. After finishing the other columns, check out the explorer chapters for this project.

Up Next: [Inheritance](https://github.com/nashville-software-school/bangazon-inc/blob/server-side-curriculum/book-1-orientation/chapters/INHERITANCE_INTRO.md) - this is from another repo, come back to this repo to start [Loncotes County Library](./loncotes-01-setup.md) after finishing the inheritance chapter.
