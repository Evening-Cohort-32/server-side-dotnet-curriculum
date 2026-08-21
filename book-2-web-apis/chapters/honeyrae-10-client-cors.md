# Adding a Client to Honey Rae's API
In this chapter we will connect a front-end client to `HoneyRaesAPI`, and use that connection to learn about CORS, a browser security feature that you are about to run into for the first time.

## Setting up the client
1. Use [this](https://github.com/nss-group-projects/dotnet-honey-rae-client) template to create your own repo, and clone it locally.
1. In the client's directory, run `npm install` to get the project's dependencies.
1. This client expects the API to be running locally on port `5001` for HTTPS. In your `HoneyRaesAPI` project, open `Properties/launchSettings.json` and change the `https` profile to use port `5001`, and the `http` profile to use port `5000`.
1. The client's own dev server is also going to act as a proxy server for the API, and it assumes that all of the API's routes begin with `/api`. Go through `Program.cs` and add `/api` to the front of every route you've written so far, so that `/servicetickets` becomes `/api/servicetickets`, and so on for the employee and customer endpoints. From now on, every project in the course will follow this same convention.
1. Start the API with the debugger, then in the client's directory, run `npm run dev` to start the React app.

## Testing the connection
Make sure both the API and the client are running, then click the Service Tickets link in the nav bar. You should see a table of all the tickets from the API displayed in the client. If you see that, both projects are configured correctly, and you're ready to move on to the next section, where we'll take a closer look at what just made that work.

### What did we just do?
The `TicketsList` component you just saw render already has its data fetching written for you, in a module called `serviceTicketsData.js`:
```javascript
const _apiUrl = "/api/servicetickets";

export const getServiceTickets = () => {
  return fetch(_apiUrl).then((r) => r.json());
};
```
Notice that the URL being fetched doesn't include a domain or a port, it just starts with `/api`. That's on purpose, and it's the key to why this worked without any extra configuration. Let's find out why by breaking it.

## Seeing the problem the proxy solves
1. In `serviceTicketsData.js`, temporarily change `_apiUrl` to the full address of your API, including the port from your `launchSettings.json`:
    ```javascript
    const _apiUrl = "https://localhost:5001/api/servicetickets";
    ```
1. Save the file. The client should refresh on its own. Click the Service Tickets link again.

You should see an empty table, and if you open your browser's dev tools and look at the console, an error message something like this:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://localhost:5001/api/servicetickets. (Reason: CORS header 'Access-Control-Allow-Origin' missing).
```
What just happened? CORS stands for _Cross-Origin Resource Sharing_. The client's dev server and the API are running on different ports, and different ports (along with different domains or protocols) count as different _origins_ as far as the browser is concerned. By default, a browser's Same Origin Policy blocks a page from reading a response from any origin other than its own. This is a security feature, it keeps a malicious page from quietly reading data out of some other site your browser happens to be logged into. The server on the other end has to explicitly say "it's fine for a different origin to read this" for the browser to allow it, and right now our API isn't saying that.

Change `_apiUrl` back to `"/api/servicetickets"` and confirm that the table of tickets is back. Now you know exactly what that relative URL was doing for you.

## Meet the proxy
When you ran `npm run dev`, you started up the client's own dev server. That dev server has been configured to act as a proxy: any request the client makes to a route starting with `/api` gets silently forwarded on to your API at `https://localhost:5001`, and the response is handed back to the client as if the dev server had answered it itself. You can see this configuration in the client's `vite.config.js`:
```javascript
proxy: {
  "/api": {
    target: "https://localhost:5001",
    changeOrigin: true,
    secure: false,
  },
},
```
Because the browser only ever talks to the dev server (its own origin), it never makes a cross-origin request in the first place, and the Same Origin Policy never gets involved. This is also why the `/api` prefix matters: it's how the dev server knows which requests to forward on to your API instead of trying to serve them as part of the client app itself.

## When the proxy isn't enough
The proxy is a great solution here because you, the developer, control both halves of the setup: the client's dev server and the API you're forwarding to. But that won't always be true. Once this application is deployed, or if you're building an API that needs to serve requests from a client you don't control the dev server for (a mobile app, or a completely different website, for example), there won't be a proxy standing between the browser and your API to hide the cross-origin request. At that point, the API itself has to tell the browser which origins are allowed to read its responses.

Back in the first chapter of this book, we introduced this code in `Program.cs`, and mentioned that we'd be coming back to edit it later:
```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```
This is that moment. Above this block, add:
```csharp
builder.Services.AddCors();
```
And update the block itself to this:
```csharp
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
This tells the browser that it's safe to read this API's responses from any origin, no proxy required. You won't need to switch the client over to use this instead of the proxy right now, the proxy is doing its job, but keep this code in mind. You'll reach for it directly in the next project, where the front end doesn't have a proxy configured for it already.

## ✍️ Reflections
1. `getServiceTickets` uses `.then()` to work with the Promise that `fetch` returns. If you've used `async`/`await` before, that's just a different syntax for doing the same thing, and you're free to use either style when you write your own data-fetching functions. You'll see both used in this course.
1. Why do you think the proxy config requires every API route to start with `/api`? What might go wrong if the client app itself had a route (a page in the React app) with the same name as one of your API's endpoints?

## 🔍 Additional Materials
1. [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
1. [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)

Up Next: [Planning a New Feature: Team Repairs](./honeyrae-11-planning-teams.md)
