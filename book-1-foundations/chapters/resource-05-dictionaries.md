# Dictionaries

A quick syntax reference for `Dictionary<TKey, TValue>`, C#'s key-value collection type. Instead of looking items up by numeric index like a List, you look them up by a unique key. Dictionaries live in the `System.Collections.Generic` namespace.

## Create

```csharp
Dictionary<string, int> ages = new Dictionary<string, int>();  // empty

Dictionary<string, string> capitals = new Dictionary<string, string>   // { } pair syntax
{
    { "USA", "Washington D.C." },
    { "UK", "London" }
};

Dictionary<string, string> countryCodes = new Dictionary<string, string>  // indexer syntax
{
    ["USA"] = "US",
    ["United Kingdom"] = "GB"
};
```

## Add

```csharp
ages.Add("Alice", 30);   // throws if "Alice" is already a key
ages["Bob"] = 25;        // indexer syntax: adds if new, overwrites if the key already exists
ages.TryAdd("Alice", 31);  // returns false instead of throwing if the key already exists
```

## Access

```csharp
capitals["USA"];   // "Washington D.C." - throws if the key doesn't exist

// safe lookups
if (capitals.ContainsKey("Germany")) { capitals["Germany"]; }

if (capitals.TryGetValue("Germany", out string germanCapital))
{
    Console.WriteLine(germanCapital);
}

// GetValueOrDefault - one line instead of a TryGetValue/if block, when a fallback is fine
string capital = capitals.GetValueOrDefault("Germany", "Unknown");
```

## Remove

```csharp
capitals.Remove("UK");        // returns true if a pair was removed, false if the key wasn't found
capitals.Remove("UK", out string removedValue);   // out overload - also gives you the value that was removed
capitals.Clear();             // removes everything
```

## Check Existence

```csharp
capitals.ContainsKey("USA");        // true/false, checks keys
capitals.ContainsValue("London");   // true/false, checks values (slower - has to search every value)
```

## Iterate

```csharp
foreach (KeyValuePair<string, string> pair in capitals)   // or: foreach (var pair in capitals)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}");
}

foreach (string country in capitals.Keys) { }
foreach (string capital in capitals.Values) { }
```

## Dictionaries of Custom Types

```csharp
Dictionary<string, Person> people = new Dictionary<string, Person>
{
    { "employee1", new Person { Name = "Alice", Age = 30 } },
    { "employee2", new Person { Name = "Bob", Age = 25 } }
};

Person employee2 = people["employee2"];
```

## Sorting

A Dictionary itself has no guaranteed order, but you can sort a view of it with LINQ (see [LINQ](./resource-09-linq.md)):

```csharp
var sortedByKey = capitals.OrderBy(pair => pair.Key);
var sortedByValue = capitals.OrderByDescending(pair => pair.Value);
```

## Dictionary vs. List

Reach for a **Dictionary** when you need to look values up by a unique identifier, check whether a key exists, or want fast (O(1) average) lookups. Reach for a **List** when order matters, you need to access by numeric index, or you need to store duplicate values.

## Practice

Want to try it? → [Practice: Dictionaries](./resource-05-dictionaries-practice.md)
