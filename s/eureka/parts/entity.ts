
import {Components, EntityId} from "./types.js"

export class Entity<C extends Components = Components> {
	constructor(
		public readonly id: EntityId,
		public components: C,
	) {}
}

