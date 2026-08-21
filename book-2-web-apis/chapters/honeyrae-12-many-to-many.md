# Implementing the Many-to-Many Relationship
In this chapter we will implement the plan from the last chapter: a joining entity that lets a `ServiceTicket` have any number of `Employee`s assigned to it. Because this replaces a relationship that already existed, we'll also need to go back and amend a few endpoints we already built.

## Updating the data models
1. Create a new class called `ServiceTicketEmployee`, with `Id`, `ServiceTicketId`, and `EmployeeId` properties. This is our join table, each row in it will represent one employee's assignment to one ticket.
1. On the `ServiceTicket` class, remove the `EmployeeId` property entirely, a single value can no longer represent "these three employees." In its place, add a property to hold the employees assigned to it:
    ```csharp
    public List<Employee> Employees { get; set; }
    ```
1. Make the same change to `ServiceTicketDTO`: remove `EmployeeId` and `Employee`, and add:
    ```csharp
    public List<EmployeeDTO> Employees { get; set; }
    ```
1. `Employee` already has a `ServiceTickets` property from a few chapters back, you can leave that as it is.
1. Back in `Program.cs`, add a new collection alongside your other three, and seed it the same way you seeded the others, with collection initializers. Remove any `EmployeeId` values you were setting directly on a service ticket, that property is gone now, and add a few `ServiceTicketEmployee` rows instead, connecting some of your tickets to one or more employees:
    ```csharp
    List<ServiceTicketEmployee> serviceTicketEmployees = new List<ServiceTicketEmployee>
    {
        new ServiceTicketEmployee { Id = 1, ServiceTicketId = 1, EmployeeId = 1 },
        new ServiceTicketEmployee { Id = 2, ServiceTicketId = 1, EmployeeId = 2 },
    };
    ```
    Notice that both rows share the same `ServiceTicketId`, that's how ticket `1` ends up with two employees assigned to it. The `ServiceTicketId` and `EmployeeId` values you use have to match `Id`s that already exist in your `serviceTickets` and `employees` collections, just like any other foreign key you've seeded by hand so far.

## Getting employees for a ticket
Assume we have `serviceTickets`, `employees`, and `serviceTicketEmployees` collections holding our data. Getting the employees assigned to ticket `1` takes two steps, the same shape you'll use anywhere you need to cross a join table:
```csharp
List<ServiceTicketEmployee> ticketEmployeesFor1 = serviceTicketEmployees.Where(ste => ste.ServiceTicketId == 1).ToList();

List<Employee> employeesFor1 = ticketEmployeesFor1.Select(ste => employees.First(e => e.Id == ste.EmployeeId)).ToList();
```
The first step finds every join row for that ticket. The second step uses those rows to look up the actual `Employee` that each one points to.

## Updating the GET endpoints
Every endpoint that used to read `serviceTicket.EmployeeId` directly now needs to go through `serviceTicketEmployees` instead.

### The `/servicetickets` endpoint
In the endpoint that gets all service tickets (the one with the `open` filter), replace the DTO you're building for each ticket with this:
```csharp
return ticketsToReturn.Select(t => new ServiceTicketDTO
{
    Id = t.Id,
    CustomerId = t.CustomerId,
    Description = t.Description,
    Emergency = t.Emergency,
    DateCompleted = t.DateCompleted,
    Employees = serviceTicketEmployees
        .Where(ste => ste.ServiceTicketId == t.Id)
        .Select(ste => employees.First(e => e.Id == ste.EmployeeId))
        .Select(e => new EmployeeDTO
        {
            Id = e.Id,
            Name = e.Name,
            Specialty = e.Specialty
        }).ToList()
});
```

### The `/servicetickets/{id}` endpoint
Replace the lookup and DTO here too:
```csharp
app.MapGet("/servicetickets/{id}", (int id) =>
{
    ServiceTicket serviceTicket = serviceTickets.FirstOrDefault(st => st.Id == id);

    if (serviceTicket == null)
    {
        return Results.NotFound();
    }

    List<Employee> assignedEmployees = serviceTicketEmployees
        .Where(ste => ste.ServiceTicketId == id)
        .Select(ste => employees.First(e => e.Id == ste.EmployeeId))
        .ToList();

    return Results.Ok(new ServiceTicketDTO
    {
        Id = serviceTicket.Id,
        CustomerId = serviceTicket.CustomerId,
        Employees = assignedEmployees.Select(e => new EmployeeDTO
        {
            Id = e.Id,
            Name = e.Name,
            Specialty = e.Specialty
        }).ToList(),
        Description = serviceTicket.Description,
        Emergency = serviceTicket.Emergency,
        DateCompleted = serviceTicket.DateCompleted
    });
});
```
Notice what's missing: the null check and the nullable `int` trick we needed earlier for a single `Employee` that might not exist yet. An unassigned ticket just gets an empty `Employees` list instead of a `null` one, which is a perfectly good way to represent "nobody assigned yet" for a collection. One of the side benefits of a many-to-many relationship is that you don't have to think about that edge case anymore.

### The `/employees/{id}` endpoint
On this side, the direction of the lookup flips. Replace the line that finds an employee's tickets with this:
```csharp
List<int> ticketIds = serviceTicketEmployees
    .Where(ste => ste.EmployeeId == id)
    .Select(ste => ste.ServiceTicketId)
    .ToList();

List<ServiceTicket> tickets = serviceTickets.Where(st => ticketIds.Contains(st.Id)).ToList();
```
The rest of that endpoint, building the `EmployeeDTO` with its `ServiceTickets` property, doesn't need to change.

## Updating the assign endpoint
This is the endpoint that actually needs to create, update, and remove assignments, the `PUT` endpoint you wrote a few chapters ago. Remove the line that sets `EmployeeId`, and add this in its place:
```csharp
// remove the ticket's current employee assignments...
serviceTicketEmployees = serviceTicketEmployees.Where(ste => ste.ServiceTicketId != id).ToList();

// ...and add a new assignment for each employee the client sent
foreach (Employee employee in serviceTicket.Employees)
{
    ServiceTicketEmployee newAssignment = new ServiceTicketEmployee
    {
        ServiceTicketId = id,
        EmployeeId = employee.Id
    };
    newAssignment.Id = serviceTicketEmployees.Max(ste => ste.Id) + 1;
    serviceTicketEmployees.Add(newAssignment);
}
```
This endpoint now functions as the create, update, and delete for a ticket's employee assignments all at once, because the client sends the entire correct list of employees every time the ticket is updated. Rather than trying to figure out which assignments changed, we just clear out the old ones for this ticket and rebuild the list from what the client sent.

## Testing the changes
1. Restart the debugger, and use Yaak to `GET /servicetickets`. Confirm that each ticket now has an `employees` array instead of a single `employeeId`.
1. `PUT` an update to a ticket with two or three employees in its `employees` array. `GET` that ticket by `id` afterward, and confirm all of them show up.
1. `PUT` the same ticket again with a different, shorter list of employees. Confirm that the ticket's assignments now match exactly what you sent, not the union of the old and new lists.

## ✍️ Reflections
1. What would happen if you sent an empty `employees` array in a `PUT` request? Try it. Is that the behavior you'd want?

Up Next: [Car Builder](./carbuilder-01-setup.md)
