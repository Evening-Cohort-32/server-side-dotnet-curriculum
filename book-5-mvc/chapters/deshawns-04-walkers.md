# Walkers
In this exercise you'll build DeShawn's first pages that come from the database: a list of all the walkers, and a details page for a single walker. Along the way you'll pass data from a controller into a view, and use Razor to turn it into HTML.

## The `WalkersController`
Add a `WalkersController.cs` file to the `Controllers` folder, and paste the following code in it:
> WalkersController.cs
``` csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DeShawnsRazor.Models;

namespace DeShawnsRazor.Controllers;

public class WalkersController : Controller
{
    private DeShawnsRazorDbContext _dbContext;

    public WalkersController(DeShawnsRazorDbContext context)
    {
        _dbContext = context;
    }
}
```
This is the same [dependency injection pattern](../../book-4-controllers/chapters/biancas-04-dependency-injection.md#controller-constructors) you used for the controllers in Bianca's Bike Shop. When the framework creates a `WalkersController` to handle a request, it passes in the `DeShawnsRazorDbContext` that you registered in `Program.cs`, and the controller saves it in the private `_dbContext` field so that its actions can use it. The only difference is that this controller inherits `Controller`, so it can return views.

## Getting all walkers
When a user goes to `/Walkers`, we want to show them a page with a list of all the walkers in our system. Add this `Index` action to the `WalkersController`:
``` csharp
// GET: Walkers
public IActionResult Index()
{
    List<Walker> walkers = _dbContext.Walkers
        .Include(w => w.City)
        .ToList();

    return View(walkers);
}
```
This code gets all of the walkers in the `Walkers` table, along with each walker's city, and converts them to a `List`. Then, instead of calling `View()` with nothing in it, it passes the list to `View`. Whatever you pass to `View` becomes the data that the view uses to build the page. This is a lot like passing props to a React component.

If you run the app and go to `/Walkers` right now, you'll get an error saying that the view `Index` was not found. Following the convention you saw in the last exercise, `View` is looking for `Views/Walkers/Index.cshtml`, and that file doesn't exist yet.

## Viewing the list of walkers
Create a `Walkers` folder inside the `Views` folder, and add an `Index.cshtml` file to it with this code:
> Views/Walkers/Index.cshtml
``` html+razor
@model List<Walker>

@{
    ViewData["Title"] = "Walkers";
}

<h1>Walkers</h1>

<table class="table">
    <thead>
        <tr>
            <th></th>
            <th>Name</th>
            <th>City</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        @foreach (Walker walker in Model)
        {
            <tr>
                <td><img src="@walker.ImageUrl" alt="avatar" style="width: 50px" /></td>
                <td>@walker.Name</td>
                <td>@walker.City?.Name</td>
                <td><a asp-action="Details" asp-route-id="@walker.Id">Details</a></td>
            </tr>
        }
    </tbody>
</table>
```
Run the application and go to `/Walkers`. You should see your data-driven page!

### Razor templates
There are a few new things in this view.

1. `@model List<Walker>` at the top of the file tells the view what type of data to expect from the controller. Inside the view, the `Model` keyword (with a capital M) refers to whatever object the controller passed to `View`. In this case, that's the list of walkers.
1. You can use `Walker` here without a `using` directive because of `Views/_ViewImports.cshtml`. Open it, and you'll see `@using DeShawnsRazor.Models`. Like `_ViewStart.cshtml`, this file applies to every view, so every view can use your models.
1. Just like in the `@{ }` block from the last exercise, any C# code that we want evaluated in a view starts with the `@` symbol. A single expression, like `@walker.Name`, is replaced with its value. For example, if a view's model were a single walker, this Razor:
    ``` html+razor
    <h1>@Model.Name</h1>
    ```
    would produce HTML like this:
    ``` html
    <h1>Claudelle</h1>
    ```
1. We can also write things like `if` statements and `foreach` loops in Razor to dynamically create HTML. Here, the `foreach` loop creates a new table row for each walker in the list. This is the same job that `.map` does in JSX, but with a C# loop.
1. `@walker.City?.Name` uses the null-conditional operator, `?.`. `City` is a nullable property, so this displays the city's name if there is one, and nothing if there isn't, instead of throwing an exception. It works just like optional chaining in JavaScript.

### Links to actions
The last column in the table has a link for each walker:
``` html+razor
<a asp-action="Details" asp-route-id="@walker.Id">Details</a>
```
This works just like the links in the layout, except that it adds an `asp-route-id` attribute. `asp-action="Details"` says that we want the link to go to the `Details` action, and because we didn't include `asp-controller`, ASP.NET assumes the controller that rendered this view, `Walkers`. `asp-route-id` fills in the optional `{id?}` part of the default route pattern. The generated anchor tag would look something like this:
``` html
<a href="/Walkers/Details/5">Details</a>
```

### Adding walkers to the navigation bar
Users shouldn't have to type `/Walkers` into the address bar to find this page. In `Views/Shared/_Layout.cshtml`, find the `<li>` for the Privacy link, and add this right after it:
``` html+razor
<li class="nav-item">
    <a class="nav-link text-dark" asp-area="" asp-controller="Walkers" asp-action="Index">Walkers</a>
</li>
```
Because this link is in the layout, it will show up on every page in the app.

## Getting a single walker
When a user goes to `/Walkers/Details/3`, we want to take them to a page with the details of the walker whose `Id` is 3. To do this, add a `Details` action to the `WalkersController`:
``` csharp
// GET: Walkers/Details/5
public IActionResult Details(int id)
{
    Walker? walker = //Use the appropriate EF Core method to retrieve a single walker by Id, including the walker's City

    if (walker == null)
    {
        return NotFound();
    }

    return View(walker);
}
```
Notice that this method accepts an `id` parameter. When the framework calls this method, it will take whatever value is in that part of the URL and pass it to `Details`. For example, if the URL is `/Walkers/Details/2`, the framework will call the `Details` method and pass in the value `2`. The code looks in the database for a walker with the `Id` of 2. If it finds one, it passes it to the view. If it doesn't, the user will be given a 404 Not Found response. Because there might not be a walker with that `Id`, `walker` is declared as `Walker?`.

Fill in the query using the EF Core methods you already know from Creek River.

### The details view
Add a `Details.cshtml` file to the `Views/Walkers` folder:
> Views/Walkers/Details.cshtml
``` html+razor
@model Walker

@{
    ViewData["Title"] = Model.Name;
}

<h1>@Model.Name</h1>

<img src="@Model.ImageUrl" alt="avatar" style="width: 150px" />

<dl class="row mt-3">
    <dt class="col-sm-2">City</dt>
    <dd class="col-sm-10">@Model.City?.Name</dd>
</dl>

<a asp-action="Index">Back to List</a>
```
This time the controller passes a single `Walker` instead of a list, so the view's `@model` is `Walker`, and `Model` is that one walker. Notice that the page title is set from the data, so each walker's page will have their name in the browser tab.

Run the application and go to `/Walkers/Details/1`, or click on one of the Details links in the walkers list. Then go to `/Walkers/Details/999` to see that you get a 404 response back.

Up Next: [Owners](./deshawns-05-owners.md)

## 🔍 Additional Materials
1. [Razor syntax reference](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/razor)
1. [Anchor Tag Helper](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/anchor-tag-helper)
