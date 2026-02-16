# Run Both Projects: Client (Angular) + Server (.NET)

Use this file as a quick reference to run the Angular client and the ServerSid e .NET API locally.

## Prerequisites

- Install .NET SDK (recommended: .NET 8).
- Install Node.js (LTS) and npm.
- Optional: Angular CLI globally (npm install -g @angular/cli) for direct `ng` commands.

## Start the Server (ServerSide)

Open a terminal and run:

```bash
cd ServerSide
dotnet run
```

Note: `dotnet run` will build and start the API. Watch the terminal output for the listening URL and port.

## Start the Client (Angular)

Open a separate terminal and run:

```bash
cd ClientSide/TransactionClient
npm start
```

`npm start` typically runs `ng serve` (see `package.json`). If you prefer the Angular CLI directly:

```bash
cd ClientSide/TransactionClient
ng serve --proxy-config proxy.conf.json
```

The app will be available at `http://localhost:4200/` by default.

## Run Both at the Same Time — Simple (two terminals)

1. Terminal A: run the Server (see above).
2. Terminal B: run the Client (see above).

This is the simplest approach and works reliably on all platforms.

## Run Both at the Same Time — PowerShell background processes

From the repo root you can start both in background PowerShell jobs (Windows):

```powershell
Start-Process -FilePath dotnet -ArgumentList 'run' -WorkingDirectory "$PWD/ServerSide"
Start-Process -FilePath npm -ArgumentList 'start' -WorkingDirectory "$PWD/ClientSide/TransactionClient"
```

Close the terminals or stop the processes to shut them down.

## Run Both at the Same Time — single npm script (optional)

You can add `concurrently` if you want one command to start both services from the client folder.

1. Install `concurrently` in the client project:

```bash
cd ClientSide/TransactionClient
npm install --save-dev concurrently
```

2. Add a script to `package.json` inside `ClientSide/TransactionClient`:

```json
"scripts": {
  "start:both": "concurrently \"cd ../.. && dotnet run --project ServerSide\" \"npm start --prefix ClientSide/TransactionClient\""
}
```

3. Run from the repo root (or the client folder):

```bash
npm run start:both --prefix ClientSide/TransactionClient
```

Adjust paths if you run the command from the repository root or from a subfolder.

## Notes & Troubleshooting

- If ports clash, change the port for either project. The server shows its port in the `dotnet run` output.
- If the client cannot reach the API, ensure the API base URL in the Angular environment file matches the Server URL, or use `proxy.conf.json` to forward API calls to the backend.
- If you see CORS errors, enable CORS in the .NET API startup temporarily for development.
- If `npm start` fails, run `npm install` in `ClientSide/TransactionClient` first.

## Next steps (optional)

- I can add a PowerShell script or a combined `package.json` script to automate the two-start workflow — tell me which you prefer.
