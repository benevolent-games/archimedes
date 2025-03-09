
import {Map2} from "@benev/slate"
import {Entity} from "./entity.js"
import {Assembly} from "./assembly.js"
import {SystemFn, UnknownComponents} from "./types.js"

export class System {
	#cacheMap = new Map2<number, Entity>()
	#cacheArray: Entity[] = []

	constructor(
		public label: string,
		public keys: any[],
		public keysOptional: any[],
		public fn: SystemFn<any, any, any, any>,
	) {}

	execute(assembly: Assembly<any, any>) {
		this.fn(this.#cacheArray, assembly)
	}

	cacheUpdate(id: number, entity: Entity) {
		if (this.#matching(entity)) this.#cacheMap.set(id, entity)
		else this.#cacheMap.delete(id)
		this.#cacheArray = [...this.#cacheMap.values()]
	}

	cacheDelete(id: number) {
		this.#cacheMap.delete(id)
		this.#cacheArray = [...this.#cacheMap.values()]
	}

	#matching(entity: UnknownComponents) {
		return this.keys.every(requiredKey => requiredKey in entity.components)
	}
}

