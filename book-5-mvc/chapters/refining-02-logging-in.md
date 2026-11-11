# Logging In
Right now, anyone can do anything in the app. Owners should only be able to request walks for their own dogs, and walkers should only be able to confirm their own walks. To make that possible, the app needs to know _who_ is using it (authentication) and _what_ they're allowed to do (authorization). You learned what those two words mean, and how cookies make them work, in [Bianca's Bike Shop](../../book-4-controllers/chapters/biancas-03-auth.md#definitions). In Bianca's, all of the code that logged users in was already written for you. This time, you'll write a simple version of it yourself.

> **IMPORTANT NOTE:** Creating a secure system for authentication and authorization is both incredibly important and very complex. Bianca's Bike Shop used ASP.NET's Identity framework to safely store and check passwords. In this project, we're going to skip the password step and implement a lite version of auth, where users only enter their email address to log in. Never do this in a real application!

## The login view model
The login form only needs to capture an email address. Add a `LoginViewModel.cs` file to the `ViewModels` folder:
> LoginViewModel.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace DeShawnsRazor.Models.ViewModels;

public class LoginViewModel
{
    [EmailAddress]
    public string Email { get; set; }
}
```

## The login actions
We'd like the URL for the login form to be `/Owners/Login`, so add these two actions to the `OwnersController` (once again, we need two: the first to `GET` the form, and the second to handle the `POST` when the form is submitted):
> OwnersController.cs
```csharp
// GET: Owners/Login
public IActionResult Login()
{
    return View();
}

// POST: Owners/Login
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Login(LoginViewModel viewModel)
{
    Owner? owner = _dbContext.Owners.SingleOrDefault(o => o.Email == viewModel.Email);

    if (owner == null)
    {
        ModelState.AddModelError("", "There is no owner with that email address.");
        return View(viewModel);
    }

    List<Claim> claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, owner.Id.ToString()),
        new Claim(ClaimTypes.Email, owner.Email),
        new Claim(ClaimTypes.Role, "Owner"),
    };

    ClaimsIdentity claimsIdentity = new ClaimsIdentity(
        claims, CookieAuthenticationDefaults.AuthenticationScheme);

    await HttpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(claimsIdentity));

    return RedirectToAction("Details", new { id = owner.Id });
}

// GET: Owners/Logout
public async Task<IActionResult> Logout()
{
    await HttpContext.SignOutAsync();
    return RedirectToAction("Index", "Home");
}
```
Add these using directives to the top of the `OwnersController`:
```csharp
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
```

The `GET` action for `Login` should feel pretty familiar, but the `POST` action has some new code in it. It looks up an owner by their email address, and if it finds one, it saves some of the owner's data into a cookie. The way this works is that when a user successfully logs in, the server creates something that's almost like a driver's license. The server fills in that license with whatever information it chooses. Each piece of information is a _claim_, and in this case our code is choosing to add the owner's `Id`, email address, and role. `SignInAsync` then puts the license in a cookie, and sends it back to the browser. After logging in, every time the owner makes a request to the server, the browser will automatically send that cookie along with it, and ASP.NET will read it to know who is making the request.

Two other small things are new here:
1. `RedirectToAction("Details", new { id = owner.Id })` redirects to the owner's details page. The second argument fills in the route's `id`, the same job `asp-route-id` does in a view.
1. `RedirectToAction("Index", "Home")` in `Logout` redirects to an action in a _different_ controller, so it names the controller as well.

## Telling ASP.NET to use cookies
We have to let ASP.NET know that we plan on using cookies for authentication. Add this using directive to the top of `Program.cs`:
```csharp
using Microsoft.AspNetCore.Authentication.Cookies;
```
Then add this right above `var app = builder.Build();`:
```csharp
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => options.LoginPath = "/Owners/Login");
```
Finally, find the `app.UseAuthorization();` line that's already there, and add `app.UseAuthentication();` right above it:
```csharp
app.UseAuthentication();
app.UseAuthorization();
```
The order matters: ASP.NET has to figure out _who_ is making a request (authentication) before it can decide _what_ they're allowed to do (authorization).

## The login form
Add a `Login.cshtml` file to the `Views/Owners` folder:
> Views/Owners/Login.cshtml
```html+razor
@model DeShawnsRazor.Models.ViewModels.LoginViewModel

