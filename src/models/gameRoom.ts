import { Game } from "./game";

export class GameRoom {
	readonly game: Game;

	private constructor(game: Game) {
		this.game = game;
	}

	static async createByGameId(gameId: string): Promise<GameRoom | null> {
		const game = await Game.getById(gameId);

		if (!game) {
			return null;
		}

		return new GameRoom(game);
	}
}
