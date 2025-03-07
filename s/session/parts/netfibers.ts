
import {JsonRpc} from "renraku"
import {Fiber} from "../../core/parts/fiber.js"

export class Netfibers {
	sub = {
		primary: new Fiber(),
		userland: new Fiber(),
		meta: new Fiber<JsonRpc.Bidirectional>(),
	}

	megafiber = Fiber.multiplex(this.sub)
}

