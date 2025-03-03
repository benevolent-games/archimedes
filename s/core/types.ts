
import {Simulator} from "./simulator.js"

export type AuthorId = number
export type Authored<Content> = [AuthorId, Content]

export type Schema = {
	state: any
	delta: any
	input: any
}

export type StateDispatch<State> = ["state", State]
export type DeltaDispatch<Delta> = ["delta", Delta]
export type InputDispatch<Input> = ["input", Input]

export type Dispatch<xSchema extends Schema> = (
	| StateDispatch<xSchema["state"]>
	| DeltaDispatch<xSchema["delta"]>
	| InputDispatch<xSchema["input"]>
)

export type Telegram<xSchema extends Schema> = Authored<Dispatch<xSchema>[]>
export type InputTelegram<xSchema extends Schema> = Authored<InputDispatch<xSchema["input"]>[]>

export type InferSimulatorSchema<S extends Simulator<any>> = (
	S extends Simulator<infer xSchema>
		? xSchema
		: never
)

