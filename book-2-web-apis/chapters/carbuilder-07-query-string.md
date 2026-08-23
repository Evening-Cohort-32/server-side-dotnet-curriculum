# Filter Orders By Paint Color
In this exercise you'll practice query string params again, the same way you used them to filter service tickets back in Honey Rae's, this time adding an optional filter to the `/api/orders` endpoint so it can also filter by paint color. Work through the requirements below using [Honey Rae's](./honeyrae-06-query-string.md#capturing-a-query-param-in-an-endpoint) as a reference for the pattern, not a script to copy.

## Requirements
1. Add an optional `paintId` query string param to the `GET` `/api/orders` endpoint.
   - Use a nullable type for the param, for the same reason `open` was nullable back in Honey Rae's: a missing param still has to pass _something_ into the handler, and a nullable type lets that come through as `null` instead of a misleading default.
1. When `paintId` is provided, filter the results down to just the orders with that paint color, on top of whatever filtering the endpoint already does. When it's missing, the endpoint should behave exactly as it did before this exercise.
1. Test the endpoint with both of these:
   1. `/api/orders`
   1. `/api/orders?paintId=1`
1. Confirm the first case still returns every order it did before, and the second returns only orders with a `paintId` of `1`.

Up Next: [DeShawn's Dog Walking](./deshawns-01-setup.md)
