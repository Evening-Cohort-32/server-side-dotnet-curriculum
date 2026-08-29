# Tuber Treats: Self-Reflection :thinking:

## What this is

You've passed the automated tests for Tuber Treats. Nice work. Before your 1:1
review with an instructor, work through the questions below on your own and write
down real answers, not just a checkmark. Try to explain each one out loud or in
writing, the way you would to someone who's never seen the code.

This is individual. Be honest with yourself about where you're solid and where
you're not. That's the whole point.

- 🗣️ **We'll probably talk about this together.** Your Tuber Treats code gives a
  natural, concrete way to get into it.
- 📓 **Self-check only.** Nothing in this particular assessment forces it to come
  up (some of these are things you covered in Honey Rae's, Car Builder, or
  DeShawn's instead, not in Tuber Treats itself), so this is on you. Ask your
  instructor if anything here is unclear.

## HTTP & Web API Fundamentals

- 🗣️ Can I explain what a route is, and how a segment like `{id}` in
  `/tuberorders/{id}` gets its value at request time?
- 🗣️ Can I explain what an endpoint's handler (the function passed to
  `MapGet`/`MapPost`/`MapPut`/`MapDelete`) is responsible for doing?
- 🗣️ Can I explain the difference between `GET`, `POST`, `PUT`, and `DELETE`, and
  say why each of my endpoints uses the verb it does?
- 🗣️ Can I explain what an HTTP status code communicates, and name a couple I
  used in this project (e.g. `NotFound`, `Ok`, `BadRequest`) and when each fires?
- 🗣️ Can I walk through what happens between a client sending a request and my
  handler actually running?
- 📓 Can I explain what a query string parameter is, and how it's different from
  a route parameter like `{id}`?

## Data Serialization

- 🗣️ Can I explain how a C# object I return from a handler (like a `Customer`)
  turns into JSON in the response?
- 🗣️ Can I explain how a JSON request body turns into a C# object, like the
  `TuberOrder` parameter my `POST` handler receives?
- 📓 Can I explain what a DTO is and why an API might return one instead of
  returning its models directly? (Tuber Treats returns models directly. Is that
  a problem here, and if so, why or why not?)

## Modeling Data Relationships (Composition)

- 🗣️ Can I explain what "composition" means, using `TuberOrder` having a
  `Customer` property and a `TuberDriver` property as an example?
- 🗣️ Can I explain why `TuberTopping` exists as its own entity instead of
  `TuberOrder` just holding a `List<Topping>` directly? What kind of relationship
  does a join entity like this represent?
- 🗣️ Can I explain why `TuberDriverId` is a nullable `int?` but `CustomerId`
  isn't? What would break if `TuberDriverId` weren't nullable?
- 🗣️ Can I walk through, step by step, how my `GET /tuberorders/{id}` handler
  assembles one complete order (customer, driver, and toppings) out of four
  separate in-memory lists?

## Debugging & Tooling

- 📓 Can I set a breakpoint and step through a request handler in VS Code?
- 📓 Can I explain what Swagger/OpenAPI is for, and how I used it (or Yaak) to
  test an endpoint before wiring up a real client?

## Async/Await & Client Integration *(not required by Tuber Treats, self-check only)*

- 📓 Can I explain what `async`/`await` do in a JavaScript client's `fetch`
  calls, and why `await` can't be used just anywhere?
- 📓 Can I explain what CORS is, and why a browser-based client needs the API to
  allow it?
- 📓 Can I explain what a proxy setting does in a client project, and why we
  used one in Honey Rae's/Car Builder/DeShawn's?

## Bringing It Together

- 🗣️ Imagine you need to add a new endpoint to Tuber Treats: get all of a
  driver's orders that haven't been delivered yet. Walk through the technical
  process from route to response. What has to happen, in order?
- 🗣️ As a developer, what is the purpose of an HTTP request, in your own words?
- 📓 Why would it be a problem if a browser-based client connected directly to a
  database instead of going through an API like this one?
