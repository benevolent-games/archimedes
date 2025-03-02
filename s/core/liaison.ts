
import {Fiber} from "./utils/fiber.js"
import {GameMessage, Schema} from "./types.js"
import {Pingponger} from "./utils/pingponger.js"
import {Inbox, Outbox, Parcel} from "./utils/inbox-outbox.js"

export type Reception<xSchema extends Schema> = {
	state: xSchema["state"]
	deltas: xSchema["delta"][]
	inputs: xSchema["input"][]
}

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
	sendDeltas(deltas: xSchema["delta"][]) {}
	sendInputs(inputs: xSchema["input"][]) {}

	receive(): Reception<xSchema> {
		let state: xSchema["state"] | undefined
		let inputs: xSchema["input"][] = []
		let deltas: xSchema["delta"][] = []

		for (const message of this.inbox.take()) {
			const [kind, x] = message
			switch (kind) {
				case "ping":
				case "pong":
					this.pingponger.receive(message)
					break

				case "state":
					state = x
					break

				case "inputs":
					inputs.push(x)
					break

				case "deltas":
					deltas.push(x)
					break

				default:
					console.warn(`unknown message kind "${kind}"`)
			}
		}

		return {state, inputs, deltas}
	}
}

