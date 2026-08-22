# Foundations Installations

## Setting up a second computer
If you are using a different computer for server side than you did for front end (or setting up Windows with Bootcamp on your Mac), you will need to do all of the front end installations first. They can be found [here](https://github.com/nashville-software-school/client-side-mastery/blob/master/book-0-installations/chapters/GETTING_STARTED_WINDOWS_C_SHARP.md).
## .NET 10 SDK
The .NET SDK includes all of the command line tools you will need to build and run your .NET programs for the first part of the course. <br>
Go to the [.NET 10 downloads page](https://dotnet.microsoft.com/en-us/download/dotnet/10.0) and download the SDK installer for your OS (Windows, macOS Arm64 for M-series Macs, or macOS x64 for Intel Macs). 

When the download completes, run (open) the file downloaded by your browser and click `Install` when prompted to. 

Verify that the install has worked by opening a new terminal and running `dotnet --version`. You should see `10.0.302`, or something similar (any `10.0.x` version is fine). If your terminal doesn't recognize the command, ask an instructor to help. 


## C# Extension for VS Code
The official C# extension from Microsoft for VS Code provides a number of helpful features including syntax highlighting, Intellisense (code completion and hints) and tools for debugging in your editor. <br>
Install it by searching for `C#` in the extensions tab (open with Ctrl+Shift+X), select the C# extension by Microsoft and click `Install`.
