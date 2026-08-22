# Practice: DateTime

Short, standalone drills for `DateTime` syntax. Each one only needs a `Program.cs` you can throw away when you're done - no project setup required. Pick whichever ones match what you're rusty on; you don't need to do them in order.

← Back to [DateTime](./resource-07-foundations-datetime.md)

1. Create a `DateTime` for your own birthday using the `new DateTime(year, month, day)` constructor, and print which day of the week it fell on using `.DayOfWeek`.

1. Print `DateTime.Now`, then print what it looks like 30 days from now using `.AddDays()`, and 3 hours from now using `.AddHours()`.

1. Given `DateTime start = new DateTime(2025, 1, 1);` and `DateTime end = new DateTime(2025, 12, 31);`, print the number of days between them using subtraction and `.TotalDays`.

1. Given two `DateTime` values of your choosing, use `<`, `>`, and `==` to print which one comes first.

1. Print `DateTime.Now` formatted three different ways: short date (`:d`), long date (`:D`), and a custom format of your own choosing (e.g. `:yyyy-MM-dd`).
