import express from "express";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import key from "./key.js";

initializeApp({
	credential: cert(key),
});

const db = getFirestore();

const app = express();

// use cors
app.use((req, res, next) => {
	if (process.env.NODE_ENV === "development") {
		res.header("Access-Control-Allow-Origin", "*");
	} else {
		res.header("Access-Control-Allow-Origin", "https://dnd.benda.dev");
	}
	next();
});

app.listen(80);

app.get("/", async (req, res) => {
	const games = await db.collection("games").limit(10).get();
	const game = games.docs.pop();
	res.send(game?.data());
});

app.get("/test", async (req, res) => {
	res.send("test");
});
