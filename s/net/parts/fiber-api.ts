
import {Fiber} from "../../core/parts/fiber.js"
import {Bidirectional, Endpoint, Fns, JsonRpc, Remote, remote} from "renraku"

export class FiberRpc<RemoteFns extends Fns> {
	remote: Remote<RemoteFns>
	dispose: () => void

	#bidirectional: Bidirectional

	constructor(public fiber: Fiber<JsonRpc.Bidirectional>, localEndpoint: Endpoint) {
		this.#bidirectional = new Bidirectional({
			timeout: 60_000,
			onSend: outgoing => fiber.reliable.send(outgoing),
		})
		this.dispose = fiber.reliable.recv.on(incoming => this.#bidirectional.receive(localEndpoint, incoming))
		this.remote = remote(this.#bidirectional.remoteEndpoint)
	}
}

