# Practice: Strings & Console I/O

Short, standalone drills for strings and console input/output. Each one only needs a `Program.cs` you can throw away when you're done - no project setup required. Pick whichever ones match what you're rusty on; you don't need to do them in order.

← Back to [Strings & Console I/O](./resource-01-interacting-with-console.md)

1. Declare two strings, `firstName` and `lastName`. Combine them into a `fullName` once using `+` concatenation, and once using interpolation. Print both.

1. Given `string sample = "Hello, World!";`, print its `.Length`, its `.ToUpper()` version, and just the first 5 characters using `.Substring()`.

1. Use `Console.Write()` twice to print two phrases on the same line, then `Console.WriteLine()` to move to a new line before printing a third phrase.

1. Given `double total = 42.5;`, print it formatted as currency (`:C`) and separately formatted to exactly 2 decimal places (`:F2`).

1. Prompt the user with `Console.ReadLine()` for their age as text, then use `int.TryParse()` to convert it - print their age in 10 years if it's valid, or a friendly error message if it's not.
