import { WebSocket } from "ws";

export interface WSUser {
	ws: WebSocket;
	id: string;
	isAlive: boolean;
}
