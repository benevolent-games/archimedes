
import {EuclideanSchema} from "./types.js"
import {Components} from "../parts/types.js"
import {EuclideanContext} from "./context.js"
import {Assembly} from "../parts/assembly.js"
import {Simulator} from "../../core/simulator.js"
import {AuthorId, Telegram} from "../../core/types.js"

export class EuclideanSimulator
	<xContext extends EuclideanContext, C extends Components>
	extends Simulator<EuclideanSchema<C>> {

	#deltas: EuclideanSchema<C>["delta"] = []

	constructor(
			public authorityId: AuthorId,
			public assembly: Assembly<xContext, C>,
			state: EuclideanSchema<C>["state"],
		) {
		super(state)
		assembly.created(entry => void this.#deltas.push(["update", entry]))
		assembly.updated(entry => void this.#deltas.push(["update", entry]))
		assembly.deleted(id => void this.#deltas.push(["delete", id]))
	}

	simulate(telegrams: Telegram<EuclideanSchema<C>>[]): EuclideanSchema<C>["delta"] {
		this.#deltas = []

		Simulator.handleTelegrams(telegrams, {
			input: (inputs) => {
				this.assembly.context.inputs.add(inputs)
			},

			state: (state, authorId) => {
				if (authorId === this.authorityId)
					this.assembly.overwriteAll(state)
			},

			delta: (deltas, authorId) => {
				if (authorId === this.authorityId)
					return undefined
				for (const [kind, payload] of deltas) {
					if (kind === "update") {
						const [id, entity] = payload
						this.assembly.update(id, entity)
					}
					else {
						const id = payload
						this.assembly.delete(id)
					}
				}
			},
		})

		this.assembly.execute()
		return this.#deltas
	}

	tailor(authorId: AuthorId, telegrams: Telegram<EuclideanSchema<C>>[]): Telegram<EuclideanSchema<C>>[] {
		return []
	}
}

