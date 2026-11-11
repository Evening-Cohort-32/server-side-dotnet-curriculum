# :pizza: Shepherd's Pies
Giuseppe Shepherd learned how to make the perfect pizza as a child from his nonna. Since then it's been his dream to open his own restaurant, but he needs help creating the order management system for his new business. As a reminder, learning how to break down projects into manageable units of work and modeling data with ERDs are essential tasks for a professional software developer, so do not skip this opportunity to practice these core professional disciplines.

> **NOTE:** This project is a good example of a fairly ambitious capstone project that more than fulfills the basic requirements for graduation. As you start planning your capstone project, keep this in mind when thinking about the size and scope of the application you are planning to build.

## Technical Requirements
1. The app will be built with an ASP.NET Web API using controllers, with Identity Framework for authentication, and PostgreSQL and Entity Framework Core for data storage and access.
1. The front-end application will be a React client. The code for the client should be in a directory called `client` inside the .NET project directory. See instructions below for creating the project.
1. The following are the entities you should use in the project:
    - `UserProfile` (the restaurant's employees)
    - `Order`
    - `Pizza`
    - `Size`
    - `Cheese`
    - `Sauce`
    - `Topping`

## Project Description

### Orders
Giuseppe's (Joe, to his friends) restaurant has a dining room and delivery service available, and an order can either be placed for a particular table number or for delivery. Each order at the restaurant can have multiple pizzas on it.

Each order can potentially have two employees assigned to it for different purposes - Joe can tell if an order is for delivery if an employee has been assigned as the deliverer for that order. Orders are also _always_ associated with the employee that took the order (at a table or over the phone). The employees are the users of the app, so `UserProfile` is the employee entity, the same as in Bianca's Bikes. This means `Order` will need two separate references to `UserProfile`. See [Referencing the Same Entity Twice](./biancas-08-foreign-keys.md) in Bianca's Bikes for the pattern to use for this (not as code to copy - your entities and properties are your own).

Joe needs to see what the total cost for the order will be based on the total cost of all of the pizzas on that order. He also needs to see if the customer left a tip. Joe's restaurant is located in a magical place with no sales tax. For record-keeping purposes, Joe also needs to know the date and time an order was placed.

### Pizza
Eventually there will be other items available, but for the restaurant opening Joe is going to only serve pizzas. The pizzas come in three sizes - small, medium, and large. Each pizza on an order can have a cheese type, a sauce type, and then any number of toppings chosen from a list on the menu.

Joe provided us with a draft menu to help build our data model:

---
### :pizza::tomato: Shepherd's Pies :tomato: :pizza:
### Pizzas
- small (10") - $10.00
- medium (14") - $12.00
- large (18") - $15.00

### Choose a Cheese Option
- Buffalo Mozzarella
- Four Cheese
- Vegan
- None (cheeseless)

### Choose a Sauce Option
- Marinara
- Arrabbiata
- Garlic White
- None (sauceless pizza)

### Toppings ($0.50 each)
- sausage
- pepperoni
- mushroom
- onion
- green pepper
- black olive
- basil
- extra cheese

**Delivery surcharge: $5.00/order**

---

> :bulb: `Pizza` and `Topping` are a many-to-many relationship, the same shape as Creek River's campsites and amenities. Use [that chapter](../../book-3-sql-efcore/chapters/creekriver-11-campsite-amenities.md) as a reference for the pattern, not a script to copy. The order total is a calculated property, like the ones in [Creek River](../../book-3-sql-efcore/chapters/creekriver-09-calculated.md). Notice that the menu's prices depend on the size, the number of toppings, and whether the order is for delivery, so your data model needs to store everything that total depends on.

## Application Requirements
Only employees will use this system as logged on users. They need to be able to:
1. Create an order (there are lots of design questions here - should the user be able to add pizzas on this view, or only after the order has been created?)
1. View all orders (should be filtered by day, with today being the default when first viewing the list), ordered by order datetime (newest first).
1. View an order's details (including a list of pizzas)
1. Update an order
    - Add a pizza to an order (linked from order details view)
    - Remove a pizza from an order
    - Assign an employee to deliver the order (see the note above about `Order`'s two references to `UserProfile` for correctly setting up the data model for this feature)
1. Update a pizza that is on an order
    - change cheese or sauce type, or size
    - add and remove toppings
1. Cancel an order (delete from the system)

## Planning
You will not be able to complete this project efficiently without proper planning ahead of time.

1. Start by creating some wireframes for this application. These can be very simple, but make sure you have an idea of how the user is going to access each view, and how any forms will need to look to allow the user to input data.

1. Use the project requirements to create user stories for the features that you will need to build in this application. Use the format that you were introduced to in [DeShawn's Dog Walking](../../book-2-web-apis/chapters/deshawns-02-user-stories.md).

1. Create an empty Github repository for this project:
    - Add all of the user stories as issues to the repo
    - create a GH project board, and add all of the issues to it.

1. Create an ERD using the entities provided in the technical requirements. Remember that a many-to-many relationship will need a table in addition to the entities listed above. After your first draft of the ERD, make sure that the data model you have created will support the features listed in the user stories.

## Setting up the codebase
This project does not include template code. Instead, set it up the same way as House Rules, by following every step in the [House Rules Project Setup](./houserules-01-setup.md). You don't need to have done the House Rules project to follow these steps. Make these changes as you go:
- Use `ShepherdsPies` everywhere the steps use `HouseRules` (the project name, the `DbContext` name, and the namespaces).
- In `NavBar.jsx`, change the brand text from House Rules to Shepherd's Pies.
- Save the connection string for a database called `ShepherdsPies` to the user secret `ShepherdsPiesDbConnectionString`.

Then:
1. Use your ERD to create models for your entities in the `Models` folder. Remember to use _composition_ for related data. Since you deleted the `<Nullable>enable</Nullable>` line during setup, every `string` is a nullable type, so use `[Required]` on every `string` that should be `NOT NULL`. That includes `FirstName`, `LastName`, `Address`, and `IdentityUserId` on the `UserProfile` you copied, since Bianca's Bikes' `UserProfile` doesn't have them.
1. Add a `DbSet` property to `ShepherdsPiesDbContext` for each of your new classes, next to the `UserProfiles` one you kept during setup.
1. In `OnModelCreating`, seed the database with the menu above (sizes, cheeses, sauces, and toppings), a few more employees, and some orders with pizzas on them. Make sure at least one order is for delivery, and that some orders were placed today.
1. Create an initial migration, and then update the database.
1. Add, commit, and push this code to the remote repository you created during planning.

## Starting to Code
Once you have finished planning, and set up the code base, it's time to start implementing features! Order the tickets on your project board so that they are in the order you want to complete them. Move the top ticket into the "In Progress" column, and checkout a new branch from main. Use pull requests to merge features into the main branch, and make sure that the ticket moves to the "Done" column. Then start the process again with a new ticket until you have completed the project.

> Note: You should not build the entire API, and then build the entire client. Add endpoints to the API as you need them for the feature you are currently working on. See [Vertical Slices vs. Horizontal Layers](../../book-3-sql-efcore/chapters/resource-04-vertical-vs-horizontal-development.md) for why, and [Request Lifecycle](../../book-3-sql-efcore/chapters/resource-03-request-lifecycle.md) for a map of everything one of those slices actually touches.
