# Strings & Console I/O

A quick syntax reference for working with strings and reading/writing to the console.

## Declare a String

```csharp
string greeting = "Hello, World!";
string emptyString = "";
string nullString = null;
string verbatim = @"This can span
multiple lines.";
```

## Concatenation

```csharp
string fullName = firstName + " " + lastName;
```

## Interpolation

```csharp
string message = $"Name: {firstName} {lastName}, Age: {age}";
```

## String Methods

```csharp
sample.Length;              // int
sample.ToUpper();
sample.ToLower();
sample.Substring(0, 5);     // starting index, length
sample.Replace("Hello", "Hi");
sample.Contains("World");   // true/false
sample.StartsWith("Hello"); // true/false
sample.EndsWith("!");       // true/false
sample.Trim();               // removes leading/trailing whitespace
sample.TrimStart();
sample.TrimEnd();
sample.IndexOf("World");     // index of first match, -1 if not found
sample.PadLeft(20);          // pads with spaces on the left until the string is 20 chars long
sample.PadRight(20, '-');    // same, but pads on the right with a custom character

string.IsNullOrEmpty(sample);       // true if sample is null OR ""
string.IsNullOrWhiteSpace(sample);  // true if sample is null, "", OR only whitespace

string.Join(", ", fruits);          // combines a collection into one string with a separator
string[] parts = sample.Split(", "); // splits a string into an array on a separator
```

## Comparing Strings

```csharp
firstName == lastName;          // compares by value - true if the text is identical
firstName.Equals(lastName);     // same result as == for strings, more explicit
```

## Console Output

```csharp
Console.Write("No newline after this. ");
Console.WriteLine("Newline after this.");
```

## Formatting Output

```csharp
Console.WriteLine($"Total: ${total}");                 // interpolation
Console.WriteLine(string.Format("Total: ${0}", total)); // string.Format
Console.WriteLine($"Total: ${total:F2}");               // F2 = 2 decimal places
Console.WriteLine($"Total: {total:C}");                 // C = currency
```

## Console Input

```csharp
string name = Console.ReadLine();

// input is always a string - parse it to use as another type
string ageInput = Console.ReadLine();
int age = int.Parse(ageInput);   // throws if ageInput isn't a valid int

// safer: TryParse doesn't throw on invalid input
if (int.TryParse(ageInput, out int age))
{
    Console.WriteLine($"You'll be {age + 10} in 10 years.");
}
else
{
    Console.WriteLine("That's not a valid age!");
}
```

## Reading a Single Key

```csharp
Console.WriteLine("Press any key to continue...");
ConsoleKeyInfo keyInfo = Console.ReadKey();          // shows the key that was pressed on screen
Console.WriteLine($"You pressed: {keyInfo.KeyChar}");

Console.ReadKey(true);   // intercept mode - the keypress isn't echoed to the console
```

## Console Colors

```csharp
Console.ForegroundColor = ConsoleColor.Green;   // text color
Console.BackgroundColor = ConsoleColor.Black;
Console.WriteLine("This line is styled.");
Console.ResetColor();   // back to the default colors
```

## Practice

Want to try it? → [Practice: Strings & Console I/O](./resource-01-interacting-with-console-practice.md)
