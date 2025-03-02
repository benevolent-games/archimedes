
import {Schema} from "./types.js"

export abstract class Simulator<xSchema extends Schema> {
	constructor(public state: xSchema["state"]) {}
	abstract simulate(inputs: xSchema["input"][]): void
	abstract getDeltas(): xSchema["delta"][] | undefined
}

