
import {Schema} from "./types.js"

export abstract class Simulator<xSchema extends Schema> {
	constructor(public state: xSchema["state"]) {}
	abstract simulate(inputs: xSchema["input"][]): xSchema["delta"][]
}

