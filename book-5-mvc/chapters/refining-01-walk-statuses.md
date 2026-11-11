# 🐕‍🦺 🐩 Refining DeShawn's
DeShawn's site is working, but right now it's really only useful to DeShawn. In this project, you'll turn it into something owners and walkers can use themselves: owners will log in and request walks for their dogs, and walkers will log in to confirm and complete them. There are three exercises. The first two walk you through two new concepts, enums and logging in, and the third is a set of requirements for you to build on your own.

Make sure you've finished all of DeShawn's Dog Walking III before starting, since this project builds on every exercise.

## Walk Statuses
A walk is going to go through three stages: an owner _requests_ it, the walker _confirms_ it, and once the walk is over, the walker marks it _completed_. So every walk needs a status, and there are exactly three statuses it can have.

You could store the status in a lookup table, the way you stored cities. But there's an important difference between cities and statuses. Cities are data: DeShawn could expand to a new city tomorrow, and nothing in your code would need to change. Statuses aren't like that. Your code is going to make decisions based on them, like only showing a "Confirm" button for a walk that has been requested. With a lookup table, that code would have to look something like `walk.WalkStatusId == 1`, and anyone reading it would have to go look up what `1` means.

## Enums
C# has a better tool for a value that can only be one of a small, fixed set of options: an _enum_ (short for _enumeration_). Add a `WalkStatus.cs` file to the `Models` folder:
> WalkStatus.cs
```csharp
namespace DeShawnsRazor.Models;

public enum WalkStatus
{
    Requested,
    Confirmed,
    Completed
}
```
`WalkStatus` is a new type, just like a class is. But instead of properties, it lists the only values that a `WalkStatus` can ever be. You use them like this:
```csharp
WalkStatus status = WalkStatus.Requested;

if (status == WalkStatus.Requested)
{
    Console.WriteLine("This walk needs to be confirmed");
}
```
Now the code says exactly what it means, and if you misspell a status, the compiler will catch it. Enums are everywhere in C#. You've probably used one already without noticing: `DateTime`'s `DayOfWeek` property is a `DayOfWeek` enum, with values like `DayOfWeek.Monday`.

Behind the scenes, each value of an enum is a number, starting at `0`. That means `Requested` is `0`, and since `0` is the default value for a number in C#, a `WalkStatus` that hasn't been given a value will be `Requested`. That's why `Requested` is listed first: every new walk will start out as requested.

## Updating the models
Add a `Status` property to the `Walk` model, and make `Duration` nullable, since a walk that has only been requested hasn't happened yet:
> Walk.cs
```csharp
public class Walk
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int? Duration { get; set; }
    public WalkStatus Status { get; set; }
    public int DogId { get; set; }
    public Dog? Dog { get; set; }
    public int WalkerId { get; set; }
    public Walker? Walker { get; set; }
}
```
Walkers are going to log in too, using their email address, so add an `Email` property to the `Walker` model:
> Walker.cs
```csharp
public string Email { get; set; }
```

## Storing the status as text
Because enum values are numbers, EF Core will store `Status` in the database as a number by default. That works, but when you look at the `Walks` table in pgAdmin, you'll see `0`, `1`, and `2`, and have to remember which is which. You can tell EF Core to store the name of the value instead. Add this to the bottom of the `OnModelCreating` method in `DeShawnsRazorDbContext`:
```csharp
modelBuilder.Entity<Walk>()
    .Property(w => w.Status)
    .HasConversion<string>();
```

## Updating the seed data
1. All of the walks in the seed data are in the past, so add `Status = WalkStatus.Completed` to each of them.
1. `Email` is required, so every walker in the seed data needs one, like `Email = "claudelle@deshawns.com"`. Since walkers will log in with their email address, make sure each one is unique. (There are two walkers named Cully!)

## The migration
Stop the app, then run:
```
dotnet ef migrations add WalkStatusAndWalkerEmail
dotnet ef database update
```
Open the `Walks` table in pgAdmin, and you should see `Completed` in the new `Status` column.

> :bulb: Making `Duration` nullable affects the total walk time on the walker details page, because summing a list of `int?`s gives you an `int?`. Only completed walks have a duration anyway, so update that calculation to only include completed walks.

## 🔍 Additional Materials
1. [Enumeration types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/enum)
1. [EF Core value conversions](https://learn.microsoft.com/en-us/ef/core/modeling/value-conversions)
