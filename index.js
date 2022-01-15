#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2));
const { writeFile, mkdir, readFile } = require("fs").promises;
const { resolve } = require("path");
const { asyncExec, log } = require("./utils");

const [dir] = argv._;

const main = async () => {
  if (!dir) {
    throw new Error("Please provide a directory.");
  }

  // Creating app directory
  if (dir !== ".") {
    await mkdir(dir);
  }

  log("\n💪 Creating Typescript Express REST server...");

  // Create package.json
  log("\n📃 Creating package.json...");
  await asyncExec(`cd ${dir} && npm init -y`);

  // Install dependencies
  log("\n🌐 Installing dependencies...");
  const dependencies = ["express", "cors", "dotenv", "concurrently"];
  for (const dep of dependencies) {
    await asyncExec(`cd ${dir} && npm i ${dep}`);
  }

  // Install dev dependencies
  const devDependencies = [
    "@types/express",
    "@types/cors",
    "@types/dotenv",
    "@types/node",
    "typescript",
    "nodemon",
  ];
  for (const dep of devDependencies) {
    await asyncExec(`cd ${dir} && npm i -D ${dep}`);
  }

  // Get package.json
  const packageDotJsonString = await readFile(resolve(dir, "package.json"), {
    encoding: "utf-8",
  });
  const packageDotJson = JSON.parse(packageDotJsonString);

  // Add scripts to package.json
  log("\n🚂 Configuring package.json...");
  packageDotJson.scripts = {
    start: "node ./dist/index.js",
    dev: `concurrently \"tsc -w\" \"nodemon ./dist/index.js\"`,
  };

  // Save package.json
  await writeFile(
    resolve(dir, "package.json"),
    JSON.stringify(packageDotJson),
    {
      encoding: "utf-8",
    }
  );

  // Create tsconfig.json
  log("\n🧠 Creating tsconfig.json...");
  const tsconfig = {
    compilerOptions: {
      target: "es6",
      module: "commonjs",
      rootDir: "./src",
      outDir: "./dist",
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      experimentalDecorators: true,
    },
  };
  await writeFile(resolve(dir, "tsconfig.json"), JSON.stringify(tsconfig), {
    encoding: "utf-8",
  });

  // Creating folders
  log("\n🌳 Creating environment...");
  await mkdir(resolve(dir, "dist"));
  await mkdir(resolve(dir, "src"));
  await writeFile(resolve(dir, ".env"), `PORT=8000`, { encoding: "utf-8" });

  // Create index.ts file
  await writeFile(
    resolve(dir, "src", "index.ts"),
    `import express from "express";
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

app.use(express.urlencoded({extended: true}));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Set-Cookie"]
}));

/*
  Routes
*/

app.get("/", (req, res) => {
  res.json({message: "The server is working!"})
});

/*
  Boot up
*/

app.listen(process.env.PORT, () => {
  console.log(\`The server is listening at http://localhost:\$\{process.env.PORT\}\`);
});

    `,
    { encoding: "utf-8" }
  );

  // Building
  log("\n🔨 Building...");
  await asyncExec(`cd ${dir} && tsc`);

  log(
    `\n😀 All done! Now run the following commands to start up your server:\n`
  );

  if (dir !== ".") {
    log(` - cd ${dir}`);
  }
  log(" - npm run dev");
};

main().catch((e) => {
  throw e;
});
