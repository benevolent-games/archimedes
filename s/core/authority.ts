
import {Liaison} from "./liaison.js"
import {Simulator} from "./simulator.js"
import {Ticker} from "../tools/ticker.js"
import {IdCounter} from "../tools/id-counter.js"
import {InputTelegram, Schema, StateDispatch, Telegram} from "./types.js"
import {isInputDispatch} from "./utils/is-input-dispatch.js"

export class Authority<xSchema extends Schema> {
	idCounter = new IdCounter()
	liaisons = new Set<Liaison<Telegram<xSchema>[]>>()
	authorId = this.idCounter.next()

	constructor(public simulator: Simulator<xSchema>) {}

	tick() {
		const inputTelegrams = this.#collectInputTelegrams()
		const delta = this.simulator.simulate(inputTelegrams)

		const broadcast: Telegram<xSchema>[] = [
			...inputTelegrams,
			[this.authorId, [["delta", delta]]],
		]

		for (const liaison of this.liaisons) {
			const relevantTelegrams = this.simulator.tailor(liaison.authorId, structuredClone(broadcast))
			liaison.queue(relevantTelegrams)
		}
	}

	makeTicker(hz: number) {
		return new Ticker(hz, () => this.tick())
	}

	getStateTelegram(): Telegram<xSchema> {
		const dispatch: StateDispatch<xSchema> = ["state", this.simulator.state]
		return [this.authorId, [dispatch]]
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

