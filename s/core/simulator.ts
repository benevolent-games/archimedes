
import {handleTelegrams} from "./utils/handle-telegrams.js"
import {AuthorId, Dispatch, Schema, Telegram} from "./types.js"

export abstract class Simulator<xSchema extends Schema> {
	static handle = handleTelegrams
	constructor(public state: xSchema["state"]) {}
	abstract simulate(telegrams: Telegram<xSchema>[]): xSchema["delta"]
	abstract isRelevant(dispatch: Dispatch<xSchema>, authorId: AuthorId): boolean
}

