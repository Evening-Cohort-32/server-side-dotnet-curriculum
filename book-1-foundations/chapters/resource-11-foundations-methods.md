# Methods

A quick syntax reference for defining and calling methods - named, reusable blocks of code.

## Method Signature

```csharp
void Greet()
{
    Console.WriteLine("Hello!");
}
```

- `void` - the return type. `void` means the method doesn't return a value.
- `Greet` - the method name
- `()` - the parameter list (empty here)

## Calling a Method

```csharp
Greet();
```

## Parameters

```csharp
void Greet(string name)
{
    Console.WriteLine($"Hello, {name}!");
}

Greet("Alice");   // "name" receives the value "Alice"
```

Multiple parameters:

```csharp
void DisplayTotal(decimal price, int quantity)
{
    Console.WriteLine($"Total: {price * quantity}");
}

DisplayTotal(9.99M, 3);
```

## Return Values

```csharp
int Add(int a, int b)
{
    return a + b;
}

int sum = Add(2, 3);   // sum = 5
```

The return type must match what `return` actually gives back. A method with no `return` statement has a return type of `void`.

## Practice

Want to try it? → [Practice: Methods](./resource-11-foundations-methods-practice.md)
