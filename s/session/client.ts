
import {MetaApi} from "./types.js"
import {Liaison} from "../core/liaison.js"
import {endpoint} from "renraku/x/index.js"
import {Fiber} from "../core/parts/fiber.js"
import {FiberRpc} from "./parts/fiber-rpc.js"
import {Netfibers} from "./parts/netfibers.js"
import {Simulator} from "../core/simulator.js"
import {Speculator} from "../core/speculator.js"
import {makeMetaClientApi} from "./meta/meta-client.js"
import {InferSimulatorSchema, Telegram} from "../core/types.js"

export class Client<xSimulator extends Simulator<any>> {
	static async make<xSimulator extends Simulator<any>>(options: {
			hz: number
			fibers: Netfibers
			pastSimulator: xSimulator
			futureSimulator: xSimulator
		}) {

		const meta = new FiberRpc<MetaApi["host"]>(
			options.fibers.sub.meta,
			endpoint(makeMetaClientApi()),
		).remote as MetaApi["host"]

		const {hostAuthorId, clientAuthorId} = await meta.hello()
		const liaison = new Liaison<Telegram<any>[]>(hostAuthorId, options.fibers.sub.primary)

		const speculator = new Speculator(
			clientAuthorId,
			liaison,
			options.pastSimulator,
			options.futureSimulator,
			options.hz,
		)

		return new this(speculator, options.fibers.sub.userland)
	}

	constructor(
		public speculator: Speculator<InferSimulatorSchema<xSimulator>>,
		public userland: Fiber,
	) {}
}

