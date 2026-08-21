# Filtering `ServiceTicket`s with Query String Params
In this chapter we will add the ability to filter service tickets by their completion status, using a query string param, and finally answer the question we left hanging at the end of the last chapter: how do we build a more tailor-made `GET` endpoint, like one for getting all open service tickets?

## Query string params
Query string params allow us to pass data to an endpoint as part of the url that is sent to the server. A request can have multiple params in it, which always come after the `?` at the end of a url. Consider this request url:
```
https://www.example.com/resource/1?age=20&type=open
```
The above URL has two query string params:
1. `age`, with a value of 20
1. `type`, with a value of "open"

The `1` at the end of the URL is _not_ a query string param. You can tell because it comes before the `?`, not after. It is a _route parameter_, the same kind you've already been using to capture an `id`. Notice that when there are multiple query string params, they are separated by an `&`. Finally, it is important to note that query string params are _always optional_. Regardless of how many params (or none!) are after the question mark, a request to `https://www.example.com/resource/1` would still hit that same endpoint.

> It is important to note that you should generally only use primitive data types like strings and numbers as the values for your query params. It is common for beginners to try to pass entire objects as the value of a query string param, but this is generally a bad idea, and there are other ways to solve nearly any problem you are trying to use this strategy to solve.

## Capturing a query param in an endpoint
The endpoints in our web APIs are capable of capturing the values passed in through query params by declaring handler params with the same names. Replace the `GET` `/servicetickets` endpoint with this one:

```csharp
app.MapGet("/servicetickets", (bool? open) =>
{
    List<ServiceTicket> ticketsToReturn = serviceTickets;

    if (open == true)
    {
        ticketsToReturn = ticketsToReturn.Where(st => st.DateCompleted == null).ToList();
    }

    return ticketsToReturn.Select(t => new ServiceTicketDTO
    {
        Id = t.Id,
        CustomerId = t.CustomerId,
        EmployeeId = t.EmployeeId,
        Description = t.Description,
        Emergency = t.Emergency,
        DateCompleted = t.DateCompleted
    });
});
```

Try the endpoint with the following urls:
1. `/servicetickets`
1. `/servicetickets?open=true`

Notice that in the first case the endpoint still returns every service ticket, because the query param is optional, and the handler only filters when `open` is explicitly `true`. With the second request, you should only see tickets that don't have a `DateCompleted` yet.

### What did we just do?
This endpoint has a parameter called `open` that is a nullable boolean. It's nullable for the same reason `EmployeeId` became a nullable `int` back in the last book: if the type of `open` were a plain `bool`, and a request came in without the query param at all, ASP.NET would still have to pass _something_ in for the argument, and it would default to `false`. That would make a request with no `open` param indistinguishable from a request that explicitly asked for `?open=false`. Making the param `bool?` means a missing param comes through as `null`, so our handler can tell the difference between "no preference" and "explicitly asked for closed tickets."

## ✍️ Reflections
1. What would you need to change about this endpoint to also let a client filter for `emergency` tickets, in addition to (or instead of) open ones?

Up Next: [Creating a Service Ticket](./honeyrae-07-create.md)
