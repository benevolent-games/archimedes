
import {Schema} from "./types.js"
import {Liaison} from "./liaison.js"
import {Simulator} from "./simulator.js"
import {Ticker} from "../tools/ticker.js"

export class Authority<xSchema extends Schema> {
	constructor(
		public simulator: Simulator<xSchema>,
		public liaisons: Set<Liaison<xSchema>>,
	) {}

	tick() {
		const allInputs: xSchema["input"][] = []

		for (const liaison of this.liaisons) {
			allInputs.push(...liaison.recv().inputs ?? [])
		}

		this.simulator.simulate(allInputs)

		const deltas = this.simulator.getDeltas()

		for (const liaison of this.liaisons) {
			liaison.queue
		}
	}

	makeTicker(hz: number) {
		return new Ticker(hz, () => this.tick())
	}
}

