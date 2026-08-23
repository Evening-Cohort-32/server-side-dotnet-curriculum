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

## Filtering from the client
The point of this exercise is the query param on the API, not front end work, so here's the client-side half of it directly rather than something to puzzle out.

1. Update `getOrders` to accept an optional `paintId`, and append it to the URL only when one is provided:
    ``` javascript
    export const getOrders = async (paintId) => {
      const url = paintId
        ? `https://localhost:<port>/api/orders?paintId=${paintId}`
        : `https://localhost:<port>/api/orders`;
      const res = await fetch(url);
      const data = await res.json();
      return data;
    };
    ```
1. Add a `<select>` above the orders list, populated from `getPaints()`, with an option for "All" alongside each paint color:
    ``` javascript
    const paints = await getPaints();
    `<select id="paintFilter">
        <option value="">All</option>
        ${paints.map(p => `<option value="${p.id}">${p.color}</option>`).join("")}
    </select>`
    ```
1. Add a change listener on that `<select>` that calls `getOrders` again with the chosen value (or nothing, for "All") and re-renders the orders list, the same way you've been triggering re-renders elsewhere in this app.
1. Test it in the browser: changing the dropdown should update which orders are shown.

Up Next: [DeShawn's Dog Walking](./deshawns-01-setup.md)
