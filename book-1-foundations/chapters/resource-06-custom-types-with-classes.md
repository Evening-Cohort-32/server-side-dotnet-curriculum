# Custom Types: Classes

A quick syntax reference for defining and using your own types with the `class` keyword.

## Define a Class

```csharp
public class Person
{
    // properties - store data
    public string Name { get; set; }
    public int Age { get; set; }
    public string Occupation { get; set; }

    // methods - add behavior
    public void Introduce()
    {
        Console.WriteLine($"Hello, my name is {Name}. I am {Age}.");
    }
}
```

## Constructors

A constructor runs when `new` creates an instance - use one to require certain values up front:

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }

    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

Person person = new Person("Alice", 30);   // now the constructor's parameters are required
```

Adding a constructor like this removes the automatic empty one - `new Person()` and object initializer syntax (below) won't compile anymore unless you also keep a parameterless constructor.

## Access Modifiers

```csharp
public string Name { get; set; }     // accessible from anywhere
private int _idCounter;              // accessible only inside this class
protected string InternalNote;       // accessible in this class and classes that inherit from it
```

## Read-Only and Restricted-Write Properties

```csharp
public string Name { get; }                // can only be set in the constructor, not changed after
public int Age { get; private set; }        // readable from anywhere, but only settable inside the class
```

## Create an Instance

```csharp
// property-by-property
Person person1 = new Person();
person1.Name = "Alice";
person1.Age = 30;

// object initializer syntax - more concise
Person person2 = new Person { Name = "Bob", Age = 25, Occupation = "Data Analyst" };

person1.Introduce();
```

## Collections of Custom Types

```csharp
List<Person> people = new List<Person>();
people.Add(person1);
people.Add(new Person { Name = "Charlie", Age = 35, Occupation = "Teacher" });

// or build the list with instances already inside it
List<Person> people = new List<Person>
{
    new Person { Name = "Alice", Age = 30 },
    new Person { Name = "Bob", Age = 25 }
};
```

## Iterate and Call Methods

```csharp
foreach (Person person in people)
{
    person.Introduce();
}
```

## Practice

Want to try it? → [Practice: Classes](./resource-06-custom-types-with-classes-practice.md)
