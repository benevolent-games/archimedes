
import {AuthorId, Schema, Telegram} from "./types.js"
import {handleTelegrams} from "./utils/handle-telegrams.js"

export abstract class Simulator<xSchema extends Schema> {
	static handleTelegrams = handleTelegrams
	constructor(public state: xSchema["state"]) {}
	abstract simulate(telegrams: Telegram<xSchema>[]): xSchema["delta"]
	abstract tailor(authorId: AuthorId, telegrams: Telegram<xSchema>[]): Telegram<xSchema>[]
}

