# Practice: Dictionaries

Short, standalone drills for `Dictionary<TKey, TValue>` syntax. Each one only needs a `Program.cs` you can throw away when you're done - no project setup required. Pick whichever ones match what you're rusty on; you don't need to do them in order.

← Back to [Dictionaries](./resource-05-dictionaries.md)

1. Create a `Dictionary<string, double>` of three menu items and their prices, then add a fourth using indexer syntax (`menu["Item"] = price;`).

1. Given `Dictionary<string, string> capitals = new Dictionary<string, string> { { "USA", "Washington D.C." }, { "France", "Paris" } };`, use `TryGetValue` to look up `"Germany"` and print either the result or "not found" - without letting the program throw.

1. Using that same dictionary, remove `"France"` with `.Remove()`, then try to remove `"Germany"` and print what `.Remove()` returns both times.

1. Given `Dictionary<string, int> inventory = new Dictionary<string, int> { { "Apples", 12 }, { "Bananas", 0 } };`, check with `ContainsKey` whether `"Bananas"` and `"Oranges"` are keys, and print both results.

1. Given that same inventory dictionary, iterate through it with `foreach` and print each item name alongside its count. Then do it again printing only the keys, and a third time printing only the values.
