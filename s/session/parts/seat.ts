
import {AuthorId} from "../../core/types.js"
import {Liaison} from "../../core/liaison.js"
import {Fiber} from "../../core/parts/fiber.js"

export class Seat {
	readonly authorId: AuthorId

	constructor(
			private liaison: Liaison<any>,
			public userland: Fiber,
		) {
		this.authorId = liaison.authorId
	}

	get rtt() {
		return this.liaison.pingponger.averageRtt
	}
}

