import { Game as GameType } from "dnd-common";
import { DndFirestore } from "../dal/db";
export class Game implements GameType {
	readonly id: string;
	name: string;
	adminId: string;
	data: object;

	private static readonly collectionName = "games";

	private constructor({ id, name, adminId, data }: GameType) {
		this.id = id;
		this.name = name;
		this.adminId = adminId;
		this.data = data;
	}

	private static col() {
		return DndFirestore.getDb().collection(this.collectionName);
	}

	static async getAll(): Promise<Game[]> {
		const res = await Game.col().get();

		const games = res.docs.map(doc => new Game(doc.data() as GameType));

		return games;
	}

	static async getById(id: string): Promise<Game | null> {
		const res = await Game.col().doc(id).get();

		if (!res.exists) {
			return null;
		}

		const game = res.data() as GameType;
		return new Game(game);
	}

	static async new(game: Omit<GameType, "id">): Promise<Game> {
		const res = await Game.col().add(game);

		return new Game({
			id: res.id,
			...game,
		});
	}

	async update(): Promise<Game> {
		const game = {
			name: this.name,
			adminId: this.adminId,
			data: this.data,
		};

		await Game.col().doc(this.id).update(game);

		return this;
	}

	async delete(): Promise<boolean> {
		const res = await Game.deleteById(this.id);

		return res;
	}

	static async deleteById(id: string): Promise<boolean> {
		const res = await Game.col().doc(id).delete();

		return res !== null;
	}
}
