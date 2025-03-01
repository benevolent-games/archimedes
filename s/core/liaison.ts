
import {Fiber} from "./utils/fiber.js"
import {GameMessage, Schema} from "./types.js"
import {Pingponger} from "./utils/pingponger.js"
import {Inbox, Outbox, Parcel} from "./utils/inbox-outbox.js"

export class Liaison<xSchema extends Schema> {
	pingponger: Pingponger
	inbox = new Inbox<GameMessage>()
	outbox = new Outbox<GameMessage>()

	constructor(public fiber: Fiber<Parcel<GameMessage>>) {
		this.pingponger = new Pingponger(p => {
			const parcel = this.outbox.wrap(p)
			fiber.unreliable.send(parcel)
		})
	}

	sendState(state: xSchema["state"]) {}
	takeState(): xSchema["state"][] { return [] }

	sendDeltas(deltas: xSchema["delta"]) {}
	takeDeltas(): xSchema["delta"][] { return [] }

	sendInputs(inputs: xSchema["input"]) {}
	takeInputs(): xSchema["input"][] { return [] }
}

