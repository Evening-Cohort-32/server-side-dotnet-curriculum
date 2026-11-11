# Adding and Updating Data with Forms
In this exercise you'll finish CRUD for DeShawn's dog owners by adding pages to create, edit, and delete them. In React, a form was a component with state, and submitting it meant writing a `fetch` call. In an MVC app, a form is plain HTML that the server builds, and the browser submits it to the server on its own.

## Creating an owner
Think about interactions we have in real life involving filling out forms. Doctors' visits come to mind. When you go to the doctor, you're likely to have two interactions with the person behind the counter. The first is when you go to the receptionist and ask for a blank form. The receptionist gives you the form so you can go back to your chair and fill it out. Once you're done, you go back up to the counter and hand the form back so they can process it.

This is the same sort of interaction users have with the server, and it takes two actions in the controller with the same name:
1. When a user goes to `/Owners/Create`, they are making a `GET` request to that URL. This is the request that gives them the HTML of the empty form.
1. When the user clicks the "Create" button, the browser makes a `POST` request to the same URL, with the contents of the form in the body of the request.

Add the first one to the `OwnersController`:
> OwnersController.cs
``` csharp
// GET: Owners/Create
public IActionResult Create()
{
    return View();
}
```
Since the only thing the server needs to do is hand the user a blank form, this is all the action needs. The rest of the work is in the view.

### Building the form
Add a `Create.cshtml` file to the `Views/Owners` folder:
> Views/Owners/Create.cshtml
``` html+razor
@model Owner

@{
    ViewData["Title"] = "New Owner";
}

<h1>New Owner</h1>

<div class="row">
    <div class="col-md-4">
        <form asp-action="Create">
            <div class="mb-3">
                <label asp-for="Name" class="form-label"></label>
                <input asp-for="Name" class="form-control" />
            </div>
            <div class="mb-3">
                <label asp-for="Email" class="form-label"></label>
                <input asp-for="Email" class="form-control" />
            </div>
            <div class="mb-3">
                <label asp-for="Phone" class="form-label"></label>
                <input asp-for="Phone" class="form-control" />
            </div>
            <div class="mb-3">
                <label asp-for="Address" class="form-label"></label>
                <input asp-for="Address" class="form-control" />
            </div>
            <div class="mb-3">
                <label asp-for="CityId" class="form-label"></label>
                <input asp-for="CityId" class="form-control" />
            </div>
            <input type="submit" value="Create" class="btn btn-primary" />
        </form>
    </div>
</div>

<div class="mt-3">
    <a asp-action="Index">Back to List</a>
</div>
```
Let's look at a couple of things in this form.

#### `asp-for`
``` html+razor
<label asp-for="Email" class="form-label"></label>
<input asp-for="Email" class="form-control" />
```
`asp-for` is another attribute we get from ASP.NET and Razor, and it connects an element to a property of the view's model. When the attribute is on a `<label>` element, the generated HTML will have the property name in it. In the example here, the label will literally have the word "Email" in it. The resulting HTML will look like this:
``` html
<label class="form-label" for="Email">Email</label>
```
When the `asp-for` attribute is on an `<input>` element, it generates the `id`, `name`, and `type` attributes for the input, and if the model already has a value for that property, it fills in the `value` too. The `name` attribute is the important one: it's how the server will know later on that the value in this field is the owner's email address.

#### `asp-action`
``` html+razor
<form asp-action="Create">
```
All of our input elements should be inside a form. The `asp-action` attribute on the `form` element specifies which controller action should be called when the form gets submitted. The contents of this form will be submitted to the `Create` action in the `OwnersController`. When the form is rendered, ASP.NET will also give it `method="post"`, so the browser knows to make a `POST` request.

#### The City input
There is currently an input field for the user to enter a `CityId` into. It's doubtful a user knows the actual `Id` of the city they live in. Ideally, this would be a dropdown of the cities to choose from. We'll do that in a later exercise.

Run the application and go to `/Owners/Create` to see the form. You can try to submit it, but you'll get an error, because there's no action to handle the `POST` request yet.

