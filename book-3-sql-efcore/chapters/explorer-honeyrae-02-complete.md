# Completing Honey Rae's with Npgsql
In this chapter you will replace the rest of the endpoints from the Honey Rae's API that you built in Book 2 with endpoints that hit the Postgresql database you created in Book 3

## Using `IsDBNull` to check for nullable columns
One issue with `null` values in C# is that they cannot be directly from the database's NULL. This is because in the database, `NULL` represents an absence of value, rather than a value of `null`, as it is in C#. This means that you need to check for NULL database values before trying to get a string or other type out of a column which is nullable. Here is an example of this with `DateCompleted` (a nullable column in the `ServiceTicket` table):
``` csharp
app.MapGet("/api/servicetickets", () =>
{
    List<ServiceTicket> serviceTickets = new List<ServiceTicket>();
    using NpgsqlConnection connection = new NpgsqlConnection(connectionString);
    connection.Open();
    using NpgsqlCommand command = connection.CreateCommand();
    command.CommandText = @"
    SELECT * FROM ServiceTicket
    ";
    using NpgsqlDataReader reader = command.ExecuteReader();
    while (reader.Read())
    {
        serviceTickets.Add(new ServiceTicket
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            CustomerId = reader.GetInt32(reader.GetOrdinal("CustomerId")),
            Description = reader.GetString(reader.GetOrdinal("Description")),
            Emergency = reader.GetBoolean(reader.GetOrdinal("Emergency")),
            DateCompleted = reader.IsDBNull(reader.GetOrdinal("DateCompleted")) ?
                null : reader.GetDateTime(reader.GetOrdinal("DateCompleted"))
        });
    }
    return serviceTickets;
});
```   
As you can see above, this endpoint uses a ternary and `IsDBNull` to either set the property as `null` if it is `NULL` in the database, otherwise, it proceeds to get the value with `GetDateTime`. Notice this endpoint doesn't try to include the ticket's assigned employees at all, `SELECT * FROM ServiceTicket` only has columns for a single ticket, getting the employees would mean joining out to `ServiceTicketEmployee` and `Employee`, which is its own can of worms, tackled next.

## Getting One Service Ticket 
This endpoint requires using `JOIN`s to get the `Customer` and `Employee` data along with the ticket. `CustomerId` is required, and there's only one customer for a ticket, but employees are a different story, a ticket can have any number of employees assigned to it (including zero), so getting them means joining through `ServiceTicketEmployee` the same way you joined from `Employee` out to `ServiceTicket` in the guided tour, just starting from the other side. Because of that, this query can return anywhere from one row (a ticket with no assigned employees, or exactly one) to several rows (one per assigned employee), so you'll need the same `while` loop / "have I already set the ticket's own data" pattern you used to get an employee with their tickets, not a simple `if (reader.Read())`. See if you can write this one on your own!

## Deleting a service ticket
Unlike in the one-to-many version of this schema, `ServiceTicket` now has a dependent: `ServiceTicketEmployee` rows reference it too. Deleting a ticket that still has employees assigned to it will hit the same kind of foreign key problem you already solved for deleting an employee, so you'll need to handle it the same way (see the cascade-delete explorer chapter for the available strategies) before this endpoint will work for a ticket with assignments.

## Complete a Service Ticket
Even though this endpoint uses the `POST` HTTP method, in the database it is an update of a service ticket. Unlike a normal update, you are not getting any data from the request, only a service ticket id in the URL. Use the id as a param in the SQL query to update the `DateCompleted` column to be today. You can use `DateTime.Today` in C# to do this, or you can do it directly in the update SQL query with `DateCompleted = LOCALTIMESTAMP(0)`. 

## More endpoints
The following endpoints will look similar to their counterparts for the `Employee` table:
- get customers
- get one customer with service tickets
- create a service ticket

The endpoint to update a service ticket's assigned employees is its own case, it's not update-a-row-in-place like the others. Rewriting a ticket's assignments means clearing out its existing `ServiceTicketEmployee` rows and inserting a new row for each employee the client sent, the same replace-everything approach you used for this same endpoint back in Book 2, just as `DELETE`/`INSERT` statements instead of LINQ.

## Cleaning up Program.cs
Once every endpoint above is rewritten, every `Employee`, `Customer`, and `ServiceTicket` endpoint in your API reads from and writes to the database, none of them fall back to the `customers`, `employees`, `serviceTickets`, or `serviceTicketEmployees` collections you seeded at the top of `Program.cs` all the way back in Book 2. Those collections aren't doing anything anymore. Go ahead and comment them out or delete them entirely, whichever you prefer, your API will behave exactly the same either way.

