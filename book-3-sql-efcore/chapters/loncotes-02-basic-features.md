# Basic Features for Loncotes Library
Loncotes needs the same kind of CRUD endpoints you already built for Creek River, just applied to a new set of entities. Work through the requirements below, using Creek River as a reference for the pattern, not a script to copy. Test each endpoint with relevant data before you move on to the next one.

## Materials

### Get all Materials
The librarians would like to see a list of all the circulating materials. Include the `Genre` and `MaterialType`, and exclude materials that have an `OutOfCirculationSince` value (see [Removing a Material from Circulation](#removing-a-material-from-circulation) below for why). Same shape as [Getting a Campsite by Id with its CampsiteType](./creekriver-03-get-campsites.md#getting-a-campsite-by-id-with-its-campsitetype), just returning a filtered list instead of a single item.

### Get Materials by Genre and/or MaterialType
The librarians also like to search for materials by genre and type. Add `materialTypeId` and `genreId` query string params to the endpoint above. This is a step past the single optional filter you built for Honey Rae's, here you have _two_ independent optional filters, and a request might include both, either, or neither. [Capturing a query param in an endpoint](../../book-2-web-apis/chapters/honeyrae-06-query-string.md#capturing-a-query-param-in-an-endpoint) still gets you the nullable params you need, you'll just be checking two of them instead of one, each with its own `if` before you apply the corresponding `Where`.

### Get a Material
The librarians would like to see details for a material. Include the `Genre`, `MaterialType`, and `Checkouts` (as well as the `Patron` associated with each checkout, using `ThenInclude`, the same way you reached `CampsiteType` through `Campsite` for [Getting Reservations](./creekriver-07-get-reservations.md)). _Do not_ add the `Material` and `MaterialType` to each checkout.

### Add a Material
Materials are often added to the library's collection. Add an endpoint to create a new material, the same shape as [Create a Campsite](./creekriver-04-create-campsite.md).

### Removing a Material from Circulation
Add an endpoint that expects an id in the url, which sets the `OutOfCirculationSince` property of the matching material to `DateTime.Now`, the same _soft delete_ shape as [Cancelling a Reservation](./creekriver-08-book-reservation.md#cancelling-a-reservation), a nullable date flag instead of an actual `Remove`. The difference here is that the flag also needs to be filtered out of the normal "get all" results by default, the way you're already doing above.

### Get MaterialTypes
The librarians will need a form in their app that lets them choose material types. Add an endpoint that gets all of them, the same shape as [Getting all campsites](./creekriver-03-get-campsites.md#getting-all-campsites).

### Get Genres
The librarians will also need form fields with all of the genres to choose from. Same shape as the endpoint above.

## Patrons

### Get Patrons
The librarians want to see a list of library patrons. Same shape as [Getting all campsites](./creekriver-03-get-campsites.md#getting-all-campsites) again.

### Get a Patron with Checkouts
This endpoint should get a patron and include their checkouts, and further include the materials and their material types, the same `Include`/`ThenInclude` shape as [Getting Reservations](./creekriver-07-get-reservations.md).

### Update a Patron
Sometimes patrons move or change their email address. Add an endpoint that updates just those two properties, the same shape as [Update a Campsite's Details](./creekriver-06-campsite-update.md), just updating fewer fields.

### Deactivate a Patron
Sometimes patrons move out of the county. Add another soft delete, this time using an `IsActive` boolean on `Patron` instead of a nullable date, not every soft delete needs a timestamp, sometimes a flag is all you need.

## Checkouts

### Checkout a Material
The librarians need to be able to check out items for patrons. Add an endpoint to create a new `Checkout` for a material and patron, the same shape as [Creating a Reservation](./creekriver-08-book-reservation.md#creating-a-reservation). Set the checkout date on the server with `DateTime.Today`, rather than trusting the client to send it, the same way Car Builder set an order's [Timestamp](../../book-2-web-apis/chapters/honeyrae-09-put.md#creating-a-custom-endpoint-to-complete-a-ticket).

### Return a Material
The librarians need an endpoint to mark a checked out item as returned by checkout id. Update the checkout with a return date of `DateTime.Today`, the same shape as [Update a Campsite's Details](./creekriver-06-campsite-update.md), just updating one field.

Up Next: [Get Available Materials](./loncotes-03-get-available-materials.md)
