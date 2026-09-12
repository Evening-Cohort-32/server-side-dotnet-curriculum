# :haircut: Hillary's Hair Care
In this project you will create and implement a plan for building an application for Hillary, the owner of a hair salon. Hillary has hired us to create an application to manage appointments with her stylists at Hillary's Hair Care. As a reminder, learning how to break down projects into manageable units of work and modeling data with ERDs are essential tasks for a professional software developer, so do not skip this opportunity to practice these core professional disciplines.  

## Technical Requirements
1. The app will be built with an ASP.NET Minimal API, using PostgreSQL and Entity Framework Core for data storage and access. 
1. The front-end application will be a React client. The code for the client should be in a directory called `client` inside the .NET project directory. See instructions below for creating that client. 
1. The following are the entities you should use in the project:
    - `Stylist`
    - `Customer`
    - `Appointment`
    - `Service`
## Notes from Meeting with Hillary
Hillary would like her application to allow her to schedule appointments between a customer and a stylist. Hillary mentioned that during an appointment, there is a range of services that can be provided, like a haircut, coloring, and beard trims, etc. Customers will often order more than one service per appointment. Appointments happen on the hour, and are scheduled to be an hour long. The customers are charged per service, and Hillary needs to keep track of the total cost for the appointment. 

Customers often cancel appointments, so she will need to be able to make this change in the app. They occasionally change the services that will be provided at the appointment as well, so the ability to make this change in the app is an essential feature. 

Hillary needs the ability to add new customers and stylists to her system. Occasionally stylists move on to other jobs, and she needs to deactivate them so that new appointments are not accidentally made with them. However, she does not want them completely removed from the system, because she needs to keep records of appointments from former stylists even if she no longer employs them.

> :bulb: `Appointment` and `Service` are a many-to-many relationship, the same shape as Creek River's campsites and amenities. Use [that chapter](./creekriver-11-campsite-amenities.md) as a reference for the pattern, not a script to copy.

## Planning 
1. Start by creating some wireframes for this application. Hillary didn't mention how the app should look, or how to organize it and navigate through it. This is up to you. She is hoping you will build a clean, professional interface that is easy to use.

1. Use the notes above to create user stories for the features that you will need to build in this application. Use the format that you were introduced to in DeShawn's Dog Walking in the last book.

1. Create a Github repository for this project:
    - Use [this](https://github.com/nss-group-projects/dotnet-hillarys-react) template to create your own repo, and clone it locally
    - Add all of the user stories as issues to the repo
    - create a GH project board, and add all of the issues to it. 

1. Create an ERD using the entities provided in the technical requirements. Remember that a many-to-many relationship will need a table in addition to the entities listed above. After your first draft of the ERD, make sure that the data model you have created will support the features listed in the user stories. 

## Setting up the codebase
The template already has the API and the React client wired up and talking to each other: a Navbar, a router, and one working endpoint (`/api/hello`) that `Home.jsx` calls through `apiManager.js`. Explore the codebase before you change anything: `Program.cs`, `client/src/App.jsx`, `client/src/Home.jsx`, and `client/src/apiManager.js` are a good place to start.

1. In the `client` directory, run `npm install`.
1. Start the API with the VS Code debugger, then in the `client` directory run `npm run dev`. Confirm you see the greeting message from `Home.jsx` before continuing. This proves the client, the proxy, and the API are already talking to each other.
1. Install the packages you'll need for EF Core and Npgsql, the same as in the ["Creating the Project"](./creekriver-01-setup.md#creating-the-project) step of Creek River (`Npgsql.EntityFrameworkCore.PostgreSQL` and `Microsoft.EntityFrameworkCore.Design`), and set up `dotnet user-secrets` with a connection string for a new `HillarysHairCare` database, using a key name specific to this project.
1. Use your ERD to [create models](./creekriver-01-setup.md#models) for `Stylist`, `Customer`, `Appointment`, and `Service`. Use Creek River's models as a reference for the pattern (composition for related data, `[Required]` for `NOT NULL` columns, a DTO for each model), not as code to copy. Your entities and properties are your own.
1. Use the [DbContext chapter](./creekriver-02-db-context.md) from Creek River as a guide to creating your own `HillarysHairCareDbContext` class, seeding it with data, and configuring `Program.cs` to use EF Core and Npgsql.
1. Once your models and `DbContext` are in place, create the initial migration and create the database.
1. At this point, you may want to add, commit, and push this code to the remote repository.    

## Starting to Code
Once you have finished planning, and set up the code base, it's time to start implementing features! Order the tickets on your project board so that they are in the order you want to complete them. Move the top ticket into the "In Progress" column, and checkout a new branch from main. Use pull requests to merge features into the main branch, and make sure that the ticket moves to the "Done" column. Then start the process again with a new ticket until you have completed the project. 

> Note: You should not build the entire API, and then build the entire client. Add endpoints to the API as you need them for the feature you are currently working on. See [Vertical Slices vs. Horizontal Layers](./resource-04-vertical-vs-horizontal-development.md) for why, and [Request Lifecycle](./resource-03-request-lifecycle.md) for a map of everything one of those slices actually touches.
