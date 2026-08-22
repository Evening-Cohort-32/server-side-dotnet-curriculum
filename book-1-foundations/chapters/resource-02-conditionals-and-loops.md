# Conditionals & Loops

A quick syntax reference for control flow: making decisions and repeating code.

## If / Else If / Else

```csharp
if (score >= 90)
{
    Console.WriteLine("Grade: A");
}
else if (score >= 80)
{
    Console.WriteLine("Grade: B");
}
else
{
    Console.WriteLine("Grade: F");
}
```

## Switch Statement

```csharp
switch (day)
{
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    default:
        dayName = "Invalid day";
        break;
}
```

## Nested Conditionals

An `if` can contain another `if` - useful when the second decision only makes sense once the first is true:

```csharp
if (isWeekend)
{
    if (isRaining)
    {
        Console.WriteLine("Stay home and watch a movie.");
    }
    else
    {
        Console.WriteLine("Go out and enjoy the day!");
    }
}
```

## Ternary Operator

```csharp
string status = (age >= 18) ? "adult" : "minor";
```

## Switch Expression

A more compact alternative to the `switch` statement above, using `=>` instead of `case`/`break`:

```csharp
string dayName = day switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    _ => "Invalid day"   // _ is the default case
};
```

It also supports relational patterns, which the classic `switch` statement can't do directly:

```csharp
string grade = score switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    _ => "F"
};
```

## Pattern Matching with is

```csharp
if (someValue is int number)   // checks the type AND assigns it to "number" in one step
{
    Console.WriteLine($"It's an int: {number}");
}

if (someValue is not null) { }
```

## Logical Operators

```csharp
isWeekend && !isRaining   // AND, NOT - both/all conditions must be true
isHoliday || isVacation   // OR - at least one condition must be true
```

## For Loop

```csharp
for (int i = 1; i <= 5; i++)   // initialization; condition checked before each pass; runs after each pass
{
    Console.WriteLine(i);
}
```

## While Loop

```csharp
int i = 1;
while (i <= 5)   // condition checked before each pass - may run zero times
{
    Console.WriteLine(i);
    i++;
}
```

## Do-While Loop

```csharp
int i = 1;
do
{
    Console.WriteLine(i);
    i++;
} while (i <= 5);   // condition checked after each pass - always runs at least once
```

## Foreach Loop

```csharp
foreach (string fruit in fruits)   // iterates over a collection - no index tracking needed
{
    Console.WriteLine(fruit);
}
```

## Break and Continue

```csharp
for (int i = 1; i <= 10; i++)
{
    if (i == 5) break;      // exits the loop immediately
    Console.WriteLine(i);
}

for (int i = 1; i <= 10; i++)
{
    if (i % 2 == 0) continue;   // skips the rest of this pass, moves to the next
    Console.WriteLine(i);
}
```

## Practice

Want to try it? → [Practice: Conditionals & Loops](./resource-02-conditionals-and-loops-practice.md)
