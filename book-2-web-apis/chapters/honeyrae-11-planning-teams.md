# Planning a New Feature: Team Repairs
In this chapter we will practice a skill that matters just as much as writing code: pausing to replan before making a change that affects your data model. Honey Rae's has a new business requirement, and before we touch `Program.cs` we're going to write a user story and revisit our ERD to understand exactly what's about to change, and why.

## A new requirement
Honey Rae's has grown, and some repairs are complex enough that they need more than one technician working on them at the same time. Right now, a `ServiceTicket` can only be assigned to a single `Employee`, using the `EmployeeId` property. We need to change that so a ticket can have a whole team assigned to it.

## Writing the user story
Back in a previous chapter, we noted that being able to write user stories is an important skill, one you'll be required to practice for real, from scratch, in your next project, DeShawn's Dog Walking, and that you'll need again for your capstone. For now, let's just write the stories for this one feature, using the same GIVEN/WHEN/THEN format:

1. As a shop owner, I want to assign more than one employee to a service ticket, so that complex repairs can be handled by a team.
    - GIVEN a service ticket needs more than one technician
    - WHEN an employee is assigned to that ticket
    - THEN that assignment should not remove any other employee already assigned to the ticket
1. As a shop owner, I want to see every employee assigned to a service ticket, so that I know who is working on it.
    - GIVEN a service ticket has one or more employees assigned to it
    - WHEN I view that ticket's details
    - THEN I should see the name of every employee assigned to it, not just one

## Revisiting the ERD
A few chapters ago, we described the relationship between `ServiceTicket` and `Employee` this way: an employee can have many service tickets, but a service ticket has at most one employee assigned to it. That's a one-to-many relationship, and it's exactly what our `EmployeeId` property on `ServiceTicket` was built to represent.

Our new user story breaks the second half of that sentence. A `ServiceTicket` now needs to be able to have many `Employee`s, and an `Employee` can obviously still work on many `ServiceTicket`s. When both sides of a relationship can have many of the other, that's called a _many-to-many_ relationship, and a single `EmployeeId` property can't represent it. There's no single value we could put in that property that captures "these three employees."

Representing a many-to-many relationship takes a third entity in the middle, one that just connects the other two. You'll hear these called join tables, bridge tables, or junction tables. Ours will need a `ServiceTicketId` and an `EmployeeId`, and each row in it will represent one employee's assignment to one ticket. A ticket with three employees assigned to it would have three rows in this new table, one per employee, all sharing the same `ServiceTicketId`.

Take a few minutes now to update your own ERD for `HoneyRaesAPI`: remove the direct relationship line between `ServiceTicket` and `Employee`, add a new entity between them for the join table, and draw the two one-to-many relationships that connect it to each side. This is exactly the kind of check you should get in the habit of making anytime a new requirement changes how your entities relate to each other, before you start changing code.

## ✍️ Reflections
1. Why can't we solve this by just changing `EmployeeId` to a `List<int>`? What would that break, or fail to represent correctly?

Up Next: [Implementing the Many-to-Many Relationship](./honeyrae-12-many-to-many.md)
