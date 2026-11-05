# Data Validation with Data Annotations
Right now, nothing stops a client from submitting a work order with an empty description, or one that's thousands of characters long. In this chapter you'll see how Data Annotations can validate incoming data before it ever reaches the database, and how the API communicates what went wrong back to the client.

## Using the `DataAnnotations` namespace
The attributes in this chapter come from `System.ComponentModel.DataAnnotations`. You've already used one member of this namespace, `[Required]`, to control which columns are `NOT NULL` in the database. This chapter covers a different job for the same namespace: validating data that's submitted to an endpoint.

## Restricting the Length of a Work Order's Description
Take a look at the `Description` property on `WorkOrder`:
> WorkOrder.cs
``` csharp
[MaxLength(100)]
public string Description { get; set; }
```
The `[MaxLength(100)]` attribute limits `Description` to 100 characters. Because `WorkOrderController` inherits from `ControllerBase` and is decorated with `[ApiController]`, the framework automatically checks every incoming request body against the data annotations on the type it's binding to, before your controller method even runs. If a `POST` or `PUT` request to `/api/workorder` includes a description longer than 100 characters, the framework returns a `400 Bad Request` on its own. Your `CreateWorkOrder` method never executes.

Try it out: comment out the `Authorize` attribute on `CreateWorkOrder` so that you can test it in Yaak without logging in, then use Yaak to submit a work order with a description over 100 characters, and confirm you get a `400` response (remember to uncomment `Authorize` after testing).

## Giving the User Feedback
If you look at the body of that failed request in Yaak, you'll see the API already sends back meaningful feedback:
``` json
{
  "errors": {
    "Description": [
      "The field Description must be a string or array type with a maximum length of '100'."
    ]
  }
}
```
That message isn't very useful to an end user, so let's provide a better one:
``` csharp
[MaxLength(100, ErrorMessage = "Work order descriptions must be 100 characters or less")]
public string Description { get; set; }
```

### Displaying Errors in the Client
Now that the message is more useful, update `CreateWorkOrder` to check for it:
1. Add a state variable called `errors` to the `CreateWorkOrder` component, with an empty object as its initial value:
    ``` javascript
    const [errors, setErrors] = useState({});
    ```
1. Update `handleSubmit` to check for an `errors` property on the response, and set the state variable if it's there:
    ``` javascript
    const handleSubmit = (e) => {
        e.preventDefault();
        const newWorkOrder = {
        bikeId,
        description,
        };

        createWorkOrder(newWorkOrder).then((res) => {
        if (res.errors) {
            setErrors(res.errors);
        } else {
            navigate("/workorders");
        }
        });
    };
    ```
1. Add UI to display the errors when they're set:
    ```jsx
    <div style={{ color: "red" }}>
        {Object.keys(errors).map((key) => (
            <p key={key}>
            {key}: {errors[key].join(",")}
            </p>
        ))}
    </div>
    ```
1. Test the form again with a description that's too long to confirm the error message shows up.

## Requiring a Description
`[MaxLength]` stops a description that's too long, but nothing stops one that's empty yet. Submit the form with no description and you'll see the work order save without one.

This is where `[Required]` does both of its jobs at once. Add it to `Description`:
> WorkOrder.cs
``` csharp
[Required(ErrorMessage = "Please describe the problem with the bike")]
[MaxLength(100, ErrorMessage = "Work order descriptions must be 100 characters or less")]
public string Description { get; set; }
```
1. As a validation rule, `[Required]` causes the framework to return a `400` for a request with a missing or empty description, the same way `[MaxLength]` does for one that's too long.
1. As a database rule, `[Required]` makes the `Description` column `NOT NULL`, the same job you've already used it for.

Because that second job changes the database schema, you need a new migration. Stop the app, then run:
```
dotnet ef migrations add RequireWorkOrderDescription
dotnet ef database update
```
If you open the new migration file, you'll see an `UpdateData` call for the seeded admin user's `PasswordHash` alongside the `Description` change. That's expected: the hash is generated from your `AdminPassword` secret with a random salt every time the project builds, so it will show up in every migration you create. It's harmless.

Start the app again and submit the form with an empty description to confirm the new error message shows up.

## Requiring a Bike
There's another problem with the form: if you submit it without choosing a bike, the client sends a `bikeId` of `0`. There is no bike with an `Id` of `0`, so the database rejects the new row because of the foreign key constraint, and the API responds with a `500` error instead of a helpful message.

The `[Range]` attribute fixes this by setting a minimum and maximum value for a number. Because every real bike has an `Id` of at least `1`, add it to the `BikeId` property on `WorkOrder`:
> WorkOrder.cs
``` csharp
[Range(1, int.MaxValue, ErrorMessage = "Please choose a bike")]
public int BikeId { get; set; }
```
`int.MaxValue` is the largest value an `int` can hold, so the only thing this rule really restricts is the minimum. Now a `bikeId` of `0` gets the same automatic `400` response as a description that's too long, before your `CreateWorkOrder` method runs. Submit the form without choosing a bike to confirm that the new error message shows up under the form.

## Practice: Validating Registration
`RegistrationDTO` doesn't have any data annotations yet, which means a user can currently register with an empty username or an email address that isn't actually an email address. Using what you just learned:
1. Add the `[EmailAddress]` attribute to `RegistrationDTO.Email` to make sure a registering user submits a real email address.
1. Add `[Required]` and `[MaxLength(50)]` to `RegistrationDTO.UserName`.
1. The `register` function in `authManager.js` currently ignores the API's response and always asks for the logged-in user next, so the errors never reach the component. Update it to return the response body when the API responds with a `400`:
    > authManager.js
    ``` javascript
    export const register = (userProfile) => {
      userProfile.password = btoa(userProfile.password);
      return fetch(_apiUrl + "/register", {
        credentials: "same-origin",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      }).then((res) => {
        if (res.status === 400) {
          return res.json();
        }
        return tryGetLoggedInUser();
      });
    };
    ```
1. Update the `Register` component to display validation errors the same way `CreateWorkOrder` does now. Check for an `errors` property on what `register` returns _before_ treating it as a logged-in user.

Up Next: [Assigning and Completing Work Orders](./biancas-11-update-work-orders.md)

## 🔍 Additional Materials
1. [Available Data Annotations](https://learn.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations?view=net-10.0)
