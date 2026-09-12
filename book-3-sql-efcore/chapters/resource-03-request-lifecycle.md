# Request Lifecycle

Once a project has a real client talking to a real API backed by a real database, a single user action, like landing on a page or clicking a button, sets off a request that travels through every layer of the stack, then climbs all the way back up with a response. It's easy to lose track of that whole trip while you're heads-down in any one piece of it. This is a map of it.

![Diagram titled "The Full Round Trip," showing two boxed zones. The Client zone (green) contains React Router, a Component, and apiManager.js in sequence. The Server zone (amber) contains a Minimal API, a DbContext, and PostgreSQL in sequence. Between the zones, a fetch call crosses from client to server, and a 200 OK JSON response crosses back. Arrows above the boxes show the request traveling right (render, call, fetch, LINQ query, SQL), and arrows below show the response traveling left (SQL rows, C# objects, JSON, promise resolves, re-render).](../../assets/request-lifecycle.png)

Every arrow going right is part of the *request*, something asking for data and passing it one layer deeper. Every arrow going left is part of the *response*, that data making its way back up to something rendered on screen. Each layer only has to do one job: turn what it was just handed into whatever the next layer needs.
