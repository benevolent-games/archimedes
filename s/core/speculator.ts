
import {Schema} from "./types.js"
import {Liaison} from "./liaison.js"
import {Simulator} from "./simulator.js"

export class Speculator<xSchema extends Schema> {
	constructor(
		public liaison: Liaison<xSchema>,
		public grounded: Simulator<xSchema>,
		public forecast: Simulator<xSchema>,
	) {}

	run() {}
}

