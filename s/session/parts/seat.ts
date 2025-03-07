
import {Spoke} from "./spoke.js"
import {Liaison} from "../../core/liaison.js"

export class Seat {
	constructor(
			private spoke: Spoke,
			private liaison: Liaison<any>,
		) {
	}

	get authorId() {
		return this.liaison.authorId
	}

	get rtt() {
		return this.liaison.pingponger.averageRtt
	}

	get userland() {
		return this.spoke.fibers.sub.userland
	}

	disconnect() {
		this.spoke.disconnect()
	}
}

