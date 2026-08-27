# Book 3 - Managing Data with SQL and Entity Framework Core
Up until now in the server-side course, we have been using variables in our programs to store the data for our applications (storing the data _in-memory_). Of course, this doesn't work in real-life situations. It's rare that applications like those that we're building don't require permanent data storage. When you shut down the apps that you've built thus far, any changes to them are discarded along with any other data the application stored in your computer's memory while it was running. 

In the front-end course, you used a JSON data file to store data (and data changes!) that will persist between runs of the application. In this book you will learn to use a number of other technologies to do this instead of using JSON Server:
1. **SQL** - (Structured Query Language) a language used by many relational databases to provide the ability to _query_ the data stored in the database, as well as make changes to that data. Every relational database implements SQL slightly differently, though the skills learned in using one system largely transfer to the others, especially at the conceptual level (but largely the syntax as well). Some other relational databases are called Oracle, SQL Server, and MySQL.
1. **PostgreSQL** - a relational database that will store data in a number of files in a directory on your computer.  PostgreSQL is an application that can read and write data to those files, and is listening for network requests to do those operations. 
1. **Entity Framework Core** - EF Core is a set of .NET packages that allow your .NET application to send _SQL queries_ to the _PostgreSQL_ server. _Postgres_ will execute that query, and return the data, if any, that the query produced. EF Core will receive that response, and turn the data into C# objects that you can use in your application. Technologies like EF Core are called _Object Relational Mapping_ frameworks, or ORMs. 

Because of the large scope of this book, it's split into two parts: SQL, and Entity Framework Core. Start with the installations, then work your way through SQL before moving on to EF Core. Each part below is collapsible — fold away the one you've finished so you can focus on what's next. Complete every column in a specific part before moving on to the next part:

|:computer: [Installations for Book 3](./chapters/installs-01-installations.md)|
|--|

<details open>
<summary><h2>I. SQL</h2></summary>

Before diving in, it helps to know the order a SQL query actually executes in — see [SQL - Order of Operations](./chapters/resource-02-sql-order-of-operations.md).

