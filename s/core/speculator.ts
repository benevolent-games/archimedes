
import {Liaison} from "./liaison.js"
import {loop} from "../tools/loop.js"
import {Simulator} from "./simulator.js"
import {Chronicle} from "../tools/chronicle.js"
import {AuthorId, InputDispatch, InputTelegram, Schema, Telegram} from "./types.js"

export class Speculator<xSchema extends Schema> {
	#currentTick = 0
	#chronicle = new Chronicle<InputTelegram<xSchema["input"]>>()

	constructor(
		public authorId: AuthorId,
		public liaison: Liaison<Telegram<xSchema>>,
		public grounded: Simulator<xSchema>,
		public forecast: Simulator<xSchema>,
		public hz = 60,
	) {}

	get ticksAhead() {
		const rtt = this.liaison.pingponger.averageRtt
		return Math.round(rtt / (1000 / this.hz))
	}

	tick() {
		this.#currentTick += 1

		const telegrams = this.liaison.recv()
		this.grounded.simulate(telegrams)
		this.forecast.state = structuredClone(this.grounded.state)

		// roll-forward
		for (const t of loop(this.ticksAhead)) {
			const scheduledTelegrams = this.#chronicle.at(t)
			this.forecast.simulate(scheduledTelegrams)
		}
	}

	sendInputs(inputs: xSchema["input"][]) {
		const dispatches: InputDispatch<xSchema["input"]>[] = inputs.map(input => ["input", input])
		const telegram: InputTelegram<xSchema["input"]> = [this.authorId, dispatches]

		// immediately send down the wire
		this.liaison.send(telegram)

		// schedule local inputs into the future
		const futureTick = this.#currentTick + this.ticksAhead
		this.#chronicle.add(telegram, futureTick)
	}
}

