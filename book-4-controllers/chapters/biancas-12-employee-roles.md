# Managing Employee Roles
Most applications that have users need to manage what those users can do. Some users need admin privileges, while others may not need access to see everything, let alone edit anything (read-only access). This chapter will demonstrate a strategy for managing and using a role-based access control (RBAC). 

## The `AuthorizedRoute` component
Most of the route elements in the application are going to be wrapped with the `AuthorizedRoute` component that has been created for this repository. The component accepts an array of role names as a prop, and will check if the logged-in user has any of those roles. if `all` is provided as another option, as in `<AuthorizedRoute roles={["Admin", "Employee"]} all>`, then the `AuthorizedRoute` will only allow access if _all_ of the listed roles are true of the logged-in user. If no roles are provided, the user must merely be logged in to view the route. 

The Employees menu item links to a route that requires admin privileges:
``` jsx
<Route
    path="employees"
    element={
    <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
        <p>Employees</p>
    </AuthorizedRoute>
    }
/>
```
Create a new component for this route called `UserProfileList` in a new `components` folder called `userprofiles`:
> components/userprofiles/UserProfileList.jsx
``` javascript
import { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { getUserProfilesWithRoles } from "../../managers/userProfileManager";

export default function UserProfileList({ loggedInUser }) {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    getUserProfilesWithRoles().then(setUserProfiles);
  }, []);

  const promote = (id) => {
    console.log(`${id} promoted!`);
  };
  const demote = (id) => {
    console.log(`${id} demoted!`);
  };

  return (
    <>
      <h2>User Profiles</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userProfiles.map((up) => (
            <tr key={up.id}>
              <th scope="row">{`${up.firstName} ${up.lastName}`}</th>
              <td>{up.address}</td>
              <td>{up.email}</td>
              <td>{up.userName}</td>
              <td>
                {up.roles.includes("Admin") ? (
                  <Button
                    color="danger"
                    onClick={() => {
                      demote(up.identityUserId);
                    }}
                  >
                    Demote
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onClick={() => {
                      promote(up.identityUserId);
                    }}
                  >
                    Promote
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
```

Make the component the element for the `Employees` menu item. Import it at the top of `ApplicationViews.jsx`, then update the route:
>ApplicationViews.jsx
``` jsx
import UserProfileList from "./userprofiles/UserProfileList";
```
``` jsx
 <Route
    path="employees"
    element={
    <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
        <UserProfileList />
    </AuthorizedRoute>
    }
/>
```

Add this function to the `userProfileManager`:
``` javascript
export const getUserProfilesWithRoles = () => {
  return fetch(_apiUrl + "/withroles").then((res) => res.json());
};
```

Add this endpoint to the `UserProfileController`:
``` csharp
[HttpGet("withroles")]
[Authorize(Roles = "Admin")]
public IActionResult GetWithRoles()
{
    return Ok(_dbContext.UserProfiles
    .Include(up => up.IdentityUser)
    .Select(up => new UserProfileDTO
    {
        Id = up.Id,
        FirstName = up.FirstName,
        LastName = up.LastName,
        Address = up.Address,
        Email = up.IdentityUser.Email,
        UserName = up.IdentityUser.UserName,
        IdentityUserId = up.IdentityUserId,
        Roles = _dbContext.UserRoles
        .Where(ur => ur.UserId == up.IdentityUserId)
        .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
        .ToList()
    }));
}
```
- This is a very inefficient way to do this query, but better solutions require a level of complexity that is not necessary right now. The query gets user profiles, then searches for user roles associated with the profile, and maps each of those to role names.
- Notice this projects into `UserProfileDTO`, not the `UserProfile` entity, same reason as `Me()` and `UserProfileController.Get()` back in the Auth chapter: `Email`, `UserName`, and `Roles` aren't columns on `UserProfile` itself.

The `promote` and `demote` functions currently only log to the console, but the component should be viewable now. Test it to see if admins have a demote button, and non-admins have a promote button (you might have to register a few more users). Use the console to check that the buttons work.

## Adding Promote and Demote Endpoints

