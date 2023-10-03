import { IncomingMessage, Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { GameRoom } from "./gameRoom";

function getInfoFromHeaders(message: IncomingMessage) {
	const gameId = message.headers["x-game-id"];

	if (typeof gameId !== "string" || gameId === "") {
		return null;
	}

	const userId = message.headers["x-user-id"];

	if (typeof userId !== "string" || userId === "") {
		return null;
	}

	return { gameId, userId };
}

export class GameServer {
	readonly gameRooms: GameRoom[];
	readonly wsServer: WebSocketServer;

	// BIG TODO!
	constructor(httpServer: Server) {
		this.gameRooms = [];
		this.wsServer = new WebSocketServer({ server: httpServer });

		this.wsServer.on("connection", this.handleConnection);
	}

	close() {
		this.wsServer.close();
	}

	private async handleConnection(ws: WebSocket, request: IncomingMessage) {
		const info = getInfoFromHeaders(request);

		if (!info) {
			ws.close(400);
			console.log(`Invalid game id or user id`);
			return;
		}

		const { gameId, userId } = info;

		console.log(
			`new connection from ${request.socket.remoteAddress} to room ${gameId}`
		);

		const room = await this.getOrStartGameRoom(gameId);

		if (!room) {
			ws.close(400);
			console.log(`Room with id ${gameId} not found`);
			return;
		}

		room.addUser({ ws, id: userId, isAlive: true });
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
}
