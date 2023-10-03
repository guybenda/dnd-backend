import { WSMessage, WSMessageType } from "dnd-common";
import { Game } from "./game";
import { WSUser } from "./wsUser";

export class GameRoom {
	readonly game: Game;
	readonly users: WSUser[];

	private constructor(game: Game) {
		this.game = game;
		this.users = [];
	}

	// static async create(name: string, adminId: string): Promise<GameRoom | null> {
	// 	const game = await Game.new({
	// 		name,
	// 		adminId,
	// 		data: {},
	// 	});

	// 	return new GameRoom(game);
	// }

	static async createByGameId(gameId: string): Promise<GameRoom | null> {
		const game = await Game.getById(gameId);

		if (!game) {
			return null;
		}

		return new GameRoom(game);
	}

	addUser(user: WSUser) {
		user.ws.on("close", () => {
			console.log(`user ${user.id} disconnected`);
			const index = this.users.findIndex(u => u.id === user.id);

			if (index !== -1) {
				this.users.splice(index, 1);
			}
		});

		user.ws.on("message", data => {
			console.log(`received message from user: `, user.id);
			console.log(`data: `, data);
		});

		const found = this.users.findIndex(u => u.id === user.id);

		if (found !== -1) {
			this.users.splice(found, 1);
		}

		this.users.push(user);

		return this;
	}

	broadcast<T extends WSMessageType>(from: WSUser, data: WSMessage<T>) {
		this.users.forEach(user => {
			if (user.id !== from.id) {
				user.ws.send(JSON.stringify(data));
			}
		});
	}
}
