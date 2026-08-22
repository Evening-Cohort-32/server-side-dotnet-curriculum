# Exceptions

A quick syntax reference for handling errors with try/catch/finally. All exception types derive from `System.Exception`.

## Common Exception Types

| Exception | Thrown when... |
|-----------|-----------------|
| `FormatException` | a string is in the wrong format to parse (e.g. `int.Parse("abc")`) |
| `DivideByZeroException` | integer division by zero |
| `IndexOutOfRangeException` | an array/collection index is out of bounds |
| `NullReferenceException` | accessing a member on a `null` reference |
| `ArgumentException` | a method receives an invalid argument |
| `ArgumentNullException` | a method receives `null` where it isn't accepted |
| `OverflowException` | an arithmetic operation overflows a `checked` context |
| `InvalidOperationException` | a method call is invalid given the object's current state |

## Basic try/catch

```csharp
try
{
    string input = Console.ReadLine();
    int number = int.Parse(input);
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred: {ex.Message}");
}
```

## Catching Specific Types

Order matters - put more specific exception types **before** more general ones, or the general catch will intercept everything first:

```csharp
try
{
    int result = number / number2;
}
catch (FormatException ex)
{
    Console.WriteLine("Please enter a valid integer.");
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("The second number cannot be zero.");
}
catch (Exception ex)
{
    Console.WriteLine($"An unexpected error occurred: {ex.Message}");
}
```

## The finally Block

Runs whether an exception was thrown or not - useful for cleanup:

```csharp
try
{
    int result = 100 / divisor;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
finally
{
    Console.WriteLine("This always executes.");
}
```

## Throwing Your Own Exceptions

```csharp
if (age < 0)
{
    throw new ArgumentException("Age cannot be negative.");
}
```

## Custom Exception Types

```csharp
public class InsufficientFundsException : Exception
{
    public InsufficientFundsException(string message) : base(message) { }
}

throw new InsufficientFundsException("Not enough balance to complete this withdrawal.");
```

## Re-throwing

```csharp
catch (Exception ex)
{
    LogError(ex);
    throw;   // re-throws the same exception, preserving its original stack trace - lets it propagate up after logging it here
}
```

## Exception Filters

Add a condition to a `catch` block with `when` - it only runs if both the type matches and the condition is true:

```csharp
catch (Exception ex) when (ex.Message.Contains("timeout"))
{
    Console.WriteLine("Request timed out - try again.");
}
```

## Exception Properties

```csharp
catch (Exception ex)
{
    ex.Message;         // description of the error
    ex.StackTrace;       // where the error occurred
    ex.InnerException;   // the exception (if any) that caused this one - check for null first
}
```

## Practice

Want to try it? → [Practice: Exceptions](./resource-08-handling-exceptions-practice.md)
