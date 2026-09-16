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

Try it out: use Yaak to submit a work order with a description over 100 characters, and confirm you get a `400` response.

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
1. Add a state variable called `errors` to the `CreateWorkOrder` component.
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

## Practice: Validating Registration
`RegistrationDTO` doesn't have any data annotations yet, which means a user can currently register with an empty username or an email address that isn't actually an email address. Using what you just learned:
1. Add the `[EmailAddress]` attribute to `RegistrationDTO.Email` to make sure a registering user submits a real email address.
1. Add `[Required]` and `[MaxLength(50)]` to `RegistrationDTO.UserName`.
1. Update the `Register` component to display validation errors the same way `CreateWorkOrder` does now.

Up Next: [Assigning and Completing Work Orders](./biancas-11-update-work-orders.md)

## 🔍 Additional Materials
1. [Available Data Annotations](https://learn.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations?view=net-8.0)
