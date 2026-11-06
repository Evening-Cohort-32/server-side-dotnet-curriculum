# :broom: :soap: House Rules
House Rules is an app to manage household members and their chores. 

## Project Setup
This project does not include template code, so there is some additional setup required that was not covered in Bianca's Bikes. This is another opportunity to see how the apps in this book, using auth and controllers, are different from the apps that we built in books 1-3:

1. Create a new api project with controllers in your `workspace/csharp` directory with this command:
    ``` bash 
    dotnet new webapi --use-controllers -o HouseRules
    ```
    - `--use-controllers` matters: without it, `dotnet new webapi` creates a Minimal API project with no `Controllers` folder.
1. `cd` into the `HouseRules` and run:
    ``` bash 
    dotnet new gitignore
    ```
1. Delete `WeatherForecast.cs`, `Controllers/WeatherForecastController.cs`, and `HouseRules.http`. They're sample code from the template (`HouseRules.http` only has a request to `/weatherforecast`), and House Rules doesn't need them.
1. Open `HouseRules.csproj` and delete the `<Nullable>enable</Nullable>` line. Bianca's Bikes doesn't have this setting, and the code you'll copy from it isn't written for it. With it turned on, you'll get dozens of warnings, and `[ApiController]` will treat every non-nullable property on your models as required, so a request to create a chore would be rejected with a `400` saying that fields like `ChoreAssignments` are required.
1. Initialize a git repo:
    ``` bash
    git init
    ``` 
1. create a `client` directory inside the project
1. `cd` into that directory, and run `npm create vite@latest . -- --template react` (Don't forget the `.`). The current version of Vite needs Node 20.19 or newer. Run `node --version` first, and if your version is older, update Node before running this command.
1. Vite's starter styles set a dark background, center everything on the page, and restyle buttons, which will fight with Bootstrap. Delete all of the code in `src/index.css` and `src/App.css`, but keep the empty files, since the code you'll copy from Bianca's Bikes imports them.
1. In `Properties/launchSettings.json` in the .NET project folder, the template picked random port numbers for the API. Change them to `5001` for https and `5000` for http, in both the `https` and `http` profiles. The client's proxy settings below expect those ports. 
1. Replace all of the code in `vite.config.js` in the client folder with this:
    ``` js
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";

    export default defineConfig(() => {
    return {
        server: {
        open: true,
        proxy: {
            "/api": {
            target: "https://localhost:5001",
            changeOrigin: true,
            secure: false,
            },
        },
        },
        build: {
        outDir: "build",
        },
        plugins: [react()],
    };
    });
    ```
1. Install `react-router-dom`:
    ``` bash
    npm install --save react-router-dom
    ```
1. Install `bootstrap` and `reactstrap`:
    ``` bash
    npm install --save bootstrap reactstrap
    ```
1. Create `components` and `managers` folders in `src`
1. In the `managers` folder, create an `authManager` and copy all of the contents into it from the `authManager` in Bianca's Bikes. 
1. Copy the entire `auth` folder from Bianca's bikes into the `components` folder. 
1. In `src/main.jsx`, replace the `StrictMode` tags with `BrowserRouter` tags, and replace the `StrictMode` import with an import for `BrowserRouter`. When you're done, the file should look like this:
    ``` javascript
    import { createRoot } from "react-dom/client";
    import { BrowserRouter } from "react-router-dom";
    import "./index.css";
    import App from "./App.jsx";

    createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    ```
1. Replace the code in `App.jsx` with the code from Bianca's Bikes
1. Copy `ApplicationViews.jsx` from Bianca's Bikes to the House Rules `components` directory. Remove the `bikes`, `workorders`, and `employees` routes. The `index` route still renders `<Bikes />`, so replace it with a placeholder like `<p>Home</p>` for now (you'll build a real `Home` component in a later chapter), and delete the `Bikes` import at the top of the file. Delete the imports for any other Bianca's components you removed routes for, too. 
1. Create a `NavBar.jsx` component in the `components` directory with the following code:
    ``` javascript
    import { useState } from "react";
    import { NavLink as RRNavLink } from "react-router-dom";
    import {
    Button,
    Collapse,
    Nav,
    NavLink,
    NavItem,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    } from "reactstrap";
    import { logout } from "../managers/authManager";

    export default function NavBar({ loggedInUser, setLoggedInUser }) {
    const [open, setOpen] = useState(false);

    const toggleNavbar = () => setOpen(!open);

    return (
        <div>
        <Navbar color="light" light fixed="true" expand="lg">
            <NavbarBrand className="mr-auto" tag={RRNavLink} to="/">
            🧹🧼House Rules
            </NavbarBrand>
            {loggedInUser ? (
            <>
                <NavbarToggler onClick={toggleNavbar} />
                <Collapse isOpen={open} navbar>
                <Nav navbar></Nav>
                </Collapse>
                <Button
                color="primary"
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    logout().then(() => {
                    setLoggedInUser(null);
                    setOpen(false);
                    });
                }}
                >
                Logout
                </Button>
            </>
            ) : (
            <Nav navbar>
                <NavItem>
                <NavLink tag={RRNavLink} to="/login">
                    <Button color="primary">Login</Button>
                </NavLink>
                </NavItem>
            </Nav>
            )}
        </Navbar>
        </div>
    );
    }
    ```
