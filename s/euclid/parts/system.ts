
import {Map2} from "@benev/slate"
import {Assembly} from "./assembly.js"
import {SystemFn, AnyEntity} from "./types.js"

export class System {
	#cache = new Map2<number, AnyEntity<any>>()
	#cacheEntries: [number, AnyEntity<any>][] = []

	constructor(
		public label: string,
		public keys: any[],
		public fn: SystemFn<any, any, any>,
	) {}

	execute(assembly: Assembly<any, any>) {
		this.fn(this.#cacheEntries, assembly)
	}

	cacheUpdate(id: number, entity: AnyEntity<any>) {
		if (this.#matching(entity)) this.#cache.set(id, entity)
		else this.#cache.delete(id)
		this.#cacheEntries = [...this.#cache]
	}

	cacheDelete(id: number) {
		this.#cache.delete(id)
		this.#cacheEntries = [...this.#cache]
	}

	#matching(entity: AnyEntity<any>) {
		return this.keys.every(requiredKey => requiredKey in entity)
	}
}

