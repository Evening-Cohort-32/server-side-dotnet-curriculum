# Numbers

A quick syntax reference for C#'s numeric types and operations.

## Numeric Types

| Type      | Size     | Holds                                    |
|-----------|----------|-------------------------------------------|
| `sbyte`   | 8 bits   | -128 to 127                                |
| `byte`    | 8 bits   | 0 to 255                                   |
| `short`   | 16 bits  | -32,768 to 32,767                          |
| `ushort`  | 16 bits  | 0 to 65,535                                |
| `int`     | 32 bits  | -2,147,483,648 to 2,147,483,647            |
| `uint`    | 32 bits  | 0 to 4,294,967,295                         |
| `long`    | 64 bits  | -9.2 quintillion to 9.2 quintillion        |
| `ulong`   | 64 bits  | 0 to 18.4 quintillion                      |
| `float`   | 32 bits  | ~6-9 significant digits (fractional)       |
| `double`  | 64 bits  | ~15-17 significant digits (fractional)     |
| `decimal` | 128 bits | 28-29 significant digits (financial/money) |

## Declare

```csharp
int number = 42;
long largeNumber = 9223372036854775807L;   // L suffix
uint unsignedNumber = 4294967295U;         // U suffix
ulong largeUnsignedNumber = 18446744073709551615UL;  // UL suffix
float singlePrecision = 3.14159F;          // F suffix
double doublePrecision = 3.141592653589793;
decimal moneyAmount = 1234.56M;            // M suffix
```

## Arithmetic

```csharp
int sum = a + b;
int difference = a - b;
int product = a * b;
int quotient = a / b;    // integer / integer = integer (fractional part truncated)
int remainder = a % b;   // modulo

double doubleDivision = (double)a / b;   // cast one operand to get a fractional result
```

## Compound Assignment

```csharp
x += 5;   // x = x + 5
x -= 3;   // x = x - 3
x *= 2;   // x = x * 2
x /= 4;   // x = x / 4
x %= 4;   // x = x % 4
```

## Increment and Decrement

```csharp
int j = i++;   // postfix: use i's current value, then increment
int k = ++i;   // prefix: increment first, then use the new value
int l = i--;   // postfix decrement
int m = --i;   // prefix decrement
```

## Math Class

```csharp
Math.Abs(-5);        // 5
Math.Pow(2, 3);       // 8   (2 to the power of 3)
Math.Sqrt(16);        // 4
Math.Round(3.5);      // 4
Math.Ceiling(3.1);    // 4   (smallest integer >= value)
Math.Floor(3.9);      // 3   (largest integer <= value)
Math.Max(5, 10);      // 10
Math.Min(5, 10);      // 5
Math.PI;              // 3.141592653589793
```

## Type Conversion

```csharp
// implicit - happens automatically, no risk of data loss
int largerNumber = smallByteNumber;

// explicit (casting) - required when data could be lost
byte byteValue = (byte)someInt;        // truncates/wraps if someInt is too big
int truncatedValue = (int)someDouble;  // drops the fractional part

// Convert class
int parsedInt = Convert.ToInt32("123");
int roundedInt = Convert.ToInt32(3.75);   // rounds, unlike a cast

// Parse / TryParse (for strings specifically)
int parsedNumber = int.Parse("42");   // throws if invalid
if (int.TryParse(input, out int result)) { }   // returns bool instead of throwing
```

## Overflow

By default, arithmetic overflow happens silently (wraps around). `checked` makes it throw instead:

```csharp
byte smallNumber = 255;
byte result1 = (byte)(smallNumber + 1);              // 0, silent overflow

byte result2 = checked((byte)(smallNumber + 1));     // throws OverflowException
byte result3 = unchecked((byte)(smallNumber + 1));   // explicitly allows the silent wraparound
```

## Formatting Numeric Output

```csharp
Console.WriteLine($"{value:C}");           // Currency: $1,234.57
Console.WriteLine($"{value:F2}");          // Fixed decimal places: 1234.57
Console.WriteLine($"{value:N}");           // Number with separators: 1,234.57
Console.WriteLine($"{percentage:P}");      // Percent: 12.34%
Console.WriteLine($"{value:N2}");          // Number, custom precision: 1,234.57
Console.WriteLine($"{percentage:P1}");     // Percent, custom precision: 12.3%
```

## Practice

Want to try it? → [Practice: Numbers](./resource-03-working-with-integers-practice.md)
