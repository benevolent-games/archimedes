
import {Schema} from "./types.js"
import {Liaison} from "./liaison.js"
import {Simulator} from "./simulator.js"
import {Ticker} from "../tools/ticker.js"

export class Authority<xSchema extends Schema> {
	ticker: Ticker

	constructor(
			public simulator: Simulator<xSchema>,
			public liaisons: Set<Liaison<xSchema>>,
		) {

		this.ticker = new Ticker(60, () => {
			const allInputs: xSchema["input"][] = []

			for (const liaison of this.liaisons)
				allInputs.push(...liaison.takeInputs())

			// this.simulator.simulate(inputs)
		})
	}

	run() {}
}

