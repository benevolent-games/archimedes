
import {Seat} from "./seat.js"
import {pubsub} from "@benev/slate"

export class ClientOn {
	disconnected = pubsub<[Seat]>()
}

