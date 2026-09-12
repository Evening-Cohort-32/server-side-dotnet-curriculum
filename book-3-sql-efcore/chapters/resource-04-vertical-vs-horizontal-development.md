# Vertical Slices vs. Horizontal Layers

There are two orders you could build the features of a full-stack project in.

**Horizontal**: build one whole layer before starting the next, every table, then every endpoint, then every page. It feels organized, but nothing actually works end-to-end until the very last step. If something's wrong two layers down, you won't find out until you're wiring up the last one, by which point it's buried under everything built on top of it.

**Vertical**: build one whole feature before starting the next, just enough of the database, just enough of the API, just enough of the client, to see that one feature work for real. This thin slice through every layer is called a *vertical slice*, a real term you'll see used outside this course too. The next feature gets its own slice, proven the same way.

![Diagram titled "Vertical Slice vs. Horizontal Layers," comparing two 3x3 grids of Client, API, and Database rows against Feature A, B, and C columns. The Horizontal panel is numbered row by row: Database 1-2-3, API 4-5-6, Client 7-8-9, captioned "nothing runs end-to-end until step 9." The Vertical panel is numbered column by column: Feature A's Database, API, and Client cells are 1, 2, 3, with that column outlined and labeled "vertical slice," captioned "Feature A works end-to-end after step 3, long before B or C exist."](../../assets/vertical-vs-horizontal-development.png)

This is why full-stack projects in this course keep telling you to add one endpoint at a time and connect it to the client right away, instead of finishing the whole API first: it's asking for a vertical slice, not a horizontal layer.
