
import {Liaison} from "./liaison.js"
import {Simulator} from "./simulator.js"
import {Ticker} from "../tools/ticker.js"
import {isInputDispatch} from "./utils/is-input-dispatch.js"
import {AuthorId, InputTelegram, Schema, Telegram} from "./types.js"

export class Authority<xSchema extends Schema> {
	constructor(
		public authorId: AuthorId,
		public simulator: Simulator<xSchema>,
		public liaisons: Set<Liaison<Telegram<xSchema>[]>>,
	) {}

	tick() {
		const inputTelegrams = this.#collectInputTelegrams()
		const delta = this.simulator.simulate(inputTelegrams)

		const broadcast: Telegram<xSchema>[] = [
			...inputTelegrams,
			[this.authorId, [["delta", delta]]],
		]

		for (const liaison of this.liaisons) {
			const telegrams: Telegram<xSchema>[] = []
			for (const [authorId, dispatches] of broadcast)
				telegrams.push([authorId, dispatches.filter(dispatch => this.simulator.isRelevant(dispatch, liaison.authorId))])
			liaison.queue(telegrams)
		}
	}

	makeTicker(hz: number) {
		return new Ticker(hz, () => this.tick())
	}

	#collectInputTelegrams() {
		const telegrams: InputTelegram<xSchema>[] = []
		for (const liaison of this.liaisons)
			liaison.recv().flat()
				.map(([_, dispatches]) => [

					// overwrite author id to prevent spoofing
					liaison.authorId,

					// filter for inputs
					dispatches.filter(isInputDispatch),

				] as InputTelegram<xSchema>)
				.forEach(t => telegrams.push(t))
		return telegrams
	}
}

