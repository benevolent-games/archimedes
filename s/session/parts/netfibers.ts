
import {JsonRpc} from "renraku"
import {Sparrow, StdCable} from "sparrow-rtc"
import {Fiber} from "../../core/parts/fiber.js"

export class Netfibers {
	static async sparrowJoin(options: {invite: string, disconnected: () => void}) {
		const sparrow = await Sparrow.join({
			invite: options.invite,
			disconnected: options.disconnected,
		})
		const fibers = Netfibers.forCable(sparrow.connection.cable)
		return {sparrow, fibers}
	}

	static forCable(cable: StdCable) {
		const netfibers = new this()
		netfibers.megafiber.entangleCable(cable)
		return netfibers
	}

	sub = {
		primary: new Fiber(),
		userland: new Fiber(),
		meta: new Fiber<JsonRpc.Bidirectional>(),
	}

	megafiber = Fiber.multiplex(this.sub)
}

