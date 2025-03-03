
import {JsonRpc} from "renraku"
import {StdCable} from "sparrow-rtc"
import {Fiber} from "../../core/parts/fiber.js"

export class Netfibers {
	static forCable(cable: StdCable) {
		const netfibers = new this()
		netfibers.megafiber.entangleCable(cable)
		return netfibers
	}

	virtual = {
		primary: new Fiber(),
		userland: new Fiber(),
		meta: new Fiber<JsonRpc.Bidirectional>(),
	}

	megafiber = Fiber.multiplex(this.virtual)
}

