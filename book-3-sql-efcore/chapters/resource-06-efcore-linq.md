# EF Core LINQ Cheatsheet

A quick syntax reference for LINQ when you're querying the database through EF Core. If you need a refresher on LINQ against regular lists first, see the [Book 1 LINQ Cheatsheet](../../book-1-foundations/chapters/resource-09-linq.md).

`db.Campsites` is not a `List<Campsite>`. It's a `DbSet<Campsite>`, and EF Core turns your method chain into a SQL query instead of looping over items in memory. That means two things:

1. Only LINQ methods work on it. Methods that belong to `List<T>` itself (like `FindAll`) don't exist on a `DbSet`.
1. Nothing is sent to the database until you ask for results, usually with `.ToList()`, `SingleOrDefault`, `FirstOrDefault`, `Count`, `Any`, or `Sum`.

## List Methods vs. LINQ Methods

If you reach for one of these from Book 1 and get a compiler error, use the LINQ method on the right instead.

| `List<T>` method (won't work on a `DbSet`) | LINQ method to use instead |
|--|--|
| `FindAll(c => ...)` | `Where(c => ...).ToList()` |
| `Find(c => ...)` | `SingleOrDefault(c => ...)` or `FirstOrDefault(c => ...)` |
| `Exists(c => ...)` | `Any(c => ...)` |
| `TrueForAll(c => ...)` | `All(c => ...)` |
| `ConvertAll(c => ...)` | `Select(c => ...).ToList()` |
| `ForEach(c => ...)` | `.ToList()` first, then a regular `foreach` loop |

> :bulb: `DbSet` _does_ have its own `Find`, but it only takes a primary key value, not a lambda: `db.Campsites.Find(id)`.

## Where

Filters to rows matching a condition. Becomes a SQL `WHERE`.

```csharp
List<Material> available = db.Materials
    .Where(m => m.OutOfCirculationSince == null)
    .ToList();
```

## Select

Transforms each row into something new, usually a DTO.

```csharp
List<CampsiteDTO> campsites = db.Campsites
    .Select(c => new CampsiteDTO
    {
        Id = c.Id,
        Nickname = c.Nickname
    })
    .ToList();
```

## SingleOrDefault and FirstOrDefault

```csharp
Campsite campsite = db.Campsites.SingleOrDefault(c => c.Id == id);   // null if nothing matches, throws if more than one matches
Campsite first = db.Campsites.FirstOrDefault(c => c.CampsiteTypeId == 1); // null if nothing matches, takes the first if several match
```

Use `SingleOrDefault` when you're looking something up by `Id`, since there should never be more than one.

`Single` and `First` work the same way, but throw an error instead of returning `null` when nothing matches. Stick with the `OrDefault` versions in endpoints, so you can check for `null` and return `Results.NotFound()`.

## Include and ThenInclude

Pulls in related data. Without `Include`, navigation properties like `r.Campsite` come back `null`.

```csharp
List<Reservation> reservations = db.Reservations
    .Include(r => r.UserProfile)            // related data on Reservation
    .Include(r => r.Campsite)
        .ThenInclude(c => c.CampsiteType)   // related data on Campsite
    .ToList();
```

`Include` also works in front of `SingleOrDefault`:

```csharp
Campsite campsite = db.Campsites.Include(c => c.Amenities).SingleOrDefault(c => c.Id == id);
```

## OrderBy and OrderByDescending

Becomes a SQL `ORDER BY`.

```csharp
List<Reservation> soonest = db.Reservations.OrderBy(r => r.CheckinDate).ToList();
List<Reservation> latest = db.Reservations.OrderByDescending(r => r.CheckinDate).ToList();
```

## Any, All, and Count

```csharp
bool hasBookings = db.Reservations.Any(r => r.CampsiteId == id);       // true if at least one row matches
bool allReturned = db.Checkouts.All(co => co.ReturnDate != null);      // true only if every row matches
int bookingCount = db.Reservations.Count(r => r.CampsiteId == id);     // count of matching rows
```

These are also handy inside a `Where` to filter on related data:

```csharp
List<Material> notCheckedOut = db.Materials
    .Where(m => m.Checkouts.All(co => co.ReturnDate != null))
    .ToList();
```

## Contains

Checks a value against a list of values. Becomes a SQL `IN`.

```csharp
List<int> amenityIds = new List<int> { 1, 3, 4 };
List<Amenity> chosen = db.Amenities.Where(a => amenityIds.Contains(a.Id)).ToList();
```

## Sum, Average, Min, Max

```csharp
decimal highestFee = db.CampsiteTypes.Max(ct => ct.FeePerNight);
decimal lowestFee = db.CampsiteTypes.Min(ct => ct.FeePerNight);
decimal averageFee = db.CampsiteTypes.Average(ct => ct.FeePerNight);
```

## Skip and Take

Becomes SQL `OFFSET` and `LIMIT`. Sort first, or the database doesn't promise which rows you get.

```csharp
List<Reservation> page = db.Reservations
    .OrderBy(r => r.CheckinDate)
    .Skip(10)
    .Take(10)
    .ToList();
```

## More Methods Worth Knowing

The exercises don't use these, but they come up often once you start writing your own queries.

### ThenBy and ThenByDescending

Adds a second sort for rows that tie on the first one. Chaining two `OrderBy` calls doesn't do this, the second one replaces the first.

```csharp
List<Campsite> sorted = db.Campsites
    .OrderBy(c => c.CampsiteTypeId)
    .ThenBy(c => c.Nickname)
    .ToList();
```

### Distinct

Removes duplicates. Becomes SQL `SELECT DISTINCT`.

```csharp
// Ids of every user who has made at least one reservation, each listed once
List<int> userIds = db.Reservations
    .Select(r => r.UserProfileId)
    .Distinct()
    .ToList();
```

### Counting Related Data Inside Select

You don't need `Include` to count or total up related rows inside a `Select`. EF Core works it into the SQL query for you.

```csharp
List<CampsiteDTO> campsites = db.Campsites
    .Select(c => new CampsiteDTO
    {
        Id = c.Id,
        Nickname = c.Nickname,
        ReservationCount = c.Reservations.Count   // add an int ReservationCount property to your DTO
    })
    .ToList();
```

### Searching Text

`Contains` on a `string` checks whether the text appears anywhere in a column. In PostgreSQL it's case-sensitive, so `"owl"` won't match `"Barred Owl"`. Use `EF.Functions.ILike` for a case-insensitive search. `%` means "anything can go here."

```csharp
List<Campsite> caseSensitive = db.Campsites.Where(c => c.Nickname.Contains(search)).ToList();
List<Campsite> caseInsensitive = db.Campsites.Where(c => EF.Functions.ILike(c.Nickname, $"%{search}%")).ToList();
```

### GroupBy

Sorts rows into groups that share a value. Each group has a `Key` (the shared value) and works like a list of the rows in it, so you can call `Count`, `Sum`, and the rest on it. Becomes SQL `GROUP BY`.

```csharp
// Ids of the three most-booked campsites
List<int> mostBooked = db.Reservations
    .GroupBy(r => r.CampsiteId)
    .OrderByDescending(g => g.Count())
    .Select(g => g.Key)
    .Take(3)
    .ToList();
```

## "Could Not Be Translated" Errors

EF Core has to turn everything inside your lambdas into SQL. If you call one of your own C# methods inside a `Where` or `OrderBy`, EF Core has no SQL to turn it into, and you'll get an error saying the expression could not be translated. Filter on the actual columns instead, or call `.ToList()` first and do that part in memory.
