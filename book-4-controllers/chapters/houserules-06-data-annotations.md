# Data Validation with Data Annotations
You've already seen how Data Annotations validate incoming data in [Bianca's Bikes](./biancas-10-validation.md) — `[MaxLength]` on a property, the automatic `400` response from `[ApiController]`, and displaying the `errors` from that response in the client. This chapter is practice applying that same pattern to House Rules. If any of it feels unfamiliar, go back and reread that chapter first.

## Instructions
1. Restrict `Chore.Name` (and `ChoreDTO.Name`, if you have one) to a maximum length of 100 characters, with a custom `ErrorMessage`.
1. Restrict `Chore.Difficulty` to a range of 1-5 using the `[Range]` attribute.
1. `[MaxLength]` on `Chore.Name` changes the database column too (it becomes a `varchar(100)`), so stop the app and create a new migration, then update the database, the same way you did when you added `[Required]` to `WorkOrder.Description` in Bianca's Bikes.
    - The migration will print `An operation was scaffolded that may result in the loss of data.` That's expected. EF Core is warning you that any existing name longer than 100 characters wouldn't fit in the new column. As long as your seeded chore names are shorter than that, nothing is lost.
1. Update the `CreateChore` component to display validation errors, the same way you saw in Bianca's `CreateWorkOrder`.
    - Optional tip: if a user clears one of the number inputs, `parseInt` returns `NaN`, which is sent as `null`, and the error they'll see is a raw `The JSON value could not be converted to System.Int32` message instead of your `[Range]` message. Using `parseInt(e.target.value) || 0` sends `0` instead, so your `[Range]` message shows. (The box will show `0` as soon as it's cleared.)
1. Test both validators. Try adding chores with names that are too long, or difficulties outside the allowed range.

An example of what a failed request's response body looks like. This screenshot shows the default message for `Name`, so yours will show your custom `ErrorMessage` instead:

![Data Validation Response](../../assets/house-rules-data-validation.png)

## Practice
1. Enforce a minimum `ChoreFrequencyDays` of 1, and a maximum of 14.
    - bonus challenge: use the [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#offering_suggested_values) element to suggest 1, 3, 7, 10, and 14 as options (note that this will have no effect on the allowed values on the server side)
1. If you completed the practice at the end of Bianca's validation chapter, the `RegistrationDTO` and `Register` component you copied already validate `Email` and `UserName` and display the errors. (If you didn't, add `[EmailAddress]` to `Email` and `[Required]` and `[MaxLength(50)]` to `UserName` now.) Add `[Required]` to the remaining registration fields, `FirstName`, `LastName`, and `Address`, with custom error messages, and test that registering with any of them left empty shows an error.
1. You added `[Required]` to `Chore.Name` when you built the model, to make the column `NOT NULL`. Like `Description` in Bianca's Bikes, it's already doing its other job too, rejecting submissions with an empty name. Give it a custom `ErrorMessage` and test creating a chore with no name. You don't need `[Required]` on `Difficulty` or `ChoreFrequencyDays`: an `int` can't be null, so a missing value becomes `0`, and it's your `[Range]` attributes that reject it.

Up Next: [More features for House Rules](./houserules-07-more-features.md)
