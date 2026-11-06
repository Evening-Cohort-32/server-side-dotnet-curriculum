# More Features for House Rules

## Updating a Chore
Add an edit form to the `ChoreDetails` component that updates the chore's name, difficulty, and frequency. Keep the assignment checkboxes from the previous chapter. After submitting the form, the handler should trigger a navigation back to the chores list view. 

## Highlighting Overdue Chores
Once a chore has not been completed for as many days as its `ChoreFrequencyDays` it is time to do the chore again! Update the application so that overdue chores' names are red in the `ChoresList` so that users will be aware that they need attending to. To complete this feature, you may find it useful to:
1. Create a calculated property that determines whether the most recent completion of a chore was completed more than the `ChoreFrequencyDays` ago. To do this you may find the `Max` Linq method useful, as well as using `Include` to get `ChoreCompletions` when retrieving chores. The `AddDays` method will also come in handy, along with `DateTime.Today`
    - Be careful: `Max` throws an exception when it's called on an empty list, and every newly created chore has no completions. If your calculated property doesn't handle that case, `GET /api/chore` will return a `500` as soon as a chore without completions exists. Decide what a chore that has never been completed should mean (it's reasonable to treat it as overdue), and check for it before calling `Max`.
    - Check for `null` too, not just an empty list: `ChoreCompletions == null || ChoreCompletions.Count == 0`. `ChoreCompletions` is `null` whenever it wasn't loaded with `Include`, and the property gets read in places you might not expect. When a `Chore` comes in from a request body, `[ApiController]`'s validation reads every property on it, including calculated ones, and that chore's lists are `null`. Without the `null` check, `POST` and `PUT` to `/api/chore` return a `500` before your controller method even runs, and so does `GET /api/userprofile/{id}` until you add the `ThenInclude` in the My Chores section below.
1. Use the calculated property in the ChoresList to conditionally render each chore name in the default color or in red. 

## My Chores
Create a page that is visible to all authenticated users that shows the user their assigned chores, allowing them to mark their chores as complete. If the chore does not currently need to be completed, do not display it. You will need to make use of the calculated property you made for the previous task. Add a "My Chores" link to the nav bar that every logged in user can see.

You can get the user's assigned chores from the `GET /api/userprofile/{id}` endpoint, but the calculated property only works if each chore's completions are loaded too. If they aren't, only the user's own completions will be loaded (from the `ChoreCompletions` you already included on the user profile), so a chore someone else completed will still look overdue, and nothing will tell you why. Extend the `Include` chain so the completions come along with each assigned chore:
``` csharp
.Include(up => up.ChoreAssignments)
    .ThenInclude(ca => ca.Chore)
        .ThenInclude(c => c.ChoreCompletions)
```

___
This is the end of the HouseRules project.
