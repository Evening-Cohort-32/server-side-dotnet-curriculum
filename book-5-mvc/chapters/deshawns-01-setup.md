# 🐕‍🦺 🐩 DeShawn's Dog Walking III: Return of the Leash
If DeShawn's Dog Walking looks familiar, it should. This is the second or third time you've seen it. Business is good: DeShawn now has dog owners signing up, and walkers logging walks, and he wants a new website to keep track of all of it. His nephew read somewhere that the web was better before JavaScript took over everything, and somehow DeShawn has been convinced. This time, the server builds the pages.

That makes this the perfect project for learning server-side rendering. The last time you built DeShawn's, the React client fetched JSON from the API and built the HTML in the browser. This time there is no React client, and no JSON. The server will build the whole HTML page and send it to the browser ready to display. Because you already know what DeShawn's needs to do, you can put all of your attention on _how_ the server does it.

In this exercise you'll create a new ASP.NET MVC project and add the data models for the application.

## Creating the Project
1. In the csharp directory of your workspace, create the MVC project like this:
    ``` bash
    dotnet new mvc -o DeShawnsRazor
    ```
    > :bulb: _Razor_ is the name of the syntax you'll use to build the HTML pages in this project. Like Occam's razor, it cuts out what isn't needed. This time, that's React.
1. Inside the `DeShawnsRazor` directory, run `dotnet new gitignore`
1. Install these required dependencies with:
    ``` bash
    dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0
    ```
    and:
    ``` bash
    dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0
    ```
1. Run this to be able to store secrets for this app:
    ``` bash
    dotnet user-secrets init
    ```
1. Add the connection string to the secrets for this app with this (make sure you change `<your_postgresql_password>` to your db password!):
    ``` bash
    dotnet user-secrets set 'DeShawnsRazorDbConnectionString' 'Host=localhost;Port=5432;Username=postgres;Password=<your_postgresql_password>;Database=DeShawnsRazor'
    ```
    > :bulb: Remember that the key, `DeShawnsRazorDbConnectionString`, is the name `Program.cs` will ask for when it looks up the connection string. If you copied this command from an earlier project, make sure you changed the key, not just the values.
1. Open the project in VS Code and start the debugger. A browser tab should open on its own with a "Welcome" page. If you see it, the project is set up correctly.

## A First Look Around
Take a look at the project files that come with a new ASP.NET MVC project. It already has folders for `Models`, `Views`, and `Controllers`. Those three folders are where the name MVC comes from, and you'll take a closer look at how they work together in an upcoming exercise. There is also a `wwwroot` folder, which contains static assets like CSS and JavaScript files. This is similar to the `public` folder in the React projects you're already familiar with.

## Models
DeShawn's data has grown a little since the last time you saw it. Dogs now belong to owners, owners and walkers each live in a city, and walks are recorded with a date and a duration.

1. Add a `City.cs` file to the `Models` folder. Paste the following code in it:
    ``` csharp
    namespace DeShawnsRazor.Models;

    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    ```
1. Add a `Walker.cs` file to the `Models` folder and paste this code in it:
    ``` csharp
    namespace DeShawnsRazor.Models;

    public class Walker
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
        public int CityId { get; set; }
        public City? City { get; set; }
    }
    ```
1. Add an `Owner.cs` file to the `Models` folder and paste this code in it:
    ``` csharp
    namespace DeShawnsRazor.Models;

    public class Owner
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public int CityId { get; set; }
        public City? City { get; set; }
        public List<Dog>? Dogs { get; set; }
    }
    ```
1. Add a `Dog.cs` file to the `Models` folder and paste this code in it:
    ``` csharp
    namespace DeShawnsRazor.Models;

    public class Dog
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public string? Notes { get; set; }
        public string? ImageUrl { get; set; }
        public int OwnerId { get; set; }
        public Owner? Owner { get; set; }
    }
    ```
1. Finally, add a `Walk.cs` file to the `Models` folder and paste this code in it:
    ``` csharp
    namespace DeShawnsRazor.Models;

    public class Walk
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int Duration { get; set; }
        public int DogId { get; set; }
        public Dog? Dog { get; set; }
        public int WalkerId { get; set; }
        public Walker? Walker { get; set; }
    }
    ```
    - `Duration` is the length of the walk in minutes.

### What are all of those question marks?
Some of the properties above have a `?` after their type, like `string? Notes` and `City? City`. Open `DeShawnsRazor.csproj` and you'll see this line:
``` xml
<Nullable>enable</Nullable>
```
This turns on a C# feature called _nullable reference types_. With it turned on, a reference type like `string` is assumed to never be `null`, unless you add a `?` to say that it can be. That `?` matters to two different parts of this project:
1. **EF Core** uses it to decide which columns can be `NULL` in the database. `string Name` becomes a `NOT NULL` column, and `string? Notes` becomes a column that allows `NULL`.
1. **ASP.NET MVC** uses it to decide which values a user _must_ fill in when they submit a form. Without the `?`, MVC treats a property as required, and it will reject a form that leaves it empty.

That second one is why the navigation properties (`City`, `Owner`, `Dog`, `Walker`, and `Dogs`) all have a `?` too. When a user fills out a form to add a new dog, they'll choose an owner, which fills in `OwnerId`, but they'll never fill in a whole `Owner` object. If `Owner` didn't have a `?`, MVC would treat it as required and reject every new dog. You'll see this again when you start building forms and validating what users submit.

> :bulb: You didn't have to think about any of this back in Creek River. That's because of server-side rendering: there, the API only received JSON that you sent with Yaak, but here the server builds the forms _and_ checks what users submit in them, so MVC needs to know which values are required.

In the next exercise you'll use these models to create and seed the database.

Up Next: [Database](./deshawns-02-database.md)

## 🔍 Additional Materials
1. [Overview of ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/overview)
1. [Nullable reference types](https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references)
1. [Working with nullable reference types in EF Core](https://learn.microsoft.com/en-us/ef/core/miscellaneous/nullable-reference-types)
