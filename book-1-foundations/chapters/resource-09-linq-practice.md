# Practice: LINQ

Short, standalone drills for LINQ syntax. Each one only needs a `Program.cs` you can throw away when you're done - no project setup required. Pick whichever ones match what you're rusty on; you don't need to do them in order.

← Back to [LINQ](./resource-09-linq.md)

1. Given `List<string> fruits = new List<string> { "Apple", "Banana", "Cherry", "Blueberry" };`, use `Where` to get a list of all fruits starting with "B", and print each one.

1. Using that same list, use `Select` to build a new list of every fruit name in uppercase, and print it.

1. Use `First` to find the first fruit containing "err", then use `FirstOrDefault` to look for one starting with "Z" - print whether it found anything without letting the program throw.

1. Given `List<int> scores = new List<int> { 88, 45, 76, 92, 61 };`, use `Any` to check whether any score is above 90, and `All` to check whether every score is passing (60 or above). Print both results.

1. Using that same scores list, print the `Sum`, `Average`, `Min`, and `Max`.
