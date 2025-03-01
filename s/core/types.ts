
import {Ping, Pong} from "./utils/pingponger.js"

export type Input<Payload = any> = {authorId: string, payload: Payload}

export type Schema = {
	state: any
	delta: any
	input: Input
}

export type StateMessage = ["state", any]
export type DeltasMessage = ["deltas", any]
export type InputsMessage = ["inputs", Input]
export type GameMessage = Ping | Pong | StateMessage | DeltasMessage | InputsMessage

