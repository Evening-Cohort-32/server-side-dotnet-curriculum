# Planning Two New Features: Amenities and Activities
In this chapter we will practice a skill that matters just as much as writing code: pausing to replan before making a change that affects your data model. Creek River has two new business requirements, and both of them need a relationship you haven't built yet. Before we touch any models, let's write user stories for each and think through what's about to change, and why.

## Requirement 1: Campsite Amenities
Creek River wants guests to be able to see which amenities a campsite offers, things like WiFi, a fire pit, a water hookup, or being pet friendly. The same amenity, "Fire Pit," can apply to many different campsites, and a single campsite usually offers more than one amenity.

1. As a guest, I want to see which amenities a campsite offers, so that I can pick a site that has what I need.
    - GIVEN a campsite has one or more amenities
    - WHEN I view that campsite's details
    - THEN I should see the name of every amenity it offers

## Requirement 2: Reservation Activities
Creek River also wants to let guests add bookable extras to a reservation, things like a guided fishing trip, a bundle of firewood, or a canoe rental. Guests can add more than one activity to a reservation, and they might want more than one of the same activity too. A guest planning a weekend around the campfire might want three firewood bundles, not just one.

1. As a guest, I want to add one or more activities to my reservation, and say how many of each, so that I can book extras like firewood or a canoe rental along with my campsite.
    - GIVEN a reservation exists
    - WHEN a guest adds an activity to it
    - THEN that activity, and how many the guest wants, should be recorded on the reservation
1. As a campsite manager, I want to see every activity added to a reservation, along with the quantity of each, so that I know what to prepare for the guest's stay.
    - GIVEN a reservation has one or more activities added to it
    - WHEN I view the reservation's details
    - THEN I should see each activity's name and how many of it were requested

## Thinking through the data model
Both of these are the same _shape_ of relationship. A campsite can have many amenities, and an amenity can belong to many campsites. A reservation can have many activities, and an activity can be added to many reservations. When both sides of a relationship can have many of the other, that's a _many-to-many_ relationship, the kind you first ran into with Honey Rae's `ServiceTicket`s and `Employee`s.

Representing a many-to-many relationship takes a third entity in the middle, one that just connects the other two, often called a join table, bridge table, or junction table. But these two requirements aren't quite the same once you look closer:

- For campsites and amenities, there's nothing to track beyond "this campsite has this amenity." A join table with just a `CampsiteId` and an `AmenityId` is all we need.
- For reservations and activities, we also need to know _how many_ of each activity a guest wants, and that number doesn't belong to the reservation (a reservation might have several different activities, each with its own quantity) and it doesn't belong to the activity either (the quantity isn't a fact about "Firewood Bundle" in general, it's a fact about this one reservation's firewood order). It belongs to the join itself, to the specific pairing of _this_ reservation with _this_ activity. Extra data like this that lives on the relationship, rather than on either side of it, is called a _payload_.

This difference matters for how we implement each one. When a join table has no payload, EF Core can build the whole thing for us automatically, we don't even need to write a class for it. When it does need a payload, we have to write the join table's class ourselves, so that we have somewhere to put that extra column. You'll implement the amenities feature first, since it's the simpler of the two, and then the activities feature, so you can see both approaches back to back.

## ✍️ Reflections
1. Why can't `Quantity` just be a property on `Activity` instead? Think through what that would mean if the same "Firewood Bundle" activity were added to two different reservations with two different quantities.

Up Next: [Campsite Amenities](./creekriver-11-campsite-amenities.md)
