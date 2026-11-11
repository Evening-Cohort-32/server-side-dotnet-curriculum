# Validation
_Validation_ is the process of confirming that a user has entered properly formatted data. For example, imagine a form that requires the user to enter an email address. Such a form might have two types of validation: the first confirms that the user has not left the field blank, and the second confirms that the user has entered some text that "looks like" an email address.

You've done this before. In Bianca's Bike Shop, you used [Data Annotations](../../book-4-controllers/chapters/biancas-10-validation.md#using-the-dataannotations-namespace) to validate work orders: the `[ApiController]` attribute checked every request automatically and sent back a `400` response, and your React component displayed the errors from that response. An MVC app uses the same Data Annotations, but two things are different:
1. MVC controllers don't have the `[ApiController]` attribute, so your actions have to check for validation errors themselves.
1. There's no React component to display the errors. The server builds them into the HTML of the page, just like everything else.

In this exercise you'll add validation to the owner forms.

## Adding validation rules to `Owner`
Update the `Owner` model with these attributes:
> Owner.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace DeShawnsRazor.Models;

public class Owner
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Hmmm... You should really add a name...")]
    [MaxLength(35)]
    public string Name { get; set; }

    [EmailAddress]
    public string Email { get; set; }

    [StringLength(55, MinimumLength = 5)]
    public string Address { get; set; }

    [Phone]
    public string Phone { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Please choose a city")]
    public int CityId { get; set; }

    public City? City { get; set; }
    public List<Dog>? Dogs { get; set; }
}
```
We're using attributes to tell the framework that properties have a minimum or maximum length, or need to be a valid email address or phone number.
1. Remember from when you created the models that a `string` property without a `?` is already [required](./deshawns-01-setup.md#what-are-all-of-those-question-marks), so `Email`, `Address`, and `Phone` don't need a `[Required]` attribute. `Name` gets one anyway, so that it can have a friendlier error message.
1. The `[Range]` on `CityId` works just like the one on `BikeId` in Bianca's. The "Select City" option in the dropdown has a value of `0`, and no city has an `Id` of `0`, so this rule makes sure the user actually chose one.

`[MaxLength]` and `[StringLength]` change the database schema too, so you need a new migration. Stop the app, then run:
```
dotnet ef migrations add OwnerValidation
dotnet ef database update
```

## Checking for errors in the controller
Without `[ApiController]`, nothing stops an invalid owner from reaching your `Create` action. But the framework still checks the form values against the attributes during model binding, and it records every problem it finds in a property called `ModelState`, which your controller inherits. `ModelState.IsValid` is `true` only if it didn't find any problems.

Update the `POST` `Create` action in the `OwnersController` to check it before saving:
> OwnersController.cs
```csharp
// POST: Owners/Create
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult Create(Owner owner)
{
    if (!ModelState.IsValid)
    {
        OwnerFormViewModel vm = new OwnerFormViewModel()
        {
            Owner = owner,
            Cities = _dbContext.Cities.ToList()
        };

        return View(vm);
    }

    try
    {
        _dbContext.Owners.Add(owner);
        _dbContext.SaveChanges();

        return RedirectToAction("Index");
    }
    catch (DbUpdateException)
    {
        ModelState.AddModelError("", "Something went wrong while saving this owner. Please try again.");

        OwnerFormViewModel vm = new OwnerFormViewModel()
        {
            Owner = owner,
            Cities = _dbContext.Cities.ToList()
        };

        return View(vm);
    }
}
```
If the owner isn't valid, the action returns the form again, with the user's values still in it, without ever trying to save to the database.

Back when you first built this form, there was nothing to tell the user what went wrong when the database rejected an owner. `ModelState.AddModelError` fixes that: it adds an error of your own to `ModelState`. The empty string means the error isn't about any one property, it's about the whole form. You'll see where it shows up in a moment.

## Displaying the errors
`ModelState` comes back to the view along with the form, so the view can display its errors. Open `Views/Owners/Create.cshtml` and add a validation message `<span>` under each input, like this one under the name input:
> Views/Owners/Create.cshtml
```html+razor
<div class="mb-3">
    <label asp-for="Owner.Name" class="form-label"></label>
    <input asp-for="Owner.Name" class="form-control" />
    <span asp-validation-for="Owner.Name" class="text-danger"></span>
</div>
```
`asp-validation-for` works like `asp-for`: it connects the `<span>` to a property, and when the page is rendered, the `<span>` is filled in with that property's error message, if there is one. Add one for `Owner.Email`, `Owner.Phone`, `Owner.Address`, and `Owner.CityId` (under the `<select>`) as well.

Then add this right after the opening `<form>` tag:
```html+razor
<div asp-validation-summary="ModelOnly" class="text-danger"></div>
```
This is where errors that aren't about one property, like the one you added with `AddModelError`, are displayed. (`ModelOnly` means it only shows those errors. The errors for each property are already displayed under their inputs.)

Run the application, go to `/Owners/Create`, and submit the form without filling anything in. You should see an error message under each field. Then try an email address with no `@` in it, or a name that's more than 35 characters long.

## Validating in the browser
Every one of those errors took a round trip: the browser submitted the form, the server checked it, and the server sent back a whole new page with the errors in it. ASP.NET can also check the form _in the browser_ before it's ever submitted, using the same attributes.

View the page source of the form, and look at the input for the owner's name. It will look something like this:
```html
<input class="form-control" type="text" data-val="true" data-val-maxlength="The field Name must be a string or array type with a maximum length of &#x27;35&#x27;." data-val-maxlength-max="35" data-val-required="Hmmm... You should really add a name..." id="Owner_Name" name="Owner.Name" value="" />
```
`asp-for` has been writing your validation rules into the HTML all along, in the `data-val` attributes. All that's missing is some JavaScript to read them. The project template already includes that JavaScript, in `Views/Shared/_ValidationScriptsPartial.cshtml`.

Go into `Views/Shared/_Layout.cshtml`, and at the bottom where the JavaScript files are being added, include a reference to `_ValidationScriptsPartial` like this:
> Views/Shared/_Layout.cshtml
```html+razor
<script src="~/lib/jquery/dist/jquery.min.js"></script>
<script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<partial name="_ValidationScriptsPartial" />
<script src="~/js/site.js" asp-append-version="true"></script>
@await RenderSectionAsync("Scripts", required: false)
```
`<partial>` drops the contents of another view into this one. Now go to `/Owners/Create` and try to put invalid data in some of the input fields. The error messages show up as soon as you leave a field, without submitting the form.

> :bulb: Checking in the browser is a convenience for the user, not a replacement for checking on the server. Anyone can turn off JavaScript, or send a `POST` request with Yaak, and skip the browser's checks entirely. That's why your action still checks `ModelState.IsValid`.

## Friendlier labels
Have you been finding it annoying that the label for the city dropdown says "CityId"? The labels that `asp-for` generates come from the property names, but you can change them with another attribute. Update `CityId` in the `Owner` model:
> Owner.cs
```csharp
[Display(Name = "City")]
[Range(1, int.MaxValue, ErrorMessage = "Please choose a city")]
public int CityId { get; set; }
```
Run the application again. The label now says "City", and so does any error message that uses the property's name.

## Practice: Validating the edit form
Apply everything from this exercise to the edit form for owners:
1. Check `ModelState.IsValid` in the `POST` `Edit` action, and return the form with a view model if the owner isn't valid.
1. Add an error with `ModelState.AddModelError` in the `catch` block.
1. Add the validation summary and the validation message `<span>`s to `Edit.cshtml`.

Up Next: [Dogs](./deshawns-09-dogs.md)

## 🔍 Additional Materials
1. [Model validation in ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation)
1. [Partial views in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/mvc/views/partial)
