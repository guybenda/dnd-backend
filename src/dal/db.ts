import { cert, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import key from "../key";

export class DndFirestore {
	private static db: Firestore | null = null;

	static init() {
		this.getDb();
	}

	static getDb() {
		if (!this.db) {
			initializeApp({
				credential: cert(key),
			});

			this.db = getFirestore();
		}

		return this.db;
	}
}
