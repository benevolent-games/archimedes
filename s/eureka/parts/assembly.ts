
import {Map2, pubsub} from "@benev/slate"
import {System} from "./system.js"
import {IdCounter} from "../../tools/id-counter.js"
import {Components, EntityId, AnyEntity, AnyEntityEntry} from "./types.js"

export class Assembly<Context, C extends Components> {
	created = pubsub<[AnyEntityEntry<C>]>()
	updated = pubsub<[AnyEntityEntry<C>]>()
	deleted = pubsub<[EntityId]>()

	#counter = new IdCounter()
	#entities = new Map2<number, AnyEntity<C>>()

	constructor(public context: Context, private systems: System[]) {}

	overwriteAll(entries: AnyEntityEntry<C>[]) {
		this.#entities.clear()
		for (const [id, entity] of entries)
			this.#entities.set(id, entity)
	}

	execute() {
		for (const system of this.systems)
			system.execute(this)
	}

	get<E extends Partial<E>>(id: number) {
		return this.#entities.get(id) as E | undefined
	}

	require<E extends Partial<E>>(id: number) {
		return this.#entities.require(id) as unknown as E
	}

	create<E extends Partial<C>>(entity: E) {
		const id = this.#counter.next()
		this.#entities.set(id, entity)
		for (const system of this.systems)
			system.cacheUpdate(id, entity)
		const entry = [id, entity] as [EntityId, E]
		this.created.publish(entry)
		return id
	}

	update<E extends Partial<C>>(id: EntityId, entity: E) {
		this.#entities.set(id, entity)
		for (const system of this.systems)
			system.cacheUpdate(id, entity)
		this.updated.publish([id, entity])
		return id
	}

	delete(id: number) {
		this.#entities.delete(id)
		for (const system of this.systems)
			system.cacheDelete(id)
		this.deleted.publish(id)
	}
}

