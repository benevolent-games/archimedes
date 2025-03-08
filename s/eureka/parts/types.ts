
import {Assembly} from "./assembly.js"

export type Components = Record<string, any>
export type EntityId = number

export type AnyEntity<C extends Components> = Partial<C>
export type AnyEntityEntry<C extends Components> = [EntityId, AnyEntity<C>]

export type SelectEntity<C extends Components, K extends keyof C> = {[X in K]: C[X]}
export type SelectedEntityEntry<C extends Components, K extends keyof C> = [EntityId, SelectEntity<C, K>]

export type SystemFn<Context, C extends Components, K extends keyof C> = (
	(entities: SelectedEntityEntry<C, K>[], assembly: Assembly<Context, C>) => void
)

