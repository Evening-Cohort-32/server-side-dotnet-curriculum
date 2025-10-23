# Querying Data with Linq

Up until now we have been using loops to find and filter data inside collections like `List`s. Fortunately, like array methods in Javascript, .NET includes a library called Linq that provides similar methods for `List`s as well as other iterable collections. We will go into them more in depth in Book 3, but for now you will find three very useful: `Where`, `Select`, and `First` (along with `FirstOrDefault`). These three have nearly identical functionality to `filter`, `map`, and `find` in Javscript.

## `First` and `FirstOrDefault`

`First` works like the array method `find` in javascript. As a reminder, this is a basic find method in JS:

```javascript
const productThatStartsWithB = products.find((p) => p.startsWith("B"));
```

`find` takes an _anonymous function_ definition as an arg to tell `find` what it is looking for. An anonymous function is a function that is not named or assigned to a variable. That anonymous function needs to return a boolean (or something falsy). `find` will iterate through the `products` and call that anonymous function for each product, passing the element into that function as `p`. The first time that `p.startsWith("B")` is `true`, it will return that product. In this case, `productThatStartsWithB` would equal "Boomerang" if we were using the JS version of the data above.

Let's look at the same code, but using Linq in C#:

```csharp
string productThatStartsWithB = products.First(p => p.StartsWith("B"));
```

It's almost the same! Like `find`, `First` is expecting a _lambda expression_ as an arg (another term for an anonymous function). Just like `find`, the anonymous function returns a boolean to let `First` know what condition to search for.

There is one major difference: if `find` doesn't find a matching member of the array to fit the condition, it will return `undefined`. If `First` doesn't find a matching item, it will throw a runtime error. Sometimes this is what you want, but if you want the default value instead of throwing an error, `FirstOrDefault` works more like `find`:

```csharp
string productThatStartsWithZ = products.First(p => p.StartsWith("Z"));
//Unhandled exception. System.InvalidOperationException: Sequence contains no matching element

string productThatStartsWithZ = products.FirstOrDefault(p => p.StartsWith("Z"));
// productThatStartsWithZ will have a value of `null`
```

## `Where`

`Where` works nearly the same as `filter` in JS. Its lambda expression also returns a boolean, but will instead return _all_ instances that meet the condition. So, for example:

```csharp
string productThatStartsWithB products.Where(t => t.StartsWith("B")).ToList();

foreach (string product in productsThatStartWithB)
{
    Console.WriteLine(product);
}
//outputs each of the products beginning with B
```

One difference between `filter` in JS and `Where` in .NET is that `Where` does not, by default, return a `List`, but another type called `IEnumerable`. Don't worry about this other type for now, just use the `ToList` method to turn the result into a `List`.

## `Select`

`Select` is similar to the `map` array method in JS. `map` and `Select` both loop through a collection and return something in place of each object in the collection. The lambda expression should return the new thing that will replace the collection member. Consider this code using `Select`:

```csharp
List<string> screamedProducts = products.Select(p => p.ToUpper()).ToList();
foreach (string product in screamedProducts)
{
    Console.WriteLine(product);
}
// outputs each of the products in all caps
```

## Product Category Filter with Linq Methods
Now that you have been introduced to Linq methods, let's refactor some of our code with one of them to show just one category of products.

Right before we display the list of all products on the console, add the following to create a new array of all the products with the word "ball" in their name:

``` csharp
List<Product> balls = products.Where(p => p.Contains(`ball`).ToList();
```

Now, you can update the code to display only the balls by iterating through this new array instead.

**Here are some places in your app you might consider using a Linq method when using loops**:
1. Anywhere that you are searching for an individual item in products or product types. (HINT: you need to use `FirstOrDefault` and search by `product.Name`, if you are looking for an item with a name that you know.) This could be when updating an item, as an example. 
1. To allow a user to search by product type, you need to show them the list of product types, and then filter the list of products based on the user's input. These are good use cases for `Where` (to filter the products by ProductTypeId) and `Select` (to turn the List of ProductTypes into strings to display them). See if you can refactor the code you have for that feature to use these methods instead of loops to do that work. If you're struggling with how to implement this, ask an instructor to talk through it with you.

Up Next: [User-Defined Types: Classes](./classes-intro.md)