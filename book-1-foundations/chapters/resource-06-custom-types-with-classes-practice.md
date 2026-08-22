# Practice: Classes

Short, standalone drills for defining and using custom types. Each one only needs a `Program.cs` you can throw away when you're done - no project setup required. Pick whichever ones match what you're rusty on; you don't need to do them in order.

← Back to [Custom Types: Classes](./resource-06-custom-types-with-classes.md)

1. Define a `Book` class with `Title`, `Author`, and `PageCount` properties, and a `DisplayInfo()` method that prints them. Create one instance property-by-property, and print its info.

1. Create a second `Book` instance using object initializer syntax (`new Book { Title = ..., Author = ... }`) instead. Print its info too.

1. Create a `List<Book>` and add three books to it - one with `.Add()` on an existing instance, one by constructing a new `Book` inline inside `.Add()`, and one already inside the list's initializer.

1. Loop over that list with `foreach` and call `DisplayInfo()` on each book.

1. Define a second class of your choosing (e.g. `Movie`, `Recipe`, `Song`) with at least two properties and one method, then repeat steps 3 and 4 for it.
