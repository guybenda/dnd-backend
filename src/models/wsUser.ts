import { Socket } from "socket.io";

export class IOUser {
	socket: Socket;
	id: string;

	constructor(id: string, socket: Socket) {
		this.id = id;
		this.socket = socket;
	}
}
