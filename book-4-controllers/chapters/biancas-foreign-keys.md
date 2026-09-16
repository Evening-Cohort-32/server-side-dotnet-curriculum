# Referencing the Same Entity Twice
So far, every foreign key you've seen has followed a naming convention that EF Core can understand automatically: a property named `SomethingId` next to a property named `Something` tells EF Core "this is the foreign key for that navigation property." But `WorkOrder` needs to track two different relationships to the exact same entity type, `UserProfile`:
1. The mechanic currently assigned to fix the bike (if any)
1. The employee who opened the work order in the first place

Take a look at the `WorkOrder` class now:
> WorkOrder.cs
``` csharp
public class WorkOrder
{
    public int Id { get; set; }
    public string Description { get; set; }
    public DateTime DateInitiated { get; set; }
    public DateTime? DateCompleted { get; set; }

    public int? MechanicUserProfileId { get; set; }
    [ForeignKey("MechanicUserProfileId")]
    public UserProfile MechanicUserProfile { get; set; }

    public int InitiatedByUserProfileId { get; set; }
    [ForeignKey("InitiatedByUserProfileId")]
    public UserProfile InitiatedByUserProfile { get; set; }

    public int BikeId { get; set; }
    public Bike Bike { get; set; }
}
```
Notice that neither property is just called `UserProfile`. Once a second reference to the same entity is added, it isn't only the new one that needs a role-based name, both do. Otherwise it's easy to forget which one is "the real one" and which is "the extra one," when really they're two equally important relationships.

## The `ForeignKey` Attribute
Because both properties are of type `UserProfile`, naming convention alone can't tell EF Core which id property belongs to which navigation property. Both need a `[ForeignKey]` attribute so EF Core knows which id column populates which property:
1. `[ForeignKey("MechanicUserProfileId")]` tells EF Core that `MechanicUserProfileId` is the foreign key that should be used to populate the `MechanicUserProfile` property.
1. `[ForeignKey("InitiatedByUserProfileId")]` tells EF Core that `InitiatedByUserProfileId` is the foreign key that should be used to populate the `InitiatedByUserProfile` property.

You will need a `using` statement for this attribute:
``` csharp
using System.ComponentModel.DataAnnotations.Schema;
```

## Getting Both Relationships in a Query
Update the `GetIncompleteWorkOrders` method in `WorkOrderController` to also include the employee who initiated the work order:
> WorkOrderController.cs
``` csharp
[HttpGet("incomplete")]
[Authorize]
public IActionResult GetIncompleteWorkOrders()
{
    return Ok(_dbContext.WorkOrders
    .Include(wo => wo.Bike)
    .ThenInclude(b => b.Owner)
    .Include(wo => wo.Bike)
    .ThenInclude(b => b.BikeType)
    .Include(wo => wo.MechanicUserProfile)
    .Include(wo => wo.InitiatedByUserProfile)
    .Where(wo => wo.DateCompleted == null)
    .OrderBy(wo => wo.DateInitiated)
    .ThenByDescending(wo => wo.MechanicUserProfileId == null).ToList());
}
```
Test the endpoint again. Each work order in the response will now have both a `mechanicUserProfile` property (`null` if no mechanic is assigned yet) and an `initiatedByUserProfile` property (always populated, since every work order has to have been opened by someone).

Notice that nothing sets `InitiatedByUserProfileId` yet when a new work order gets created. We'll take care of that in the next chapter.

Up Next: [Creating a Work Order](./biancas-create-work-order.md)
