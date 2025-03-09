
import {Components, EntityId, PartialEntityEntry} from "../parts/types.js"

export type InputEntry = [EntityId, unknown[]]

export type DeltaUpdate<C extends Components = any> = ["update", PartialEntityEntry<C>]
export type DeltaDelete = ["delete", EntityId]
export type Delta<C extends Components> = DeltaUpdate<C> | DeltaDelete

export type EurekaSchema<C extends Components> = {
	state: PartialEntityEntry<C>[]
	delta: Delta<C>[]
	input: InputEntry[]
}

