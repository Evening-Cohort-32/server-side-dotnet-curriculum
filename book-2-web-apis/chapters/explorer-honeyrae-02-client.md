# Building Out the Honey Rae's Client
Your client should already be up and running and displaying a list of service tickets, connected to your API through the proxy from the last chapter. In this chapter, we'll build out the rest of the app.

### Implement seeing a service ticket's details
There is already a component to view a service ticket's details. Create the correct function in the `serviceTicketData` module to get one ticket from the API, and use it in a `useEffect` in the details component. 

The `Employee` row in that component's table is already scaffolded for a single `ticket.employee`, but the API now sends back an `employees` array, since a ticket can have any number of employees assigned to it. Update that row to display every assigned employee's name (a comma-separated list works fine), or "Unassigned" if the array is empty.

### Details and List views for customers and employees
Implement the same views for customers and employees

### Creating a service ticket (Challenge)
There is an empty component for a form to create a service ticket. Create the form and the proper function in the `serviceTicketData` module to send service ticket data to the API to create a new ticket. Remember that you will need to get all of the customers to list them for the user to choose, so you have a `customerId` for the new ticket. A new ticket isn't assigned to anyone yet, that happens later, in the assigning employees challenge below.

### Delete button
Add a delete button to the service tickets list rows to remove a service ticket. After the ticket is deleted, _dynamically_ update the array of service tickets _without refreshing the page_. 

### Complete a ticket
Add a button next to the delete button to mark a request as complete, and correctly update the API database with the right HTTP request when it is clicked. The Complete button should only appear when the request is 1. assigned and 2. not complete. 

### Assigning employees (challenge)
1. Add an `Assign` button to the service ticket details that routes the user to a new component.
1. In that component, get the full list of employees, and render a checkbox for each one, checked if that employee is already in the ticket's `employees` array.
1. On submit, build the list of employees the user checked, and send the whole ticket, including that list, in a `PUT` request to update it. Remember the API expects the entire ticket object, not just the employees, so you'll need the rest of the ticket's data too. After submission, the app should navigate back to the details for that ticket.
1. The assign button should appear in the "Employees" row instead of "Unassigned" when there's already at least one employee assigned, otherwise display the assigned employees' names.

