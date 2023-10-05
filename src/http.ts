import express from "express";
import cors from "./cors";
import { gamesRouter } from "./routes/game";

export function getDndHttpApp() {
	const app = express();

	app.use(cors);

	app.use(express.json());

	app.use((req, res, next) => {
		if (process.env.DEV) {
			res.header("Access-Control-Allow-Origin", "*");
		} else {
			res.header("Access-Control-Allow-Origin", "https://dnd.benda.dev");
		}
		next();
	});

	app.use("/games", gamesRouter);

	return app;
}
