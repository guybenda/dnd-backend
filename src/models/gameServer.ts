import {
	ClientToServerEvents,
	DiceExpression,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
	UserAuth,
} from "dnd-common";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { GameRoom } from "./gameRoom";

type DndServer = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;
type DndSocket = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

export class GameServer {
	readonly gameRooms: GameRoom[];
	readonly io: DndServer;

	constructor(httpServer: HttpServer) {
		this.gameRooms = [];
		this.io = new Server<
			ServerToClientEvents,
			ClientToServerEvents,
			InterServerEvents,
			SocketData
		>(httpServer, {
			cors: { origin: process.env.DEV ? "*" : "https://dnd.benda.dev" },
			transports: ["websocket"],
		});

		this.io.use((socket, next) => {
			const auth = socket.handshake.auth as UserAuth;
			if (!auth.gameId) {
				return next(new Error("missing game id"));
			}

			if (!auth.userId) {
				return next(new Error("missing user id"));
			}

			next();
		});

		this.io.on("connection", this.handleConnection.bind(this));
	}

	close() {
		this.io.close();
	}

	private async handleConnection(socket: DndSocket) {
		const auth = socket.handshake.auth as UserAuth;
		const ip =
			socket.handshake.headers["X-Real-IP"] || socket.handshake.address;
		console.log(
			`new connection from ${ip}, user ${auth.userId}, game ${auth.gameId}`
		);

		const room = await this.getOrStartGameRoom(auth.gameId);

		if (!room) {
			console.log(`no game found for id ${auth.gameId}`);
			socket.disconnect();
			return;
		}

		socket.data = {
			isAdmin: room.game.adminId === auth.userId,
		};

		this.registerHandlers(socket);

		socket.join(auth.gameId);
	}

	private async getOrStartGameRoom(gameId: string): Promise<GameRoom | null> {
		const room = this.gameRooms.find(room => room.game.id === gameId);

		if (room) {
			return room;
		}

		const newRoom = await GameRoom.createByGameId(gameId);

		if (!newRoom) {
			return null;
		}

		this.gameRooms.push(newRoom);

		return newRoom;
	}

	private async getGamePlayers(gameId: string): Promise<string[]> {
		const sockets = await this.io.to(gameId).fetchSockets();
		return sockets.map(socket => socket.handshake.auth.userId);
		// return this.io.sockets.adapter.rooms.get(gameId) || [];
	}

	private registerHandlers(socket: DndSocket) {
		function toOther() {
			return socket.broadcast.to(socket.handshake.auth.gameId);
		}

		function toAll() {
			return socket.to(socket.handshake.auth.gameId);
		}

		socket.use(([event, ...args], next) => {
			console.log(
				`received '${event}' from ${socket.handshake.auth.userId} with args`,
				args
			);

			next();
		});

		socket.on("roll", (name, id, roll, broadcast) => {
			const diceExp = new DiceExpression(roll);
			const result = diceExp.roll();
			socket.emit("rollResult", name, id, result);

			if (broadcast) {
				toOther().emit("rollResult", name, id, result);
			}
		});
	}
}
