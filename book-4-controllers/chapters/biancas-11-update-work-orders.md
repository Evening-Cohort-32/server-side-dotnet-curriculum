# Assign and Complete Work Orders
In this chapter we will add to the `WorkOrderList` component to allow users to assign work orders to mechanics or mark the work order as complete. 

## Update `WorkOrderList`
The `Actions` column is currently empty in the table of work orders. The `Mechanic` column just displays a mechanic if there is one. First, update the `reactstrap` import at the top of the file to include `Button` and `Input`:
> WorkOrderList.jsx
``` javascript
import { Button, Input, Table } from "reactstrap";
```
Then replace those `td` elements with these:
``` javascript
<td>
<Input
    type="select"
    onChange={(e) => {
    assignMechanic(wo, parseInt(e.target.value));
    }}
    value={wo.mechanicUserProfileId || 0}
>
    <option value="0">Choose mechanic</option>
    {mechanics.map((m) => (
    <option
        key={m.id}
        value={m.id}
    >{`${m.firstName} ${m.lastName}`}</option>
    ))}
</Input>
</td>
<td>
{wo.mechanicUserProfile && (
    <Button
    onClick={() => completeWorkOrder(wo.id)}
    color="success"
    >
    Mark as Complete
    </Button>
)}
</td>
```
Add the following functions to the component:
``` javascript
const assignMechanic = (workOrder, mechanicId) => {
    console.log(`Assigned ${mechanicId} to ${workOrder.id}`);
  };

  const completeWorkOrder = (workOrderId) => {
    console.log(`Completed ${workOrderId}`);
  };
```

### Getting mechanics
The `WorkOrderList` needs to get all of the employees so that `mechanics` above will have a value. The `UserProfileController` already has a `Get` endpoint that returns every user profile, but back in the Auth chapter you saw that it's protected with `[Authorize(Roles = "Admin")]`, because it's meant for managing employees. Any employee should be able to assign a mechanic to a work order, not only admins, so the list of mechanics needs its own endpoint that only requires a logged-in user.

Add this endpoint to the `UserProfileController`:
>UserProfileController.cs
``` csharp
[HttpGet("mechanics")]
[Authorize]
public IActionResult GetMechanics()
{
    return Ok(_dbContext.UserProfiles.ToList());
}
```
- The route for this endpoint will be `/api/userprofile/mechanics`.
- Both endpoints return user profiles, but they have different `Authorize` attributes because they serve different users. It's common for an API to expose the same resource in more than one way like this.

Add a `userProfileManager.js` file to the `managers` folder with a function that we'll use in the `WorkOrderList` component to get all of the mechanics:
>userProfileManager.js
``` javascript
const _apiUrl = "/api/userprofile";

export const getMechanics = () => {
  return fetch(_apiUrl + "/mechanics").then((res) => res.json());
};
```
Import `getMechanics` at the top of `WorkOrderList.jsx`, then add a `mechanics` state variable and fetch them in the `useEffect`:
>WorkOrderList.jsx
``` javascript
import { getMechanics } from "../../managers/userProfileManager";
```
``` javascript
const [mechanics, setMechanics] = useState([]);

useEffect(() => {
    getIncompleteWorkOrders().then(setWorkOrders);
    getMechanics().then(setMechanics);
}, []);
```
Use the console to test that the interface for choosing a mechanic works correctly. Log in as an employee who isn't an admin to confirm that the dropdown still has mechanics in it (you might have to register a new user first). 

## Create the Endpoint
Add this endpoint to the `WorkOrderController`:
>WorkOrderController.cs
``` csharp
[HttpPut("{id}")]
[Authorize]
public IActionResult UpdateWorkOrder(WorkOrder workOrder, int id)
{
    WorkOrder workOrderToUpdate = _dbContext.WorkOrders.SingleOrDefault(wo => wo.Id == id);
    if (workOrderToUpdate == null)
    {
        return NotFound();
    }
    else if (id != workOrder.Id)
    {
        return BadRequest();
    }

    //These are the only properties that we want to make editable
    workOrderToUpdate.Description = workOrder.Description;
    workOrderToUpdate.MechanicUserProfileId = workOrder.MechanicUserProfileId;
    workOrderToUpdate.BikeId = workOrder.BikeId;

    _dbContext.SaveChanges();

    return NoContent();
}
```
- There isn't really anything new here. 

## Access the Endpoint in the Client

Add the following to `workOrderManager`:
``` javascript
export const updateWorkOrder = (workOrder) => {
  return fetch(`${_apiUrl}/${workOrder.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workOrder),
  });
};
```
Finally, update the component to use the above function. Add `updateWorkOrder` to the existing `workOrderManager` import at the top of the file:
> WorkOrderList.jsx
``` javascript
import { getIncompleteWorkOrders, updateWorkOrder } from "../../managers/workOrderManager";
```
``` javascript
const assignMechanic = (workOrder, mechanicId) => {
    const clone = structuredClone(workOrder);
    clone.mechanicUserProfileId = mechanicId || null;
    updateWorkOrder(clone).then(() => {
      getIncompleteWorkOrders().then(setWorkOrders);
    });
};
```

Test the endpoint to make sure it works!

## Complete Work Order
See if you can update the app to make the `Mark As Complete` button work without code examples. You will need to:
1. Create an endpoint that handles a request to complete a work order
1. Create a function in the `workOrderManager` to access this API endpoint. Give it a different name than `completeWorkOrder` (for example, `markWorkOrderComplete`), since the component already has a function with that name and the two would clash when you import it.
1. Update the `completeWorkOrder` function in the `WorkOrderList` component to use the data access function from `workOrderManager`. 

Completing a work order might mean a bike is no longer in the garage, but the "Bikes in Garage" count in the navbar won't change right away. The `NavBar` only gets the count when a user logs in, so refresh the page to see the updated number. That's expected, not a bug in your code.

## Delete Work Order
Add another (red) button to the `Actions` column that deletes an incomplete work order. See if you can get this feature working without instructions! You will need to use the `HttpDelete` attribute on a new endpoint that is meant to handle requests with HTTP `DELETE` methods. As with completing a work order, give the component's handler and the `workOrderManager` function different names (for example, a `deleteWorkOrder` handler in the component that calls a `removeWorkOrder` function from the manager), so they don't clash when you import the manager function.

Up Next: [Managing Employees](./biancas-12-employee-roles.md)