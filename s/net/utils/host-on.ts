
import {Seat} from "./seat.js"
import {pubsub} from "@benev/slate"

export class HostOn {
	seated = pubsub<[Seat]>()
	unseated = pubsub<[Seat]>()
}

