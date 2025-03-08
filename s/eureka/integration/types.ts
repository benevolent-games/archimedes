
import {Components, EntityId, AnyEntityEntry} from "../parts/types.js"

export type InputEntry = [EntityId, unknown[]]

export type DeltaUpdate<C extends Components = any> = ["update", AnyEntityEntry<C>]
export type DeltaDelete = ["delete", EntityId]
export type Delta<C extends Components> = DeltaUpdate<C> | DeltaDelete

export type EurekaSchema<C extends Components> = {
	state: AnyEntityEntry<C>[]
	delta: Delta<C>[]
	input: InputEntry[]
}

