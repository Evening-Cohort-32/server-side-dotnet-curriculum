# DateTime

A quick syntax reference for working with dates and times using the `DateTime` struct.

## Create

```csharp
DateTime now = DateTime.Now;                       // current date and time, local time zone
DateTime utcNow = DateTime.UtcNow;                  // current date and time, UTC - prefer this for anything stored/shared across time zones
DateTime today = DateTime.Today;                    // current date, time set to 00:00:00
DateTime specificDate = new DateTime(2025, 5, 1, 14, 30, 0);  // year, month, day, hour, minute, second
DateTime dateOnly = new DateTime(2025, 5, 1);        // time defaults to 00:00:00

DateTime parsedDate = DateTime.Parse("2025-05-01 14:30:00");   // throws if invalid
if (DateTime.TryParse(input, out DateTime result)) { }         // returns bool instead

// modern .NET also has dedicated types for when you only need one half of a DateTime
DateOnly justADate = new DateOnly(2025, 5, 1);
TimeOnly justATime = new TimeOnly(14, 30, 0);
```

## Access Components

```csharp
now.Year; now.Month; now.Day;
now.Hour; now.Minute; now.Second;
now.DayOfWeek;                                 // e.g. Thursday
now.DayOfYear;                                 // 1-366

DateTime.IsLeapYear(now.Year);                 // true/false
DateTime.DaysInMonth(now.Year, now.Month);     // int
```

## Add and Subtract Time

```csharp
now.AddDays(7);
now.AddHours(3);
now.AddMinutes(30);
now.AddMonths(1);
now.AddYears(1);
now.AddDays(-7);   // negative value subtracts
```

## Difference Between Two Dates

Subtracting two `DateTime`s gives you a `TimeSpan` - a duration, not a point in time:

```csharp
TimeSpan difference = endDate - startDate;
double daysDifference = difference.TotalDays;
double hoursDifference = difference.TotalHours;

// TimeSpan can also be created directly, e.g. to add/subtract a duration
DateTime ninetyDaysAgo = DateTime.Now - TimeSpan.FromDays(90);
```

## Compare

```csharp
date1 < date2;
date1 > date2;
date1 == date2;
date1 < DateTime.Now;   // is date1 in the past?
```

## Format

```csharp
Console.WriteLine($"{now:d}");    // 5/1/2025          - short date
Console.WriteLine($"{now:D}");    // Thursday, May 1, 2025 - long date
Console.WriteLine($"{now:t}");    // 2:30 PM           - short time
Console.WriteLine($"{now:T}");    // 2:30:45 PM        - long time
Console.WriteLine($"{now:f}");    // Thursday, May 1, 2025 2:30 PM     - full date/time, short time
Console.WriteLine($"{now:g}");    // 5/1/2025 2:30 PM                  - general date/time, short time

// custom format
Console.WriteLine($"{now:yyyy-MM-dd HH:mm:ss}");   // 2025-05-01 14:30:45
```

| Specifier | Meaning | Example |
|-----------|---------|---------|
| `yyyy` | four-digit year | 2025 |
| `MM` | two-digit month | 05 |
| `MMMM` | full month name | May |
| `dd` | two-digit day | 01 |
| `dddd` | full day name | Thursday |
| `HH` | two-digit hour (24-hour) | 14 |
| `hh` | two-digit hour (12-hour) | 02 |
| `mm` | two-digit minute | 30 |
| `ss` | two-digit second | 45 |
| `tt` | AM/PM designator | PM |

## Practice

Want to try it? → [Practice: DateTime](./resource-07-foundations-datetime-practice.md)