### Submitting the form
Add the second `Create` action to the `OwnersController`:
> OwnersController.cs
``` csharp
// POST: Owners/Create
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Owner owner)
{
    try
    {
        _dbContext.Owners.Add(owner);
        _dbContext.SaveChanges();

        return RedirectToAction("Index");
    }
    catch (DbUpdateException)
    {
        return View(owner);
    }
}
```
There are a few things to notice here:
1. The `HttpPost` attribute is what makes this the action for the `POST` request. Without an attribute, an action handles `GET` requests, which is why the first `Create` action doesn't need one.
1. This action has an `Owner` parameter. Here's another piece of magic we get from the ASP.NET framework: it knows how to _bind_ values it gets from HTML form fields to C# objects. Each field's `name` attribute (the one that `asp-for` generated) matches a property on `Owner`, so the framework creates an `Owner` and fills in its properties from the form. This is called _model binding_.
1. If everything goes as expected and the new owner gets saved to the database, `RedirectToAction("Index")` sends the user back to `/Owners/Index`, where they can see the new owner in the list. It does this by telling the browser to make a brand new `GET` request to that URL, so if the user refreshes the page, they won't submit the form a second time.
1. If the database rejects the new owner, `SaveChanges` throws a `DbUpdateException`, and we return the same view so the user can try again. Because we pass `owner` to the view, the form will still have everything the user typed in it. (`DbUpdateException` comes from EF Core, so your controller needs `using Microsoft.EntityFrameworkCore;` at the top, if it doesn't have it already.)

#### `ValidateAntiForgeryToken`
View the page source of the form in your browser, and you'll find an input you didn't write:
``` html
<input name="__RequestVerificationToken" type="hidden" value="CfDJ8..." />
```
ASP.NET adds this hidden input to every form that `POST`s. The value is a random token that only your server could have generated. The `ValidateAntiForgeryToken` attribute on the action rejects any `POST` request that doesn't include a valid token. This protects your users from another website quietly submitting a form to your app on their behalf. Put this attribute on every action that handles a `POST`.

Run the application and submit the form. The new owner should be added to the database, and you should land back on the owners list. Now try creating an owner with a `CityId` of `999`. There's no city with that `Id`, so the database rejects it and you should see the form again, with your values still in it. Nothing tells the user what went wrong yet, but you'll fix that when you learn about validation.

### Linking to the form
Users need a way to get to the form. Open your `Views/Owners/Index.cshtml` and add a link to the `Create` action above the table:
``` html+razor
<p>
    <a asp-action="Create">Add Owner</a>
</p>
```

## Deleting an owner
Deleting also takes two actions. The `GET` action shows a page that asks the user to confirm the deletion, and the `POST` action does the deleting. The `GET` action accepts an `int id` parameter, which ASP.NET gets from the route: `/Owners/Delete/5` means the user is attempting to delete the owner with an `Id` of 5. Let's assume that the owner with the `Id` of 5 is Michael Moore. We want the page to say "Are you sure you want to delete Michael Moore?", so we'll have to get the owner from the database.

Add this action to the `OwnersController`:
> OwnersController.cs
``` csharp
// GET: Owners/Delete/5
public IActionResult Delete(int id)
{
    Owner? owner = _dbContext.Owners.SingleOrDefault(o => o.Id == id);

    if (owner == null)
    {
        return NotFound();
    }

    return View(owner);
}
```
Then add a `Delete.cshtml` file to the `Views/Owners` folder:
> Views/Owners/Delete.cshtml
``` html+razor
@model Owner

@{
    ViewData["Title"] = "Delete Owner";
}

<h3>Are you sure you want to delete @Model.Name?</h3>

<form asp-action="Delete" asp-route-id="@Model.Id">
    <input type="submit" value="Delete" class="btn btn-danger" /> |
    <a asp-action="Index">Back to List</a>
</form>
```
The form doesn't have any inputs, because the only thing the server needs to know is _which_ owner to delete, and that's already in the URL thanks to `asp-route-id`. Run the application and go to `/Owners/Delete/3` to view the confirmation page.

If the user clicks the Delete button, a `POST` request will be made to `/Owners/Delete/3`. Add the action that handles it to the `OwnersController`:
> OwnersController.cs
``` csharp
// POST: Owners/Delete/5
[HttpPost, ActionName("Delete")]
[ValidateAntiForgeryToken]
public IActionResult DeleteConfirmed(int id)
{
    Owner? owner = _dbContext.Owners.SingleOrDefault(o => o.Id == id);

    if (owner != null)
    {
        _dbContext.Owners.Remove(owner);
        _dbContext.SaveChanges();
    }

    return RedirectToAction("Index");
}
```
Both delete actions need the same `int id` parameter, and C# doesn't allow two methods with the same name and the same parameters in one class. So this one gets a different method name, `DeleteConfirmed`, and the `ActionName("Delete")` attribute tells the framework to use it as the `Delete` action anyway.

> :bulb: Each `Dog` has a required `OwnerId`, so EF Core set up the database to _cascade_ deletes: when you delete an owner, their dogs (and those dogs' walks) are deleted along with them. Try deleting an owner who has dogs, then check the `Dogs` table in pgAdmin.

## Editing an owner
Editing an owner is similar to creating an owner, except that when the user gets the form, it should be filled in with the owner's current data. Once again, the controller gets an owner's `Id` from the URL (like `/Owners/Edit/2`), and uses it to get that owner from the database. Add this action to the `OwnersController`:
> OwnersController.cs
``` csharp
// GET: Owners/Edit/5
public IActionResult Edit(int id)
{
    Owner? owner = _dbContext.Owners.SingleOrDefault(o => o.Id == id);

    if (owner == null)
    {
        return NotFound();
    }

    return View(owner);
}
```
For the view, make a copy of `Create.cshtml` in the `Views/Owners` folder, and name it `Edit.cshtml`. Then make these changes to it:
1. Change the title and the `<h1>` to say "Edit Owner".
1. Change the form to `<form asp-action="Edit" asp-route-id="@Model.Id">`.
1. Change the submit button's `value` to "Save".

Run the application and go to `/Owners/Edit/2`. Even though the view is almost the same as the one for creating an owner, this time the form is filled in. That's `asp-for` filling in each input's `value` from the model, because this time the controller passed an owner to the view.

Now add the action that handles the `POST`. This is similar to `Create`, except we are updating the owner in the database instead of adding a new one:
> OwnersController.cs
``` csharp
// POST: Owners/Edit/5
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Edit(Owner owner)
{
    try
    {
        _dbContext.Owners.Update(owner);
        _dbContext.SaveChanges();

        return RedirectToAction("Index");
    }
    catch (DbUpdateException)
    {
        return View(owner);
    }
}
```

### Where does the `Id` come from?
The form has no input for `Id`, because users shouldn't be able to change an owner's `Id`. But `Update` uses the `Id` to know which row in the database to update. So how does the server know which owner this is?

Put a breakpoint on the `Update` line, edit an owner, and inspect the `owner` parameter when the debugger stops. Its `Id` is correct! Model binding doesn't only look at form fields. When it can't find a value in the form, it looks in the route data too, and the form was submitted to `/Owners/Edit/2`, which has an `id` in it.

That works here, but only because the `Id` property happens to line up with the `id` in the route. In the next exercise, the owner will be wrapped inside another object, and the route won't be able to fill in its `Id` anymore. The dependable way to send the `Id` is to _hide_ the input field: keep it in the form so that it gets submitted, but don't show it to the user. Add this inside the form in `Edit.cshtml`, right after the opening `<form>` tag:
``` html+razor
<input asp-for="Id" type="hidden" />
```
Run the application, edit an owner, and confirm that your changes show up in the owners list.

### Linking to the forms
Finally, give users a way to get to the edit and delete pages. In your `Views/Owners/Index.cshtml`, add links to each row of the table, next to the Details link:
``` html+razor
<a asp-action="Edit" asp-route-id="@owner.Id">Edit</a> |
<a asp-action="Delete" asp-route-id="@owner.Id">Delete</a>
```
(If you named your loop variable something other than `owner`, use that name instead.)

Up Next: [View Models](./deshawns-07-view-models.md)

## 🔍 Additional Materials
1. [Tag Helpers in forms](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/working-with-forms)
1. [Model binding](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding)
1. [Prevent Cross-Site Request Forgery (XSRF/CSRF) attacks](https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery)
