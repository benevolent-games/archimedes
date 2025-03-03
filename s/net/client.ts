
import Sparrow from "sparrow-rtc"
import {Liaison} from "../core/liaison.js"
import {endpoint} from "renraku/x/index.js"
import {CustomApi, MetaApi} from "./types.js"
import {FiberRpc} from "./parts/fiber-rpc.js"
import {Netfibers} from "./parts/netfibers.js"
import {Simulator} from "../core/simulator.js"
import {Speculator} from "../core/speculator.js"
import {AuthorId, Schema, Telegram} from "../core/types.js"
import {makeMetaClientApi} from "./meta/meta-client.js"

export class Client {
	static async make(options: {
			hz: number
			invite: string
			pastSimulator: Simulator<any>
			futureSimulator: Simulator<any>
		}) {

		const sparrow = await Sparrow.join({
			invite: options.invite,
			disconnected: () => console.log(`disconnected from host`),
		})

		const fibers = Netfibers.forCable(sparrow.connection.cable)
		const metaRpc = new FiberRpc<MetaApi["host"]>(fibers.virtual.meta, endpoint(makeMetaClientApi()))
		const metaRemote = metaRpc.remote as MetaApi["host"]

		const {hostAuthorId, clientAuthorId} = await metaRemote.hello()
		const liaison = new Liaison<Telegram<any>[]>(hostAuthorId, fibers.virtual.primary)

		const speculator = new Speculator(authorId)

		// send and receive data
		sparrow.connection.cable.reliable.send("world")
		sparrow.connection.cable.reliable.onmessage = m => console.log("received", m.data)
	}
}

