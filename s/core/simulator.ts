
import {AuthorId, Dispatch, Schema, Telegram} from "./types.js"

export abstract class Simulator<xSchema extends Schema> {
	constructor(public state: xSchema["state"]) {}
	abstract simulate(telegrams: Telegram<xSchema>[]): xSchema["delta"]
	abstract isRelevant(dispatch: Dispatch<xSchema>, authorId: AuthorId): boolean
}

