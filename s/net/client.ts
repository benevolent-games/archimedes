
import {Sparrow, SparrowJoin} from "sparrow-rtc"

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
			invite: string
			pastSimulator: xSimulator
			futureSimulator: xSimulator
		}) {

		const sparrow = await Sparrow.join({
			invite: options.invite,
			disconnected: () => console.log(`disconnected from host`),
		})

		const fibers = Netfibers.forCable(sparrow.connection.cable)
		const metaRpc = new FiberRpc<MetaApi["host"]>(fibers.sub.meta, endpoint(makeMetaClientApi()))
		const metaRemote = metaRpc.remote as MetaApi["host"]

		const {hostAuthorId, clientAuthorId} = await metaRemote.hello()
		const liaison = new Liaison<Telegram<any>[]>(hostAuthorId, fibers.sub.primary)

		const speculator = new Speculator(
			clientAuthorId,
			liaison,
			options.pastSimulator,
			options.futureSimulator,
			options.hz,
		)

		return new this(sparrow, speculator, fibers.sub.userland)
	}

	constructor(
		public sparrow: SparrowJoin,
		public speculator: Speculator<InferSimulatorSchema<xSimulator>>,
		public userland: Fiber,
	) {}
}

