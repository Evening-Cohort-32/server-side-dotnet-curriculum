# Lists

A quick syntax reference for `List<T>`, C#'s dynamically-sized collection type. Unlike an array, a List can grow or shrink as you add and remove items. Lists live in the `System.Collections.Generic` namespace.

## Create

```csharp
List<string> names = new List<string>();                         // empty
List<int> numbers = new List<int>(10);                           // with initial capacity
List<string> fruits = new List<string> { "Apple", "Banana" };    // pre-populated
```

The type inside `<>` is the type of item the List holds.

## Add

```csharp
names.Add("Alice");                        // one item
names.AddRange(new List<string> { "Bob", "Charlie" });  // many items at once
```

## Access and Modify

```csharp
fruits[0];          // "Apple" - zero-based index
fruits[1] = "Blueberry";  // overwrite by index
```

## Remove

```csharp
fruits.Remove("Banana");     // removes the first matching value
fruits.RemoveAt(2);          // removes by index
fruits.RemoveRange(0, 2);    // removes 2 items starting at index 0
fruits.Clear();              // removes everything
```

## Insert

```csharp
fruits.Insert(1, "Blueberry");                          // inserts at a specific index, shifting the rest
fruits.InsertRange(1, new List<string> { "X", "Y" });    // inserts multiple items at an index
```

## Search

```csharp
fruits.Contains("Banana");   // true/false
fruits.IndexOf("Banana");    // index of first match, -1 if not found
fruits.LastIndexOf("Banana");
```

## Find with a Condition

Unlike `Contains`/`IndexOf` (exact value match), `Find` and friends take a lambda so you can search by any condition:

```csharp
fruits.Find(f => f.StartsWith("B"));         // first match, or null if none found
fruits.FindAll(f => f.StartsWith("B"));      // every match, as a List<T>
fruits.FindIndex(f => f.StartsWith("B"));    // index of first match, -1 if none found
fruits.Exists(f => f.StartsWith("B"));       // true/false
```

## Iterate

```csharp
foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}

for (int i = 0; i < fruits.Count; i++)
{
    Console.WriteLine($"{i}: {fruits[i]}");
}
```

## Sort

```csharp
fruits.Sort();                                  // ascending, default comparison
fruits.Reverse();                                // flip current order
numbers.Sort((a, b) => b.CompareTo(a));          // custom comparer - this example sorts descending
```

## Binary Search

Only works correctly on an already-sorted list - much faster than `IndexOf` on large lists:

```csharp
fruits.Sort();
int index = fruits.BinarySearch("Cherry");   // negative if not found (not just -1 - see docs for the exact meaning)
```

## Convert To/From an Array

```csharp
List<string> fromArray = new List<string>(fruitArray);
string[] toArray = fruits.ToArray();
```

## Transform Every Item

```csharp
List<int> lengths = fruits.ConvertAll(f => f.Length);   // builds a new List<T> by applying a lambda to each item
```

## Lists of Custom Types

```csharp
List<Person> people = new List<Person>
{
    new Person { Name = "Alice", Age = 30 },
    new Person { Name = "Bob", Age = 25 }
};
```

## Practice

Want to try it? → [Practice: Lists](./resource-04-lists-practice.md)
