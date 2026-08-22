# LINQ

A quick syntax reference for querying and transforming collections with LINQ, instead of writing the equivalent loop by hand. Requires `using System.Linq;`. Works on `List<T>`, arrays, and anything else that's `IEnumerable<T>`.

## Where

Filters to items matching a condition. Returns an `IEnumerable<T>` - chain `.ToList()` to get a `List` back.

```csharp
List<string> ballProducts = products.Where(p => p.Contains("ball")).ToList();
```

## Select

Transforms each item into something new.

```csharp
List<string> upperNames = products.Select(p => p.ToUpper()).ToList();
```

## First and FirstOrDefault

```csharp
string firstB = products.First(p => p.StartsWith("B"));         // throws if nothing matches
string firstZ = products.FirstOrDefault(p => p.StartsWith("Z")); // null if nothing matches
```

## Any and All

```csharp
bool hasBall = products.Any(p => p.Contains("ball"));       // true if at least one item matches
bool allStartWithA = products.All(p => p.StartsWith("A"));  // true only if every item matches
```

## Count

```csharp
int ballCount = products.Count(p => p.Contains("ball"));   // count of items matching a condition
int total = products.Count();                              // count of everything
```

## OrderBy and OrderByDescending

```csharp
List<string> sorted = products.OrderBy(p => p).ToList();
List<string> sortedDesc = products.OrderByDescending(p => p).ToList();
```

## Sum, Average, Min, Max

```csharp
decimal total = products.Sum(p => p.Price);
decimal average = products.Average(p => p.Price);
decimal cheapest = products.Min(p => p.Price);
decimal priciest = products.Max(p => p.Price);
```

## Practice

Want to try it? → [Practice: LINQ](./resource-09-linq-practice.md)
