# Missing .NET Runtime: Fixing "Framework Not Found" Errors

This applies to any assessment or template repo that targets an older .NET version than the SDK you have installed — not just this one. You'll likely only need to do this once.

## Quick fix

1. Run `dotnet --list-runtimes` in a terminal.
1. If you don't see a line starting with `Microsoft.NETCore.App 8.0`, install the **.NET 8 Runtime** for your OS (see below).
1. Re-run `dotnet --list-runtimes` to confirm, then try `dotnet test` or the debugger again.

## What's actually happening

Your machine has the **.NET 10 SDK** installed — that's correct, it's what the rest of this course uses. But some assessment repos (built before this course moved to .NET 10) still target `net8.0` in their project files. The SDK can *compile* an older target framework just fine, but actually *running* it — which is what `dotnet test` and the debugger both do — requires the matching .NET 8 **runtime** to be installed too. A fresh .NET 10 SDK install doesn't include it.

**You'll know this is it if you see:**

> "It was not possible to find any compatible framework version. The specified framework 'Microsoft.NETCore.App', version '8.0.0' was not found."

...from either `dotnet test` in the terminal, or when you hit F5 to start the debugger in VS Code.

## Fix it

### 1. Check what's installed

```bash
dotnet --list-runtimes
```

Look for a line beginning with `Microsoft.NETCore.App 8.0`. If it's missing (you'll likely only see `10.0.x` entries), that confirms the problem.

### 2. Install the .NET 8 Runtime

Get the plain **.NET Runtime** — not the SDK, and not the ASP.NET Core Runtime — from [dotnet.microsoft.com/download/dotnet/8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0), or use the command for your OS:

**Windows:**

```bash
winget install Microsoft.DotNet.Runtime.8
```

**macOS:** Use the installer from the link above — it's the most reliable path mid-class. (Homebrew's `dotnet@8` formula works too, but PATH wiring can be fiddly.)

### 3. Verify, then re-run

```bash
dotnet --list-runtimes
```

You're done when the output lists both `Microsoft.NETCore.App 8.0.x` and `10.0.x`. `dotnet test` and starting the debugger (F5) should now work — no changes to the project itself are needed.

## A few things worth knowing

- **Do I need to edit my project files?** No. The assessment repos already have correctly matched project settings and VS Code debug configuration — the runtime install is the only missing piece.
- **Will this break anything else on my machine?** No. .NET runtimes install side by side by design — having 8.0 and 10.0 both present is normal and expected.
- **What if the error message looks different?** Any error mentioning a specific framework version that "was not found" is almost always this same issue, just for a different project. Check `dotnet --list-runtimes` first before digging further.

Still stuck after installing the runtime and confirming it shows up? Ask your instructor — at that point it's worth looking at directly rather than guessing further.
