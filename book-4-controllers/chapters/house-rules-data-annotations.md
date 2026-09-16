# Data Validation with Data Annotations
You've already seen how Data Annotations validate incoming data in [Bianca's Bikes](./biancas-validation.md) — `[MaxLength]` on a property, the automatic `400` response from `[ApiController]`, and displaying the `errors` from that response in the client. This chapter is practice applying that same pattern to House Rules. If any of it feels unfamiliar, go back and reread that chapter first.

## Instructions
1. Restrict `Chore.Name` (and `ChoreDto.Name`, if you have one) to a maximum length of 100 characters, with a custom `ErrorMessage`.
1. Restrict `Chore.Difficulty` to a range of 1-5 using the `[Range]` attribute.
1. Update the `CreateChore` component to display validation errors, the same way you saw in Bianca's `CreateWorkOrder`.
1. Test both validators. Try adding chores with names that are too long, or difficulties outside the allowed range.

An example of what a failed request's response body looks like:

![Data Validation Response](../../assets/house-rules-data-validation.png)

## Practice
1. Enforce a minimum `ChoreFrequencyDays` of 1, and a maximum of 14.
    - bonus challenge: use the [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#offering_suggested_values) element to suggest 1, 3, 7, 10, and 14 as options (note that this will have no effect on the allowed values on the server side)
1. Use `[EmailAddress]` to validate that a registering user has input a valid email, and `[MaxLength]` to ensure the submitted username is less than 50 characters, the same as you did for `RegistrationDTO` in Bianca's Bikes.
1. You've already used `[Required]` to make nullable types `NOT NULL` in the database. Try adding it to properties on `Chore` and `RegistrationDto` to require them on submission as well, not just at the database level.

Up Next: [More features for House Rules](./house-rules-more-features.md)
