# Owners
In this exercise you'll build the owner pages on your own. Everything you need is something you just did for walkers, so use the [Walkers](./deshawns-04-walkers.md) exercise as a reference for the pattern, not a script to copy.

1. Create an `OwnersController` in the `Controllers` folder, with the `DeShawnsRazorDbContext` injected through its constructor, the same way as the [`WalkersController`](./deshawns-04-walkers.md#the-walkerscontroller).
1. Add an `Index` action and an `Index.cshtml` view that show a table of all the owners, with each owner's name, email, phone number, and city. Each row should have a link to that owner's details page. (See [Getting all walkers](./deshawns-04-walkers.md#getting-all-walkers).)
1. Add a `Details` action and a `Details.cshtml` view for a single owner, showing the owner's name, email, address, phone number, and city. Make sure that `/Owners/Details/999` returns a 404. (See [Getting a single walker](./deshawns-04-walkers.md#getting-a-single-walker).)
1. In `Views/Shared/_Layout.cshtml`, add an "Owners" link to the navigation bar, next to the "Walkers" link. (See [Adding walkers to the navigation bar](./deshawns-04-walkers.md#adding-walkers-to-the-navigation-bar).)
1. If you finish, try changing the views and the styling to your liking. The template already includes Bootstrap, so you can use any of its classes in your views.
1. **Challenge** (not required): When viewing the details page of an owner, list all of the dogs for that owner as well. You'll need to include the owner's `Dogs` in your query, the same way you included the walker's `City`.

Up Next: [Adding and Updating Data with Forms](./deshawns-06-forms.md)
