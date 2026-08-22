# Practice: Exceptions

Short, standalone drills for try/catch/finally syntax. Each one only needs a `Program.cs` you can throw away when you're done - no project setup required. Pick whichever ones match what you're rusty on; you don't need to do them in order.

← Back to [Exceptions](./resource-08-handling-exceptions.md)

1. Wrap `int number = int.Parse(Console.ReadLine());` in a `try`/`catch` that prints a friendly message instead of crashing when the input isn't a number.

1. Given `int[] numbers = { 1, 2, 3 };`, deliberately access `numbers[10]` inside a `try` block and catch the specific exception it throws (not just a general `catch (Exception ex)`).

1. Write code that reads two numbers and divides them, with two separate `catch` blocks - one for `FormatException`, one for `DivideByZeroException` - each with its own message, plus a general `catch (Exception ex)` after both.

1. Add a `finally` block to question 3's code that always prints "Done" regardless of whether an exception was thrown.

1. Take this broken calculator snippet and add exception handling so it doesn't crash on bad input:
   ```csharp
   Console.Write("Enter a number: ");
   int a = int.Parse(Console.ReadLine());
   Console.Write("Enter another number: ");
   int b = int.Parse(Console.ReadLine());
   Console.WriteLine($"{a} / {b} = {a / b}");
   ```
   It should handle non-numeric input and division by zero, each with its own message.
