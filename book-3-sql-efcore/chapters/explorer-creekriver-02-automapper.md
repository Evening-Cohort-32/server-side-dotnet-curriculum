# :tent: Mapping to DTOs with AutoMapper
In this exercise you will use a package called AutoMapper to replace the DTO-mapping code you've been writing by hand.

## Why use AutoMapper?
Go back and look at the `/api/reservations` endpoint from a few exercises ago. Getting a list of reservations with their related `UserProfile`, `Campsite`, and `CampsiteType` data took the better part of thirty lines, and almost none of it was actual logic, it was mostly just copying one property to another, over and over, for every DTO in the project. What do we do when we have tedious, repetitive code like that? Make it DRYer. How do we do that? We write reusable code that can be used everywhere we need to create a DTO instead of writing the mapping by hand every time.

What would this reusable code need to do? It would need to take an object of one type and convert it to another type. If we have an instance of `Campsite`, we want to turn its data into a `CampsiteDTO`. If we have an instance of `Reservation`, we want to turn it into a `ReservationDTO`. Aside from the fact that `Campsite` and `Reservation` have different properties, the process is exactly the same, you know this, because you've written this exact kind of code several times already.

What if we had code that could be told which classes map to which other classes? What if it had a method that would take an object of one type as input, along with a target type, and return a new object of the target type with the data copied over from the input object?

Here is some pseudo-code of the above to help you understand the goal (this is not compilable C# code):
``` csharp
public targetType Map<targetType, inputType>(inputType inputObject)
{
    // create a new instance of the target type
    targetType newObject = new targetType();
    // get the input object's properties
    var properties = GetObjectProperties(inputObj);
    // set each of the new object's properties with the values from the input object
    for (var property of properties)
    {
        newObject.SetProperty(property.Name, property.Value);
    } 
    //return the new object with all of the property values from the old object
    return newObject;
}
```

Here's an example of our theoretical `Map` method in use:
``` csharp
CampsiteDTO campsite = Map<CampsiteDTO, Campsite>(inputCampsiteObject);
```

We could implement code to do this on our own. But someone else already did, when they wrote `AutoMapper`! The rest of this exercise is a demo on implementing AutoMapper in Creek River Campground.

## Setup
1. Install AutoMapper (run this command in the same directory as the `csproj` file for Creek River Campground):
    ``` bash
    dotnet add package AutoMapper
    ```
1. Create an `AutoMapperProfiles.cs` file in the main project directory, and add the following code:

   - This class tells AutoMapper which classes correspond to which other classes. If the property names match for the classes in question, this is all the configuration you need! It should be noted that you can configure these mappings more specifically.

    ```csharp
    using AutoMapper;
    using CreekRiver.Models;

    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Campsite, CampsiteDTO>();
            CreateMap<CampsiteDTO, Campsite>();
            CreateMap<CampsiteType, CampsiteTypeDTO>();
            CreateMap<CampsiteTypeDTO, CampsiteType>();
            CreateMap<UserProfile, UserProfileDTO>();
            CreateMap<UserProfileDTO, UserProfile>();
            CreateMap<Reservation, ReservationDTO>();
            CreateMap<ReservationDTO, Reservation>();
        }
    }
    ```
1. Register AutoMapper using _dependency injection_ in `Program.cs`:

    ```csharp
    using AutoMapper;

    // Configure AutoMapper
    builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));
    ```

1. Inject the mapper into the minimal API endpoints, and use AutoMapper's QueryableExtensions to map from the model to the DTO.
    * The `AutoMapper.QueryableExtensions` library gives us access to the `ProjectTo<T>` extension method, so that we can map an object to the target type `T` as part of our Linq query.
    ``` csharp
    using AutoMapper.QueryableExtensions;

    app.MapGet("/api/campsites", (CreekRiverDbContext db, IMapper mapper) =>
    {
        return db.Campsites.ProjectTo<CampsiteDTO>(mapper.ConfigurationProvider).ToList();
    });
    ```
1. Test this endpoint to make sure it still works, and returns the same shape of data it did before.

## Getting Reservations with Related Data
Replace the `/api/reservations` endpoint with this:
``` csharp
app.MapGet("/api/reservations", (CreekRiverDbContext db, IMapper mapper) =>
{
    return db.Reservations
        .OrderBy(res => res.CheckinDate)
        .ProjectTo<ReservationDTO>(mapper.ConfigurationProvider)
        .ToList();
});
```
Test the endpoint out, and compare the response to what you got before. Notice that the reservation data still includes the `userProfile` and `campsite` (and its `campsiteType`!) data, even though this code doesn't call `Include` or `ThenInclude` anywhere. By default, `ProjectTo` will try to populate any properties present on the target class, in this case `ReservationDTO`, and it works out the `JOIN`s it needs to do that on its own. All of the code from a few exercises ago that built up `ReservationDTO`, `UserProfileDTO`, and `CampsiteDTO` instances by hand, property by property, is now three lines.

Try converting the rest of Creek River Campground's GET endpoints over to AutoMapper, including the single-campsite endpoint that uses `Single`. One thing to watch for: just like `ToList`, `Single` and `SingleOrDefault` need to come *after* `ProjectTo` in the method chain, because they return a single `CampsiteDTO` instance, which doesn't have a `ProjectTo` method of its own to call.

## 🔍 Additional Materials
1. [AutoMapper docs](https://docs.automapper.org/en/)
1. [Queryable Extensions](https://docs.automapper.org/en/stable/Queryable-Extensions.html)
