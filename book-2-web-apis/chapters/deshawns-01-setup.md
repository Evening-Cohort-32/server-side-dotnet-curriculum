# 🐕‍🦺 🐩 DeShawn's Dog Walking
In this project you will have the opportunity to build a full stack application with a React client and .NET API. Try to avoid completing the entire API, and only then starting on the React client. We recommend you build the API and the front end concurrently, _feature by feature_, rather than trying to anticipate all of the needs for the API in the beginning. For this reason, (and because it is the column furthest to the right), aside from the setup instructions and the starter code, the main features of the app will only be described in the user stories. Use the tools you have already learned (building an ERD, making wireframes, etc) to plan your work on this project. 

## Setup

1. Use [this](https://github.com/nss-group-projects/dotnet-deshawns-react) template to create your own repo, and clone it locally
    > :bulb: If your cohort is using .NET 10, check the **Include all branches** checkbox before clicking "Create repository." After cloning, run `git checkout net10` to switch onto the .NET 10 version of the project before continuing — see that branch's README for what's different.
1. the React app is in a folder called `client`. Navigate to that directory and run `npm install`
1. Start the API with the VS Code debugger. 
    > :bulb: Did Swagger just open on its own in a browser tab? That's the `.vscode` folder in this project doing exactly what it's configured to do — more on that further down in this chapter.
1. in the `client` directory, run `npm run dev` to start the React App. 
1. Explore the codebase to see what is there. Pay particular attention to `index.jsx`, `apiManager.js`, and `App.jsx`. Write down any questions you have so that you can ask a colleague or your instructors. 

## Proxy Settings
This project uses the same proxy technique you already used back in Honey Rae's, and it's set up for you already. In `vite.config.js` (for the client app), this code has been added:
``` js
proxy: {
        "/api": {
          target: "https://localhost:5001",
          changeOrigin: true,
          secure: false,
        },
      },
```
Just like before, this tells the dev server to forward any request starting with `/api` on to the API instead of trying to serve it as part of the client app, so the browser only ever sees requests to its own origin. The fetch in the `apiManager.js` module in the template code already reflects this:
``` javascript
export const getGreeting = async () => {
const res = await fetch("/api/hello");
return res.json();
};
```
Continue prepending every route in your API with `/api`, the same convention you started using in Honey Rae's.

### `launchSettings.json`
This is a good time to point out that in the `Properties` folder of the API project, there is a file called `launchSettings.json`. This file contains the configurations for running the web API. 
There are two profiles in the JSON. This is the one that the debugger is using:
``` JSON
"profiles": {
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:5001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
```
This is where the URLs for the API are located, as well as environment variables that will be available in the project while it is running. 

Finally, in the `.vscode` folder the `launch.json` file contains more configuration for debugging. This line:
``` json
"uriFormat": "%s/swagger/index.html"
```
in the `serverReadyAction` section automaticaly opens Swagger (a tool for documenting and testing APIs) in a browser tab. See [this](./explorer-honeyrae-03-open-api.md) chapter for more information.  

That's it for the tour of the application! It's time to start coding... oh wait. No! It's time to start planning!

Up Next: [User Stories](./deshawns-02-user-stories.md)



## 🔍 Additional Materials
1. [Proxy API Requests locally](https://vitejs.dev/config/server-options.html#server-proxy)
