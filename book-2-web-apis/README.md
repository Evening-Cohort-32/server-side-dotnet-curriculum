# Book 2 - An Introduction to Web APIs
The purpose of this book is to provide a conceptual introduction to building Web APIs with ASP.NET Core and modeling data in C#/.NET. Any additional installations for this book are included in the chapter instructions.

## Learning Objectives
1. Debugging C# in VS Code
1. Web API Concepts
    <ul>
        <li>url routes, request handlers, endpoints</li>
        <li>the HTTP request/response cycle revisited</li>
        <li>URL parameters</li>
        <li>data serialization</li>
    </ul>
1. More object-oriented programming
    <ul>
        <li>Creating classes to represent data entities</li>
        <li>using classes to model data relationships between entities (composition)</li>
    </ul>

## Table of Contents

|#|Honey Rae's Repairs 🍯 💻<br> <sub>(guided tour)</sub> |Car Builder 🚙🚗 |DeShawn's Dog Walking 🐕‍🦺 🐩 |
|:-:|:-:|:-:|:-:|
|1|[Setup for Web APIs](./chapters/honeyrae-01-web-api-setup.md)|[Project Setup](./chapters/carbuilder-01-setup.md)|[Project Setup](./chapters/deshawns-01-setup.md)|
|2|[Making Requests with Yaak](./chapters/honeyrae-02-testing-web-api.md)  <br><sub style="font-size: 0.85rem;">#debugging #endpoints #routes #handlers</sub>|[Basic Requirements](./chapters/carbuilder-02-basic-endpoints.md)|[User Stories](./chapters/deshawns-02-user-stories.md)|
|3|[Data Models](./chapters/honeyrae-03-defining-types.md) <br><sub style="font-size: 0.85rem;">#namespaces #dtos</sub>|[Get Technologies](./chapters/carbuilder-03-client-requests-cors.md)|[Walker Cities](./chapters/deshawns-03-many-to-many.md)| 
|4|[Get All/Get One Service Ticket(s)](./chapters/honeyrae-04-get-tickets.md) <br><sub style="font-size: 0.85rem;">#using</sub>|[Submit an Order](./chapters/carbuilder-04-submit-order.md)||
|5|[Adding all Honey Rae's GET endpoints](./chapters/honeyrae-05-get-emps-cust.md)<br><sub style="font-size: 0.85rem;">#composition #NotFound</sub>|[Calculating Total Price](./chapters/carbuilder-05-related-data.md)||
|6| [Filtering Tickets with Query Strings](./chapters/honeyrae-06-query-string.md) <br><sub style="font-size: 0.85rem;">#querystring</sub>|||
|7| [Creating a Service Ticket](./chapters/honeyrae-07-create.md) |[Completing a Build](./chapters/carbuilder-06-complete-build.md)||
|8| [Deleting a Ticket](./chapters/honeyrae-08-delete.md) <br><sub style="font-size: 0.85rem;">#delete</sub>|[Query String Params](./chapters/carbuilder-07-query-string.md)||
|9| [Assigning a Ticket](./chapters/honeyrae-09-put.md) <br><sub style="font-size: 0.85rem;">#put</sub>|||
|10| [Adding a Client](./chapters/honeyrae-10-client-cors.md) <br><sub style="font-size: 0.85rem;">#cors #proxy</sub>|||
|11| [Planning a New Feature: Team Repairs](./chapters/honeyrae-11-planning-teams.md) <br><sub style="font-size: 0.85rem;">#userstories #erd</sub>|||
|12| [Implementing the Many-to-Many Relationship](./chapters/honeyrae-12-many-to-many.md) <br><sub style="font-size: 0.85rem;">#manytomany</sub>|||

|:mortar_board: Coding Self-Assessment|
|--|
|:potato: [Tuber Treats](./chapters/assessment-02.md)|

## 🔍 Additional Materials

|:compass: Explorer Chapters (after you finish the self assessment or are otherwise waiting)|
|--|
|🍯 💻 [Adding More Endpoints to HoneyRae's](./chapters/explorer-honeyrae-01-more-endpoints.md)|
|🍯 💻 [Building Out the HoneyRae's Client](./chapters/explorer-honeyrae-02-client.md)|
|🍯 💻 [OpenAPI (Swagger)](./chapters/explorer-honeyrae-03-open-api.md)|

|🌐 Resources|
|--|
|[REST design principles - naming routes](./chapters/resource-01-rest-concepts.md)|