| # |⚡ SQL Bolt|🎵📚 Music History & Poems By Kids|🍯💻 Honey Rae's API|
|:-:|-|-|-|
|1|[SELECT queries 101](https://sqlbolt.com/lesson/select_queries_introduction)|:elephant: [Creating a PostgreSQL database using pgAdmin](./chapters/music-history-01-setup.md)|[Creating a database for Honey Rae's API](./chapters/honeyrae-01-database.md)|
|2|[Queries with constraints (Pt. 1)](https://sqlbolt.com/lesson/select_queries_with_constraints)|:headphones: [Music History Practice Queries](./chapters/music-history-02-practice.md)|[Using Npgsql to make our first query](./chapters/honeyrae-02-npgsql.md)|
|3|[Queries with constraints (Pt. 2)](https://sqlbolt.com/lesson/select_queries_with_constraints_pt_2)|:page_with_curl: [Using SQL scripts to create databases](./chapters/poki-01-setup.md)|[Getting related data](./chapters/honeyrae-03-related-data.md)|
|4|[Filtering and sorting Query results](https://sqlbolt.com/lesson/filtering_sorting_query_results)|:black_nib: [Poems By Kids](./chapters/poki-02-practice.md)|[Inserting and Updating rows](./chapters/honeyrae-04-create.md)|
|5|[Review: Simple SELECT Queries](https://sqlbolt.com/lesson/select_queries_review)||[Deleting a row](./chapters/honeyrae-05-delete.md)|
|6|[Multi-table queries with JOINs](https://sqlbolt.com/lesson/select_queries_with_joins)|||
|7|[OUTER JOINs](https://sqlbolt.com/lesson/select_queries_with_outer_joins)|||
|8|[A short note on NULLs](https://sqlbolt.com/lesson/select_queries_with_nulls)|||
|9|[Queries with expressions](https://sqlbolt.com/lesson/select_queries_with_expressions)|||
|10|[Queries with aggregates (Pt. 1)](https://sqlbolt.com/lesson/select_queries_with_aggregates)|||
|11|[Queries with aggregates (Pt. 2)](https://sqlbolt.com/lesson/select_queries_with_aggregates_pt_2)|||
|12|[Order of execution of a Query](https://sqlbolt.com/lesson/select_queries_order_of_execution)|||
|13|[Inserting rows](https://sqlbolt.com/lesson/inserting_rows)|||
|14|[Updating rows](https://sqlbolt.com/lesson/updating_rows)|||
|15|[Deleting rows](https://sqlbolt.com/lesson/deleting_rows)|||
|16|[Creating tables](https://sqlbolt.com/lesson/creating_tables)|||
|17|[Altering tables](https://sqlbolt.com/lesson/altering_tables)|||
|18|[Dropping tables](https://sqlbolt.com/lesson/dropping_tables)|||

</details>

<details open>
<summary><h2>II. Entity Framework Core</h2></summary>

|#|Creek River Campground <br>:tent: <sub>(guided tour)</sub> |Loncotes County Library <br>:book: <sub>(optional extra practice)</sub> |Hillary's Hair Care <br>:haircut: <sub>(pair programming)</sub>|
|:-:|:-:|:-:|:-:|
|1| [Project Setup](./chapters/creekriver-01-setup.md) |[Project Requirements](./chapters/loncotes-01-setup.md)|[Project Intro](./chapters/hillarys-01-project-requirements.md)|
|2| [Creating the database](./chapters/creekriver-02-db-context.md) <br><sub style="font-size: 0.85rem;">#encapsulation #inheritance #protected #override #constructor #base</sub>|[Basic Features](./chapters/loncotes-02-basic-features.md)||
|3| [Get campsites](./chapters/creekriver-03-get-campsites.md) <br><sub style="font-size: 0.85rem;">#Include #Single</sub>|[Get Available Materials](./chapters/loncotes-03-get-available-materials.md)||
|4| [Create a campsite](./chapters/creekriver-04-create-campsite.md) |[Get Overdue Checkouts](./chapters/loncotes-04-overdue-checkouts.md)||
|5| [Delete a campsite](./chapters/creekriver-05-delete-campsite.md) |[Late Fees](./chapters/loncotes-05-calculate-fees.md)||
|6| [Update a campsite](./chapters/creekriver-06-campsite-update.md) |||
|7| [Get reservations](./chapters/creekriver-07-get-reservations.md) <br><sub style="font-size: 0.85rem;">#ThenInclude #OrderBy </sub>|||
|8| [Book reservations](./chapters/creekriver-08-book-reservation.md) <br><sub style="font-size: 0.85rem;">#soft-delete</sub>|||
|9| [Calculating fees](./chapters/creekriver-09-calculated.md) <br><sub style="font-size: 0.85rem;">#field #static #private</sub>|||
|10| [Planning: Amenities and Activities](./chapters/creekriver-10-planning-activities.md) <br><sub style="font-size: 0.85rem;">#manytomany</sub>|||
|11| [Campsite Amenities](./chapters/creekriver-11-campsite-amenities.md) <br><sub style="font-size: 0.85rem;">#manytomany-inferred</sub>|||
|12| [Reservation Activities](./chapters/creekriver-12-reservation-activities.md) <br><sub style="font-size: 0.85rem;">#manytomany-payload #Sum</sub>|||

</details>

|:mortar_board: Coding Self-Assessment|
|--|
|:convenience_store: [EF Corner Store](./chapters/assessment-03.md)|

## Troubleshooting Entity Framework Issues

| Issue | Resolution |
|---|---|
| Cannot apply migrations because of pending changes to DBContext | [Override OnConfiguring](./chapters/UPDATE_DBCONTEXT.md) |
| "The Entity Framework tools version '_x_' is older than that of the runtime '_y_'" warning when running a `dotnet ef` command | Your global EF Core tools are out of date, even if you just installed .NET 10 — the SDK version and the `dotnet-ef` tool version are tracked separately. Run `dotnet tool update --global dotnet-ef` to update it, then try the command again. |

## 🔍 Additional Materials
|:compass: Explorer Chapters|
|-|
|🍯 💻 [Handling Related Data On Delete](./chapters/explorer-honeyrae-01-cascade-delete.md) |
|🍯 💻 [Finishing Honey Rae's with Npgsql](./chapters/explorer-honeyrae-02-complete.md) |
|🍯 💻 [Organize Data Access with Repositories](./chapters/explorer-honeyrae-03-repositories.md) |
|:tent: [Data Validation and Algorithmic Reasoning](./chapters/explorer-creekriver-01-reservation-validation.md) |
|:tent: [Mapping to DTOs with AutoMapper](./chapters/explorer-creekriver-02-automapper.md) |
| :book: [Automapper to Map Models to DTO's](./chapters/explorer-loncotes-01-automapper.md) |
| :book: [Loncotes React Client](./chapters/explorer-loncotes-02-client.md) |
|:tv: [Advanced Linq: Nineties TV](https://github.com/nashville-software-school/bangazon-inc/blob/server-side-curriculum/book-1-orientation/chapters/LINQ_INTRO.md)|

|🌐 Resources|
|--|
| [Classes](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/classes) |
|[OOP in C#](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop) |
|[SQL - Order of Operations](./chapters/resource-02-sql-order-of-operations.md)|
|[SQL Cheatsheet](./chapters/resource-01-sql.md)|

|:test_tube: Projects|
|-|
|[Adventurer's Quest](https://github.com/nashville-software-school/bangazon-inc/blob/server-side-curriculum/book-1-orientation/chapters/QUEST.md) (practice with fields and constructors)|
