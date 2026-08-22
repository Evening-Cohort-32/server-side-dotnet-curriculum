# Filter Orders By Paint Color
In this chapter we will practice query string params again, the same way you used them to filter service tickets back in Honey Rae's, this time updating the `/orders` endpoint to optionally filter the orders by paint color.

## Capturing query params in an endpoint
The endpoints in our web APIs are capable of capturing the values passed in through query params by declaring handler params with the same names. Replace the `/orders` GET endpoint with this one:

``` csharp
app.MapGet("/orders", (int? paintId) =>
{
    foreach (Order order in orders)
    {
        order.Wheels = wheels.First(w => w.Id == order.WheelId);
        order.Technology = technologies.First(w => w.Id == order.TechnologyId);
        order.PaintColor = paints.First(w => w.Id == order.PaintId);
        order.Interior = interiors.First(w => w.Id == order.InteriorId);
    }

    List<Order> filteredOrders = orders.Where(o => !o.Fulfilled).ToList();

    // Now, check for the paintId property to see if we should filter by that as well
    if (paintId != null)
    {
        filteredOrders = filteredOrders.Where(order => order.PaintId == paintId).ToList();
    }

    return filteredOrders.Select(o => new OrderDTO
    {
        Id = o.Id,
        Timestamp = o.Timestamp,
        TechnologyId = o.TechnologyId,
        Technology = new TechnologyDTO
        {
            Id = o.Technology.Id,
            Package = o.Technology.Package,
            Price = o.Technology.Price
        },
        WheelId = o.WheelId,
        Wheels = new WheelsDTO
        {
            Id = o.Wheels.Id,
            Style = o.Wheels.Style,
            Price = o.Wheels.Price
        },
        InteriorId = o.InteriorId,
        Interior = new InteriorDTO
        {
            Id = o.Interior.Id,
            Material = o.Interior.Material,
            Price = o.Interior.Price
        },
        PaintId = o.PaintId,
        PaintColor = new PaintColorDTO
        {
            Id = o.PaintColor.Id,
            Color = o.PaintColor.Color,
            Price = o.PaintColor.Price
        },
    }).ToList();
});
```
This endpoint has a parameter called `paintId` that is a nullable integer, for the same reason `open` was nullable back in Honey Rae's: a missing query param still needs to pass _something_ into the handler, and making the param `int?` lets that missing value come through as `null` instead of the confusing default of `0`.

Try the endpoint with the following urls:
1. `/orders`
1. `/orders?paintId=1`

Notice that in the first case the endpoint still returns all of the orders, because the query param is optional, and you can see in the endpoint that we optionally filter the orders if the `paintId` is not null. With the second request, you should only see orders with the `paintId` of `1`. 


Up Next: [DeShawn's Dog Walking](./deshawns-01-setup.md)