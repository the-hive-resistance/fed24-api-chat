import * as dotenv from "dotenv";

// Initialize dotenv so it reads our `.env`-file
dotenv.config();

import app from "./src/app";
import Debug from "debug";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { handleConnection } from "./src/controllers/socket_controller";
import { deleteAllUsers } from "./src/services/user_service";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/types/SocketEvents.types";

// Read port to start server on from `.env`, otherwise default to port 3000
const PORT = Number(process.env.PORT) || 3000;

// Create a new debug instance
const debug = Debug("chat:server");

/**
 * Create HTTP and Socket.IO server.
 */
const httpServer = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
	cors: {
		credentials: true,
		origin: [
			"http://localhost:5173",
			"https://*.herokuapp.com",
			"https://admin.socket.io",
		],
	},
});

/**
 * Set up Socket.IO Admin (but only if we have set a password)
 */
if (process.env.SOCKET_IO_ADMIN_PASSWORD) {
	console.log("💻 Setting up Socket.IO Admin UI");
	instrument(io, {
		auth: {
			type: "basic",
			username: "admin",
			password: process.env.SOCKET_IO_ADMIN_PASSWORD,
		},
	});
}

/**
 * Handle incoming Socket.IO connection
 */
io.on("connection", (socket) => {
	// Pass the connection over to socket-controller
	handleConnection(socket, io);
});

/**
 * Delete all users from the database 😈
 */
deleteAllUsers()
	.then(() => {
		console.log("🧹 Deleted all ze users 😇");

		/**
		 * Listen on provided port, on all network interfaces.
		 */
		httpServer.listen(PORT);
	})
	.catch(err => {
		console.error("🚨 Could not delete all ze users 😱", err);
	});

/**
 * Event listener for HTTP server "error" event.
 */
httpServer.on("error", (err: NodeJS.ErrnoException) => {
	if (err.syscall !== "listen") {
		throw err;
	}

	switch (err.code) {
		case "EACCES":
			console.error(`🦸🏻 Port ${PORT} requires elevated privileges`);
			debug(`🦸🏻 Port ${PORT} requires elevated privileges: %O`, err);
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(`🛑 Port ${PORT} is already in use`);
			debug(`🛑 Port ${PORT} is already in use: %O`, err);
			process.exit(1);
			break;
		default:
			debug(`🚨 Unknown error, rethrowing: %O`, err);
			throw err;
	}
});

/**
 * Event listener for HTTP server "listening" event.
 */
httpServer.on("listening", () => {
	console.log(`🌎 Yay, server started on http://localhost:${PORT}`);
});
