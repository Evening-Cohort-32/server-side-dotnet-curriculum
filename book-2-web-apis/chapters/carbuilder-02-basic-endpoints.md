# Basic CarBuilder Endpoints

In this chapter you will create the basic endpoints needed for the functionality of the car builder app.

Implement the following:

## `/wheels`, `/technologies`, `/interiors`, `/paintcolors`

Each of these options collections requires a `GET` endpoint to fetch all of the choices for that option. Add an endpoint for each that returns the whole collection.

## `/orders`

1. Create an endpoint that gets all orders. You'll come back to add related option data to this endpoint in a later chapter, for now it just needs to return the collection.
1. Create another endpoint that [creates an order](./honeyrae-07-create.md#creating-a-serviceticket) and adds it to the orders collection.
   - It needs to use the `POST` HTTP method, and should expect an order object in the JSON body of the HTTP request
   - Configure this endpoint to [add the `Timestamp`](./honeyrae-09-put.md#creating-a-custom-endpoint-to-complete-a-ticket) to the order on the server-side using `DateTime.Now`.
   - Include the code that [creates a new Id](./honeyrae-07-create.md#creating-the-endpoint) for the new `Order` object.
1. Test all of these endpoints before moving on.

Up Next: [Making Requests](./carbuilder-03-client-requests-cors.md)
