## Calculated Properties

So far, we defined all our properties with `{ get; set; }`. This is called an _auto-implemented_ property. This means that the _getter_ and _setter_ are created by the compiler so that you don't have to write them by hand. An auto-implemented `get`ter for a property will simply return the value of that property. But if we want, we could write the `get` ourselves to return something more interesting. A classic example is creating a property to retrieve a full name for a person when we are storing their first and last names separately. That looks like this:

```csharp
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName
    {
        get
        {
            return FirstName + " " + LastName;
        }
    }
}
```

This lets us maintain an organized, non-repetitive structure and also provide a convenient, reusable property. To apply this in our example, add this calculated property called DiscountPrice to the Product class:

```csharp
public string DiscountedPrice
    {
        get
        {
            return Price / 2;
        }
    }
```

Next, add this value to the WriteLine command, and run the application to see it working.

## Casting 

This is useful, but you might notice a problem. If you have an odd-numbered price and divide it by 2, the result will be rounded down. This is because in C# (and other languages) when dividing two `int` values, the result will also be an `int`. Assuming we want the value to include a decimal part when necessary, we need to find a way around this.

The solution is to make sure one of the numbers is a decimal typed value. So we could instead multiply the price by `.5`. Make that change and see how it works.

That will solve the issue here because we happen to be using a hardcoded value, but that won't always be the case. The good news is that you can _cast_ a value as another type. This is what that syntax looks like:

```csharp
int firstNumber = 1;
double firstNumberAsDouble = (double)firstNumber;
double half = firstNumberAsDouble / 2;
Console.WriteLine(half);
//result: 0.5
```

Notice that we only had to turn one of the numbers into a `double` for this to work. If you do arithmetic on two numbers of different types, C# will implicitly try to give a result with the more specific type. Also take note that `firstNumber` is still an `int` with a value of `1`. The type system rules are still in place. We just took the _value_ of `1` and converted it to a double, so it gets its own variable `firstNumberAsDouble` that has the `double` type.

Try casting the value of price to a `double` in our getter method before dividing it by 2, then run the app to see this working.

Note: you can try to cast any variable as any other type, but you will get a runtime `Exception` if the conversion is not possible.


## Ternary Conditional Operator 

Let's add another calculated property called ShippingCost. The business logic here is that for any item over $10 shipping is free, otherwise ShippingCost is $5. To implement this, we can add a property with just a getter function like this:

```csharp
        get
        {
            int cost;
            if (Price > 10) cost = 0;
            else cost = 5;
            return cost;
        }
```

But there's another way. When you have simple conditional logic with only two options, the ternary conditional operator can be a cleaner way to write it in one line. The basic format is this: 

`test` ? `output if true` : `output if false`

So we could rewrite our function like this:

```csharp
        get
        {
           int cost = (price > 10) ? 0 : 5;
           return cost;
        }
```

If the part before the `?` is true, this expression will return what's on the left side of the `:`. Otherwise, it'll return what's on the right side. You can include a ternary as an expression within other code for an even more concise approach:


`return (price > 10) ? 0 : 5;`

And you can use it in other ways, like inside the {} with string interpolation. But that doesn't mean you should always try to minimize your code lines. When things are simple enough, it can be elegant. But cramming together a lot of operations in one line can make your code hard to understand and debug. 

Up Next: [Working with DateTime](./foundations-datetime.md)

