# Booking a Reservation and Cancelling
In this chapter you will add endpoints to create a reservation and cancel a reservation. Additionally, you will explore one way to handle bad input from the user. 

# Creating a Reservation

1. Add this endpoint to the project:
    ``` csharp
    app.MapPost("/api/reservations", (CreekRiverDbContext db, Reservation newRes) =>
    {
        db.Reservations.Add(newRes);
        db.SaveChanges();
        return Results.Created($"/api/reservations/{newRes.Id}", newRes);
    });
    ```
1. Test the endpoint with a JSON reservation object in Yaak (or Swagger). If you used valid values for all of the properties, you should get a `201` response with the new reservation in the body. This is the format for that JSON object:
    ``` json
    {
        "userProfileId": 1,
        "campsiteId": 1,
        "checkinDate": "2023-07-18",
        "checkoutDate": "2023-07-20"
    } 
    ```

1. Test the endpoint again, but provide at least one foreign key value that doesn't exist in the database (`userProfileId` or `campsiteId`). 

1. You should see a debugger message that the program threw a `DbUpdateException` because the update violated a foreign key constraint. If you let the program continue, you will see a `500` response with the same error in the body. 

1. Let's use `try`/`catch` to provide a better response:
    ``` csharp
    try
    {
        db.Reservations.Add(newRes);
        db.SaveChanges();
        return Results.Created($"/api/reservations/{newRes.Id}", newRes);
    }
    catch (DbUpdateException)
    {
        return Results.BadRequest("Invalid data submitted");
    }
    ```
1. Test the endpoint again to make sure that the logic works. We have not yet exhausted the edge cases that could break this endpoint. See if you can come up with some more! Do you have ideas about how to fix them? Try [this explorer chapter](./explorer-creekriver-01-reservation-validation.md) if you want to see some of them. 

## Cancelling a Reservation
Guests cancel reservations sometimes, so we need a way to handle that. Deleting the row outright, the way you did for a campsite, would work, but it would also erase any record that the reservation ever existed. For a booking history, that's usually not what you want, you'd rather be able to say "this reservation was cancelled" than have no record of it at all. Instead of removing the row, let's just mark it as cancelled. This is called a _soft delete_: rather than using `Remove`, we flag a row as inactive (or, in this case, cancelled) and leave it in the database.

1. Add a nullable `CancelledDate` property to `Reservation.cs` and `ReservationDTO`:
    ``` csharp
    public DateTime? CancelledDate { get; set; }
    ```
1. Adding a property to `ReservationDTO` doesn't automatically add it to the response, the `/api/reservations` endpoint from a few exercises back builds each `ReservationDTO` by hand, one property at a time, so it needs to be updated too. Add `CancelledDate` to that endpoint's `Select`, alongside `CheckoutDate`:
    ``` csharp
    CancelledDate = r.CancelledDate,
    ```
1. Since this adds a new column, create and run a new migration:
    ``` bash
    dotnet ef migrations add ReservationCancelledDate
    ```
    ``` bash
    dotnet ef database update
    ```
1. Add the endpoint:
    ``` csharp
    app.MapPost("/api/reservations/{id}/cancel", (CreekRiverDbContext db, int id) =>
    {
        Reservation reservation = db.Reservations.SingleOrDefault(r => r.Id == id);
        if (reservation == null)
        {
            return Results.NotFound();
        }
        reservation.CancelledDate = DateTime.Now;
        db.SaveChanges();
        return Results.NoContent();
    });
    ```
    This should look familiar, it's the same lookup-check-update-save shape as updating a campsite's details, we're just setting one field instead of several, and we never call `Remove`.
1. Test it: pick a reservation, `POST` to `/api/reservations/{id}/cancel`, then `GET /api/reservations` and confirm that reservation is still there, just with a `cancelledDate` now.

You'll use this same pattern again soon for materials and patrons in Loncotes County Library, marking a row inactive instead of deleting it, and filtering it out of the normal "get all" results by default.

Up Next: [Calculating Fees](./creekriver-09-calculated.md)