@{
    ViewData["Title"] = "Log In";
}

<h1>Log In</h1>

<div class="row">
    <div class="col-md-4">
        <form asp-action="Login">
            <div asp-validation-summary="ModelOnly" class="text-danger"></div>
            <div class="mb-3">
                <label asp-for="Email" class="form-label"></label>
                <input asp-for="Email" class="form-control" />
                <span asp-validation-for="Email" class="text-danger"></span>
            </div>
            <input type="submit" value="Log In" class="btn btn-primary" />
        </form>
    </div>
</div>
```
Run the app, go to `/Owners/Login`, and log in with an owner's email address from the seed data, like `john@gmail.com`. You should land on John's profile page. You can confirm it worked by finding the cookie in your browser's dev tools (in Chrome, it's under **Application**, then **Cookies**).

## Getting the current user
After a user logs in, every controller can see the claims from their cookie in its `User` property, just like the controllers in Bianca's. Getting the `Id` of the current user is something you'll need to do many times, so add this private helper method to the bottom of the `OwnersController`:
> OwnersController.cs
```csharp
private int GetCurrentUserId()
{
    string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
    return int.Parse(id!);
}
```
`id` is nullable because there won't be a claim if no one is logged in. The `!` after `id` tells the compiler that we know it won't be `null` here. That's only true because of the next step.

Now use it to give a logged-in owner a quick way to get to their own profile. Add this action to the `OwnersController`:
> OwnersController.cs
```csharp
// GET: Owners/Profile
[Authorize]
public IActionResult Profile()
{
    return RedirectToAction("Details", new { id = GetCurrentUserId() });
}
```
`[Authorize]` works just like it did in Bianca's, with one difference. In a web API, a request without a cookie gets a `401` response. In an MVC app, it gets _redirected_ to the `LoginPath` you set in `Program.cs`, which is much friendlier for someone using a browser. (`Authorize` needs `using Microsoft.AspNetCore.Authorization;` at the top of the controller.)

Log out by going to `/Owners/Logout`, then go to `/Owners/Profile`. You should be redirected to the login page. Log in, and go to `/Owners/Profile` again to land on your profile.

## Customizing the navbar
The navbar should change depending on whether someone is logged in:
- If someone comes to the app and they are not logged in, they should see a link to log in.
- If an owner is logged in, they should see a link to their profile, and a link to log out that shows their email address.

Add this right after the `<li>` for the Dogs link in `_Layout.cshtml`:
> Views/Shared/_Layout.cshtml
```html+razor
@if (User.Identity?.IsAuthenticated == true)
{
    @if (User.IsInRole("Owner"))
    {
        <li class="nav-item">
            <a class="nav-link text-dark" asp-area="" asp-controller="Owners" asp-action="Profile">My Profile</a>
        </li>
    }
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="" asp-controller="Owners" asp-action="Logout">
            Logout @User.FindFirstValue(ClaimTypes.Email)
        </a>
    </li>
}
else
{
    <li class="nav-item">
        <a class="nav-link text-dark" asp-area="" asp-controller="Owners" asp-action="Login">Login</a>
    </li>
}
```
Views can see the current user's claims through `User` too. `User.IsInRole("Owner")` checks the role claim you added when the owner logged in, so walkers won't see the "My Profile" link once they can log in. You'll need to add a `using` directive at the top of `_Layout.cshtml` for it to know about the `ClaimTypes` class:
```html+razor
@using System.Security.Claims
```

## 🔍 Additional Materials
1. [Use cookie authentication without ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie)
