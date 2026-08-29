# EF Corner Store: Self-Reflection :thinking:

## What this is

You've passed the automated tests for Corner Store. Nice work. Before your 1:1
review with an instructor, work through the questions below on your own and write
down real answers, not just a checkmark. Try to explain each one out loud or in
writing, the way you would to someone who's never seen the code.

This is individual. Be honest with yourself about where you're solid and where
you're not. That's the whole point.

- 🗣️ **We'll probably talk about this together.** Your Corner Store code gives a
  natural, concrete way to get into it.
- 📓 **Self-check only.** Nothing in this particular assessment forces it to come
  up, so this is on you. Ask your instructor if anything here is unclear.

## EF Core & the DbContext

- 🗣️ Can I explain what `CornerStoreDbContext` is, and what it means that it
  inherits from `DbContext`?
- 🗣️ Can I explain what a `DbSet<T>` property (like `Cashiers` or `Products`)
  represents?
- 🗣️ Can I explain what `: base(context)` is doing in the `CornerStoreDbContext`
  constructor?
- 🗣️ Can I explain what a connection string is, and why it lives in user secrets
  instead of directly in my code?

## Migrations & Seeding Data

- 🗣️ Can I explain what a migration is, and what running one actually does to my
  database?
- 🗣️ Can I explain what `OnModelCreating` and `HasData` are for?
- 📓 Can I explain what would happen if I changed a model's properties after
  already running a migration? What would I need to do next?

## Data Annotations & Validation

- 🗣️ Can I explain what `[Required]` does, and what happens if I try to save an
  entity without a required property set?
- 📓 Can I name another data annotation besides `[Required]` and what it's for?

## Relationships & Navigation Properties

- 🗣️ Can I explain the relationship between `Product` and `Category`? Which side
  holds the foreign key, and which side holds the collection?
- 🗣️ Can I explain why `OrderProduct` exists as its own entity instead of `Order`
  just having a `List<Product>` directly? (Same question as Tuber Treats' Book 2
  assessment. Does the answer still hold here?)
- 🗣️ Can I explain the difference between a foreign key property (like
  `CategoryId`) and a navigation property (like `Category`) on the same class?

## Querying Related Data

- 🗣️ Can I explain what `Include` and `ThenInclude` do, and what happens to
  related data if I forget them?
- 🗣️ Can I compare how I fetched related data here (`Include`/`ThenInclude`) to
  how I fetched related data in Tuber Treats (Book 2)? What changed, and why?
- 🗣️ Can I explain the difference between `Single`/`SingleOrDefault` and
  `First`/`FirstOrDefault`? What happens if more than one row matches when you use
  `Single`?
- 📓 Can I explain what `GroupBy` does, and how it's different from `Where`?
  (Only relevant if you attempted the `/products/popular` extra challenge.)

## Computed Properties

- 🗣️ Can I explain how `Order.Total` gets calculated, and why it's a
  getter-only property instead of a regular stored column?
- 🗣️ Can I explain how `Cashier.FullName` works, and why it doesn't need a
  `[Required]` annotation the way `FirstName` and `LastName` do?

## API Response Shapes

- 🗣️ Can I explain the difference between `Results.Created`, `Results.NoContent`,
  `Results.Ok`, and `Results.NotFound`? When does each one apply?
- 🗣️ Can I explain what a circular reference is in the context of returning
  `Cashier` → `Orders` → `Cashier` as JSON, and how my project avoids it?
- 📓 Can I explain what a soft delete is, and why Corner Store's `DELETE /orders/{id}`
  doesn't use one? (You'll see soft deletes in Loncotes.)

## Bringing It Together

- 🗣️ Walk through, step by step, what happens between a client calling
  `GET /orders/{id}` and the JSON response they get back (from route, to query,
  to the database, to serialization).
- 🗣️ If you needed to add a new required field to `Product` tomorrow, what's the
  full technical process, from the model change to the database actually having
  the new column?
- 📓 What would break if two different requests tried to update the same `Order`
  at the same time? Is that something this project currently protects against?
