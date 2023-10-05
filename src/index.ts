import { config } from "dotenv";
import { DndFirestore } from "./dal/db";
import { getDndHttpApp } from "./http";
import { GameServer } from "./models/gameServer";

config();

DndFirestore.init();

const app = getDndHttpApp();

const httpServer = app.listen(+(process.env.PORT || 80));

const wsServer = new GameServer(httpServer);

process.on("SIGINT", () => {
	console.log("SIGINT received, closing");
	wsServer.close();
	httpServer.close();
});

console.log(`DND server running on port ${process.env.PORT || 80}`);
