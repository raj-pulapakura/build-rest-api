# build-rest-api

## Description

A package that generates a simple Typescript Express REST server.

## Usage

Run the following command to generate the server:

```
npx build-rest-api [DIR]
```

And run these commands to start the server:

```
cd [DIR]
npm run dev
```

This server uses the `concurrently` package to run the typescript watcher and the nodemon server at the same time.

## Output

This is what the package generates for you:

```
[DIR]
│   .env
│   package-lock.json
|   package.json
|   tsconfig.json
│
└───node_modules
|
└───src
|   │   index.ts
|
└───dist
|   │   index.js
```

This is what the `index.ts` file looks like:

```ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

/*
  Load environment variables
*/

dotenv.config();

/*
  Instantiate app
*/

const app = express();

/*
  Middleware
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Set-Cookie"],
  })
);

/*
  Routes
*/

app.get("/", (req, res) => {
  res.json({ message: "The server is working!" });
});

/*
  Boot up
*/

app.listen(process.env.PORT, () => {
  console.log(
    `The server is listening at http://localhost:${process.env.PORT}`
  );
});
```