1. In the `HouseRules` directory, install the required dependencies:
    ``` bash
    dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore -v 10.0.14

    dotnet add package Microsoft.EntityFrameworkCore.Design -v 10.0.14

    dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL -v 10.0.3

    dotnet add package Swashbuckle.AspNetCore -v 10.2.3
    ```
    - Bianca's `Program.cs`, which you'll copy next, uses Swashbuckle (`AddSwaggerGen`, `UseSwagger`, and `UseSwaggerUI`). The .NET 10 template doesn't include it, the same as when you set up Honey Rae's, so it needs to be added here.
    - Optional: the template also added `Microsoft.AspNetCore.OpenApi`, which Bianca's `Program.cs` doesn't use. You can remove it with `dotnet remove package Microsoft.AspNetCore.OpenApi`.
1. Copy the contents of `Program.cs` from Bianca's Bikes into the House Rules `Program.cs`. Replace `BiancasBikes` with `HouseRules` everywhere it appears in the app (HINT: there are ways to use your code editor to do this to make sure you don't miss any).
1. Create a `Data` folder. Add a file called `HouseRulesDbContext.cs`. Copy the content from `BiancasBikesDbContext.cs`. Change all references to `BiancasBikes` to `HouseRules`. Remove all of the `DbSet` properties _except for UserProfiles_. In the `OnModelCreating` method, remove all of data seeding for owners, bikes, bike types, and work orders. 
1. Create a `Models` folder, and put a `UserProfile.cs` file in it. Copy the content from Bianca's Bikes' `UserProfile` class. Update the `namespace` to be `HouseRules.Models`. Inside the `Models` folder, create a `DTOs` folder and copy `RegistrationDTO.cs` and `UserProfileDTO.cs` over from Bianca's Bikes as well, updating their `namespace` to be `HouseRules.Models.DTOs`. Delete the `List<WorkOrder> WorkOrders` property from `UserProfileDTO`, since House Rules doesn't have work orders.
1. Add a controller to the Controllers folder called `AuthController.cs`. Copy the corresponding code from Bianca's Bikes into this file. Change all references to `BiancasBikes` to `HouseRules`. 
1. Initialize user secrets for this project
1. Save the connection string for a database called `HouseRules` to the user secret `HouseRulesDbConnectionString`.
1. Save the password (you can choose it) for the admin user of the app to the `AdminPassword` user secret. 

Up Next: [House Rules Data Model](./houserules-02-data-model.md)