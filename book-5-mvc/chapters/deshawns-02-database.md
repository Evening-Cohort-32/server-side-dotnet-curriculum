# Creating the Database
In this exercise you'll create the `DbContext` class, seed it with data, and use EF Core to create the database. You've done all of this before in Creek River, so this exercise will move quickly. If you need a refresher on any step, follow the links back to Creek River.

## Adding a DbContext class
Add a file to the main directory of the project called `DeShawnsRazorDbContext.cs`. At this point you should be familiar with how a `DbContext` class is put together, so write this one yourself, using the one you built for [Creek River](../../book-3-sql-efcore/chapters/creekriver-02-db-context.md#adding-a-dbcontext-class) as a reference.
1. The class should be called `DeShawnsRazorDbContext`, and it should inherit from `DbContext`.
1. It needs a `DbSet` property for each of the models, named `Cities`, `Walkers`, `Owners`, `Dogs`, and `Walks`. The rest of this book will use these names.
1. Remember the constructor that passes the options down to the `DbContext` base class.
1. Don't forget the using directives at the top of the file. You need `Microsoft.EntityFrameworkCore` for `DbContext`, and `DeShawnsRazor.Models` for the models.

## Seeding the database with data
_Inside the `DeShawnsRazorDbContext` class_, add the following method. This works exactly like [seeding the database](../../book-3-sql-efcore/chapters/creekriver-02-db-context.md#seeding-the-database-with-data) did in Creek River, there's just more of it:
``` csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<City>().HasData(new City[]
    {
        new City {Id = 1, Name = "Nashville"},
        new City {Id = 2, Name = "Franklin"},
        new City {Id = 3, Name = "Brentwood"},
        new City {Id = 4, Name = "Murfreesboro"},
        new City {Id = 5, Name = "Hendersonville"},
        new City {Id = 6, Name = "Gallatin"},
        new City {Id = 7, Name = "Smyrna"},
        new City {Id = 8, Name = "Mount Juliet"},
        new City {Id = 9, Name = "Lebanon"},
        new City {Id = 10, Name = "Clarksville"},
        new City {Id = 11, Name = "Spring Hill"},
        new City {Id = 12, Name = "Goodlettsville"},
        new City {Id = 13, Name = "Nolensville"},
        new City {Id = 14, Name = "La Vergne"},
        new City {Id = 15, Name = "Columbia"}
    });

    modelBuilder.Entity<Owner>().HasData(new Owner[]
    {
        new Owner {Id = 1, Name = "John Sanchez", Email = "john@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 1},
        new Owner {Id = 2, Name = "Patricia Young", Email = "patty@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 2},
        new Owner {Id = 3, Name = "Robert Brown", Email = "robert@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 3},
        new Owner {Id = 4, Name = "Jennifer Wilson", Email = "jennifer@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 1},
        new Owner {Id = 5, Name = "Michael Moore", Email = "michael@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 2},
        new Owner {Id = 6, Name = "Linda Green", Email = "linda@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 3},
        new Owner {Id = 7, Name = "William Anderson", Email = "william@gmail.com", Address = "355 Main St", Phone = "(615)-553-2456", CityId = 1}
    });

    modelBuilder.Entity<Dog>().HasData(new Dog[]
    {
        new Dog {Id = 1, Name = "Ninni", OwnerId = 1, Breed = "Rottweiler"},
        new Dog {Id = 2, Name = "Kuma", OwnerId = 1, Breed = "Rottweiler"},
        new Dog {Id = 3, Name = "Remy", OwnerId = 2, Breed = "Greyhound"},
        new Dog {Id = 4, Name = "Xyla", OwnerId = 3, Breed = "Dalmatian"},
        new Dog {Id = 5, Name = "Chewy", OwnerId = 3, Breed = "Beagle"},
        new Dog {Id = 6, Name = "Groucho", OwnerId = 4, Breed = "Dalmatian"},
        new Dog {Id = 7, Name = "Finley", OwnerId = 5, Breed = "Golden Retriever"},
        new Dog {Id = 8, Name = "Casper", OwnerId = 6, Breed = "Golden Retriever"},
        new Dog {Id = 9, Name = "Bubba", OwnerId = 7, Breed = "English Bulldog"},
        new Dog {Id = 10, Name = "Zeus", OwnerId = 7, Breed = "Schnauzer"}
    });

    modelBuilder.Entity<Walker>().HasData(new Walker[]
    {
        new Walker {Id = 1, Name = "Claudelle", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Claudelle", CityId = 15},
        new Walker {Id = 2, Name = "Roi", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Roi", CityId = 2},
        new Walker {Id = 3, Name = "Shena", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Shena", CityId = 10},
        new Walker {Id = 4, Name = "Gibb", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Gibb", CityId = 8},
        new Walker {Id = 5, Name = "Tammy", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Tammy", CityId = 6},
        new Walker {Id = 6, Name = "Rufe", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Rufe", CityId = 11},
        new Walker {Id = 7, Name = "Cassandry", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Cassandry", CityId = 12},
        new Walker {Id = 8, Name = "Cully", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Cully", CityId = 4},
        new Walker {Id = 9, Name = "Cully", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Cully2", CityId = 14},
        new Walker {Id = 10, Name = "Agnesse", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Agnesse", CityId = 1},
        new Walker {Id = 11, Name = "Koo", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Koo", CityId = 7},
        new Walker {Id = 12, Name = "Diana", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Diana", CityId = 6},
        new Walker {Id = 13, Name = "Moreen", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Moreen", CityId = 7},
        new Walker {Id = 14, Name = "Sonni", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Sonni", CityId = 13},
        new Walker {Id = 15, Name = "Nadiya", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Nadiya", CityId = 9},
        new Walker {Id = 16, Name = "Olag", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Olag", CityId = 12},
        new Walker {Id = 17, Name = "Alasdair", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Alasdair", CityId = 12},
        new Walker {Id = 18, Name = "Jo Ann", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=JoAnn", CityId = 12},
        new Walker {Id = 19, Name = "Ewen", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Ewen", CityId = 6},
        new Walker {Id = 20, Name = "Andee", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Andee", CityId = 5},
        new Walker {Id = 21, Name = "Sada", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Sada", CityId = 12},
        new Walker {Id = 22, Name = "Tasia", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Tasia", CityId = 3},
        new Walker {Id = 23, Name = "Sherry", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Sherry", CityId = 5},
        new Walker {Id = 24, Name = "Witty", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Witty", CityId = 6},
        new Walker {Id = 25, Name = "Ezekiel", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Ezekiel", CityId = 5},
        new Walker {Id = 26, Name = "Emmeline", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Emmeline", CityId = 1},
        new Walker {Id = 27, Name = "Darrick", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Darrick", CityId = 9},
        new Walker {Id = 28, Name = "Redford", ImageUrl = "https://api.dicebear.com/9.x/personas/svg?seed=Redford", CityId = 14}
    });

    modelBuilder.Entity<Walk>().HasData(new Walk[]
    {
        new Walk {Id = 1, DogId = 1, WalkerId = 10, Date = new DateTime(2026, 10, 5, 9, 0, 0), Duration = 30},
        new Walk {Id = 2, DogId = 2, WalkerId = 10, Date = new DateTime(2026, 10, 5, 9, 0, 0), Duration = 30},
        new Walk {Id = 3, DogId = 3, WalkerId = 2, Date = new DateTime(2026, 10, 6, 14, 0, 0), Duration = 45},
        new Walk {Id = 4, DogId = 4, WalkerId = 22, Date = new DateTime(2026, 10, 7, 8, 0, 0), Duration = 60},
        new Walk {Id = 5, DogId = 5, WalkerId = 22, Date = new DateTime(2026, 10, 7, 8, 0, 0), Duration = 60},
        new Walk {Id = 6, DogId = 6, WalkerId = 26, Date = new DateTime(2026, 10, 8, 17, 30, 0), Duration = 30},
        new Walk {Id = 7, DogId = 7, WalkerId = 2, Date = new DateTime(2026, 10, 9, 12, 0, 0), Duration = 45},
        new Walk {Id = 8, DogId = 8, WalkerId = 22, Date = new DateTime(2026, 10, 10, 10, 0, 0), Duration = 30},
        new Walk {Id = 9, DogId = 9, WalkerId = 26, Date = new DateTime(2026, 10, 11, 16, 0, 0), Duration = 60},
        new Walk {Id = 10, DogId = 10, WalkerId = 26, Date = new DateTime(2026, 10, 11, 16, 0, 0), Duration = 60}
    });
}
```

## Configure the app to use EF Core
Add the following code right above `var app = builder.Build();` in `Program.cs`, below the `builder.Services.AddControllersWithViews();` line that's already there:
``` csharp
// allows passing datetimes without time zone data
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// allows our controllers to access the database through Entity Framework Core
builder.Services.AddNpgsql<DeShawnsRazorDbContext>(builder.Configuration["DeShawnsRazorDbConnectionString"]);
```
These are the same two statements you added to Creek River. The second one makes an instance of `DeShawnsRazorDbContext` available to the rest of the app. This time, the code that will use it is your controllers, instead of endpoints.

## Creating the database
> :bulb: Make sure the app isn't currently running before you run a `dotnet ef` command. Stop the debugger first. These commands need to build your project themselves, and they can fail with a strange, hard-to-diagnose error if the compiled output is still locked by an app that's already running.

1. Make sure your global EF Core tools are up to date. The `dotnet-ef` tool's version is tracked separately from the SDK, so if you installed it for an older version of EF Core, every `dotnet ef` command will warn you that the tools are older than the runtime:
    ``` bash
    dotnet tool update --global dotnet-ef
    ```
1. Run the following in the main project directory:
    ``` bash
    dotnet ef migrations add InitialCreate
    ```
1. This command will create a `Migrations` folder with a number of C# files in it in the project directory. When it finishes, run this:
    ``` bash
    dotnet ef database update
    ```
1. Open pgAdmin, and take a look at the `DeShawnsRazor` database that EF Core created. You should see a table for each of your models, filled with the seed data.

With the database in place, you're ready to see how an MVC app turns a request into a page.

Up Next: [How MVC Renders a Page](./deshawns-03-mvc-tour.md)
