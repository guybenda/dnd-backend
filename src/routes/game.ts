import { Router } from "express";
import { Game } from "../models/game";

export const gamesRouter = Router();

gamesRouter.get("/", async (req, res) => {
	const games = await Game.getAll();
	res.json(games);
});

gamesRouter.get("/:id", async (req, res) => {
	const game = await Game.getById(req.params.id);

	if (!game) {
		res.status(404).send("Not found");
		return;
	}

	res.json(game);
});

gamesRouter.post("/", async (req, res) => {
	const game = await Game.new(req.body);
	res.json(game);
});

gamesRouter.put("/:id", async (req, res) => {
	const game = await Game.getById(req.params.id);

	if (!game) {
		res.status(404).send("Not found");
		return;
	}

	game.name = req.body.name;
	game.adminId = req.body.adminId;
	game.data = req.body.data;

	await game.update();

	res.json(game);
});

gamesRouter.delete("/:id", async (req, res) => {
	const game = await Game.getById(req.params.id);

	if (!game) {
		res.status(404).send("Not found");
		return;
	}

	await game.delete();

	res.json(game);
});
