import {Map2} from "@benev/slate"
import {IdCounter} from "../tools/id-counter.js"

export type Components = Record<string, any>
export type EntityId = number
export type UnknownEntity<C extends Components> = Partial<C>
export type UnknownEntityEntry<C extends Components> = [EntityId, UnknownEntity<C>]

export type Entity<C extends Components, K extends keyof C> = {[X in K]: C[X]}
export type EntityEntry<C extends Components, K extends keyof C> = [EntityId, Entity<C, K>]

export type SystemFn<C extends Components, K extends keyof C> = (entities: EntityEntry<C, K>[], assembly: Assembly<C>) => void

export class Assembly<C extends Components> {
	#counter = new IdCounter()
	#entities = new Map2<number, UnknownEntity<C>>()

	constructor(private systems: System[]) {}

	execute() {
		for (const system of this.systems)
			system.execute(this)
	}

	createEntity<E extends Partial<C>>(entity: E) {
		const id = this.#counter.next()
		this.#entities.set(id, entity)
		for (const system of this.systems)
			system.entityUpdated(id, entity)
		return [id, entity] as [EntityId, E]
	}

	updateEntity<E extends Partial<C>>(id: EntityId, entity: E) {
		this.#entities.set(id, entity)
		for (const system of this.systems)
			system.entityUpdated(id, entity)
		return entity
	}

	deleteEntity(id: number) {
		this.#entities.delete(id)
		for (const system of this.systems)
			system.entityDeleted(id)
	}
}

export class System {
	#cache = new Map2<number, UnknownEntity<any>>()
	#cacheEntries: [number, UnknownEntity<any>][] = []

	constructor(
		public label: string,
		public keys: any[],
		public fn: SystemFn<any, any>,
	) {}

	execute(assembly: Assembly<any>) {
		this.fn(this.#cacheEntries, assembly)
	}

	entityUpdated(id: number, entity: UnknownEntity<any>) {
		if (this.#matching(entity)) this.#cache.set(id, entity)
		else this.#cache.delete(id)
		this.#cacheEntries = [...this.#cache]
	}

	entityDeleted(id: number) {
		this.#cache.delete(id)
		this.#cacheEntries = [...this.#cache]
	}

	#matching(entity: UnknownEntity<any>) {
		return this.keys.every(requiredKey => requiredKey in entity)
	}
}

export const Euclid = {
	system: <C extends Components>(label: string) => ({
		select: <K extends keyof C>(keys: K[]) => ({
			fn: (fn: SystemFn<C, K>) => new System(label, keys, fn),
		}),
	}),
}

// example
export type MyComponents = {
	health: number
	physical: {mass: number}
	spatial: {
		position: [number, number, number]
		rotation: [number, number, number, number]
	}
}

const physicsSystem = Euclid
	.system<MyComponents>("physics")
	.select(["physical", "spatial"])
	.fn((entities, assembly) => {
		for (const [id, entity] of entities) {
			entity.physical // the physical component
			entity.spatial // the spatial component
		}
	})

