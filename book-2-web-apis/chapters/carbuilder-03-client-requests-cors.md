# Making Client Requests to the Car Builder API
In this chapter you will refactor the Car Builder client you built in the front end course to use the new .NET API, putting the CORS and `async`/`await` skills from Honey Rae's to work in a project that isn't set up with a proxy.

## Refactoring the client
> You will find it more difficult, but also much more satisfying and fun to update the client you built in the front end. However, if your cohort did not do this project, or you didn't get to it, you can use [this](https://github.com/nashville-software-school/car-builder) template to complete this part of the project. 

### Technologies
Currently, the function to get technologies in `database.js` looks something like this:
``` javascript
export const getTechnologies = () => {
    return [...database.technologies]
}
```
This function gets data from the database variable, copies it, and returns it. Let's refactor it to use the fetch API to make a request to the .NET API. You will have to add the port that your API is using for HTTPS. Make sure you use the port that is for the https url, _not_ for http (the https port will be in the 7000's, the http port will be in the 5000s if you're confused). It looks like this:
``` javascript
export const getTechnologies = async () => {
  const res = await fetch("https://localhost:<port>/technologies");
  const data = await res.json();
  return data;
};
```

>`await` can only be used inside functions marked `async` or at the top-level of a module, as we will see below.

Here is an example of what the `Technologies` component currently looks like:
``` javascript
const techs = getTechnologies()

export const Technologies = () => {
    return `<h2>Technologies</h2>
    <select id="tech">
        <option value="0">Select a technology package</option>
        ${
            techs.map(
                (tech) => {
                    return `<option value="${tech.id}">${tech.package}</option>`
                }
            ).join("")
        }
    </select>`
}
```

However, we are now getting technologies asynchronously over the network, so we need to `await` them as well (this `await` is ok because it is at the top level of the module):

```javascript
const techs = await getTechnologies();

export const Technologies = () => {

  return `<h2>Technologies</h2>
    <select id="tech">
        <option value="0">Select a technology package</option>
        ${techs
          .map((tech) => {
            return `<option value="${tech.id}">${tech.package}</option>`;
          })
          .join("")}
    </select>`;
};
```
We need to similarly update the `Order` component to `await` the request for technologies:
```javascript

const paints = getPaints()
const interiors = getInteriors()
const techs = await getTechnologies()
const wheels = getWheels()
export const Orders = () => {
    //omitted for brevity...
}
```

## Testing the API and client - CORS
We're ready to try the new version of getting technologies!

1. Start the API in debug mode
1. use `serve` to start the front end application
1. Open the front end app in your browser, and open your dev tools. 

Uh oh. You are probably seeing a blank browser window. Take a look at the console (you might have to refresh to see the error). You should see a familiar CORS error, the same Same-Origin Policy issue from Honey Rae's, except this time there's no proxy set up to hide it from us. This client and this API genuinely are two different origins, and unlike Honey Rae's client, there's no dev-server proxy standing between them, so we need the server-side fix instead.

In `Program.cs` of your API code, add the following line below `builder.Services.AddSwaggerGen();`
``` csharp
builder.Services.AddCors();
```
Update the code that starts with `app.Environment.IsDevelopment())` with this code block:
``` csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(options =>
                {
                    options.AllowAnyOrigin();
                    options.AllowAnyMethod();
                    options.AllowAnyHeader();
                });
}
```
Restart the API, and refresh the browser. You should now see Car Builder loading in the browser. Our API is now telling the browser that it is safe to request the data from any origin.  

## Refactoring the Other Components
1. Refactor the database functions for getting paints, interiors, and wheels to fetch from the API, and make them `async` so you can `await` the results of the fetch
1. Update the `Paints`, `Interiors`, `Wheels` and `Orders` components to `await` all of those functions that fetch from the API. 
1. Test the app to make sure all of the `select` elements are getting populated with the right data. 


Up Next: [Submitting an Order](./carbuilder-04-submit-order.md)
## 🔍  Extra Materials
1. [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
1. [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)