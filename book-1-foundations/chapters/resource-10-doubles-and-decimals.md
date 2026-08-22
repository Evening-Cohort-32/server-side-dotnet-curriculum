# Doubles & Decimals

A quick syntax reference for choosing between and working with `double` and `decimal`, C#'s two most common fractional number types.

## Declare

```csharp
double distance = 3.14159;    // no suffix needed - a decimal literal defaults to double
float shortPrecision = 3.14F; // F suffix required
decimal price = 19.99M;       // M suffix required
```

## Why decimal Needs the M Suffix

```csharp
decimal price = 15.00;    // compiler error - 15.00 is read as a double, and won't implicitly convert
decimal price = 15.00M;   // correct - M tells the compiler this literal is a decimal
```

## Choosing a Type

Prefer `int` whenever you don't need a fractional part at all. Between the two fractional types:

- **`decimal`** - money, and anything else where exact precision matters (prices, totals, interest)
- **`double`** - everything else that needs a fractional part (measurements, scientific values)

## Arithmetic and Precision

```csharp
double a = 0.1 + 0.2;      // 0.30000000000000004 - double can introduce tiny rounding errors
decimal b = 0.1M + 0.2M;   // 0.3 exactly - decimal is built for exact decimal arithmetic
```

This is why `decimal` is the right choice for money - those tiny rounding errors add up.

## Accumulating a Total

```csharp
decimal totalValue = 0.0M;
foreach (Product product in products)
{
    if (!product.Sold)
    {
        totalValue += product.Price;
    }
}
Console.WriteLine($"Total inventory value: ${totalValue}");
```

## Practice

Want to try it? → [Practice: Doubles & Decimals](./resource-10-doubles-and-decimals-practice.md)
