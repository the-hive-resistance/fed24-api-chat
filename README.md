# Real-time Chat 💬

## Frontend create

```sh
npm create vite@latest frontend -- --template vanilla-ts
cd frontend
npm install bootstrap @fortawesome/fontawesome-free
npm install socket.io-client
npm install -D sass@1.77.6 --save-exact
```

### Add linting

```sh
npm install --save-dev eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript-eslint type-coverage npm-run-all2
```

### Add to `scripts` in `package.json`

```json
    "check:0-lint": "eslint",
    "check:1-tsc": "tsc --noEmit",
    "check:2-type-coverage": "type-coverage --at-least 100",
    "check": "run-s check:*",
```

Copy `backend/eslint.config.mjs` to `frontend/eslint.config.mjs`.

## Backend

Based on <https://github.com/the-hive-resistance/fed24-api-prisma-boilerplate> but removed the following packages:

* bcrypt
* cookie-parser
* express-validator
* jsonwebtoken

Also changed Prisma datasource provider to `mongodb`. Update the `scripts` section in `backend/package.json` to match this project.

### Remove packages

Run from the `backend` directory:

```sh
npm uninstall bcrypt cookie-parser express-validator jsonwebtoken @types/bcrypt @types/cookie-parser @types/jsonwebtoken
```

### Add packages

Run from the `backend` directory:

```sh
npm install socket.io supports-color
```

## Build and run

> [!IMPORTANT]
> These commands should be executed in the root directory.

Run `npm install` to install all packages for both frontend and backend, `npm run build` to build both frontend and backend, and then start the server using `npm start`. The frontend will be served as static files from the backend on the same port.