`IdentityRole` and `IdentityUserRole` come from ASP.NET Core Identity, so add this `using` directive to the top of `UserProfileController.cs`:
``` csharp
using Microsoft.AspNetCore.Identity;
```
Then add the following endpoints to `UserProfileController`:
``` csharp
[HttpPost("promote/{id}")]
[Authorize(Roles = "Admin")]
public IActionResult Promote(string id)
{
    IdentityRole role = _dbContext.Roles.SingleOrDefault(r => r.Name == "Admin");
    if (_dbContext.UserRoles.Any(ur => ur.RoleId == role.Id && ur.UserId == id))
    {
        // The user is already an admin
        return BadRequest();
    }
    // This will create a new row in the many-to-many UserRoles table.
    _dbContext.UserRoles.Add(new IdentityUserRole<string>
    {
        RoleId = role.Id,
        UserId = id
    });
    _dbContext.SaveChanges();
    return NoContent();
}

[HttpPost("demote/{id}")]
[Authorize(Roles = "Admin")]
public IActionResult Demote(string id)
{
    IdentityRole role = _dbContext.Roles
        .SingleOrDefault(r => r.Name == "Admin"); 
    IdentityUserRole<string> userRole = _dbContext
        .UserRoles
        .SingleOrDefault(ur =>
            ur.RoleId == role.Id &&
            ur.UserId == id);

    if (userRole == null)
    {
        // The user isn't an admin, so there's nothing to remove
        return NotFound();
    }

    _dbContext.UserRoles.Remove(userRole);
    _dbContext.SaveChanges();
    return NoContent();
}
```
- Both endpoints check for the case where there's nothing to do, the same way `UpdateWorkOrder` checks for a work order that doesn't exist. Without these checks, promoting a user who is already an admin would try to add a duplicate row to `UserRoles`, and demoting a user who isn't an admin would try to remove `null`. Both would cause a `500` error. The UI hides the button that doesn't apply, but a double-click or an out-of-date page could still send one of these requests.

Add these functions to `userProfileManager`:
``` javascript
export const promoteUser = (userId) => {
  return fetch(`${_apiUrl}/promote/${userId}`, {
    method: "POST",
  });
};

export const demoteUser = (userId) => {
  return fetch(`${_apiUrl}/demote/${userId}`, {
    method: "POST",
  });
};
```
Finally, update the functions in `UserProfileList` to use the data access functions from `userProfileManager`. Add `promoteUser` and `demoteUser` to the existing `userProfileManager` import at the top of the file:
>UserProfileList.jsx
``` javascript
import { getUserProfilesWithRoles, promoteUser, demoteUser } from "../../managers/userProfileManager";
```
``` javascript
 const promote = (id) => {
    promoteUser(id).then(() => {
      getUserProfilesWithRoles().then(setUserProfiles);
    });
  };
  const demote = (id) => {
    demoteUser(id).then(() => {
      getUserProfilesWithRoles().then(setUserProfiles);
    });
  };
```
You should now be able to test the promote and demote functionality for users. Promotion and Demotion is only allowed by admins (because `Roles = "Admin"`) is passed into the `Authorize` attribute on the controller methods. The route should only even be visible to admins because of the `roles={["Admin"]}` prop passed to `AuthorizedRoute` for the route. 

Sign in as a non-admin to see that an attempt to navigate to `/employees` results in a redirect to the `Login` component. `Employees` should not appear on the navbar for non-admins. 

### When Role Changes Take Effect
Promoting or demoting a user changes the `UserRoles` table right away, but it doesn't change what that user can do right away. When a user logs in, the API copies their roles into the authentication cookie, and from then on `[Authorize(Roles = "Admin")]` checks the roles in the cookie, not the ones in the database. The client works the same way: `loggedInUser.roles` comes from the `/me` endpoint, which reads the cookie's claims too.

That means:
1. A user you promote won't see `Employees` in the navbar or have admin access until they log out and log back in.
1. A user you demote _keeps_ admin access until they log out, or until their cookie expires.

To test promotion, promote a user, then log in as that user. To test demotion, log in as a second admin in a private browser window, demote that admin from your main window, and notice that they can still reach `/employees` until they log out and back in.

This is a real tradeoff in role-based access control. Checking roles from the cookie means the API doesn't have to query the database on every request, but it also means role changes are delayed. Applications that need changes to take effect immediately (for example, to lock out a fired employee) have to add extra checks against the database, which is beyond the scope of this course.

The code in this chapter is complex, and you only are responsible for knowing how to use the `Authorize` attribute to protect an endpoint based on roles.

This is the end of Bianca's Bike Shop. Before moving on to House Rules or Shepherd's Pies, complete the exercise below on Interfaces, an unrelated concept that is still part of this book's required work.

Up Next: [Interfaces](https://github.com/nashville-software-school/bangazon-inc/blob/server-side-curriculum/book-1-orientation/chapters/INTERFACES_INTRO.md)
