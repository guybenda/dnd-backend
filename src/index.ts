import express from "express";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import key from "./key.js";

initializeApp({
	credential: cert(key),
});

const db = getFirestore();

// create express server and listen on port 80
const app = express();
app.listen(80);

// handle get request
app.get("/", async (req, res) => {
	const games = await db.collection("games").limit(10).get();
	const game = games.docs.pop();
	res.send(game?.data());
});
