
import {Map2} from "@benev/slate"
import {Sparrow, SparrowHost} from "sparrow-rtc"

import {Seat} from "./utils/seat.js"
import {HostOn} from "./utils/host-on.js"
import {Liaison} from "../core/liaison.js"
import {Netfibers} from "./parts/netfibers.js"
import {Authority} from "../core/authority.js"
import {Simulator} from "../core/simulator.js"
import {AuthorId, InferSimulatorSchema, Telegram} from "../core/types.js"
import {Hub} from "./parts/hub.js"

export class Host<xSimulator extends Simulator<any>> {
	static async make<xSimulator extends Simulator<any>>(options: {
			hub: Hub
			simulator: xSimulator,
		}) {

		const authority = new Authority(options.simulator)
		const seats = new Map2<AuthorId, Seat>()
		const on = new HostOn()

		options.hub.onConnected(fibers => {
			const authorId = authority.idCounter.next()
			console.log(`client connected: ${authorId}`)

			const liaison = new Liaison<Telegram<any>[]>(authorId, fibers.sub.primary)
			authority.liaisons.add(liaison)
			liaison.send([authority.getStateTelegram()])

			const seat = new Seat(liaison, fibers.sub.userland)
			seats.set(authorId, seat)
			on.seated.publish(seat)

			return () => {
				authority.liaisons.delete(liaison)
				on.unseated.publish(seat)
				console.log(`client disconnected: ${authorId}`)
			}
		})


			// closed: () => console.warn(`connection to sparrow signaller has died`),
		return new this(sparrow, authority, seats, on)
	}

	constructor(
		public sparrow: SparrowHost,
		public authority: Authority<InferSimulatorSchema<xSimulator>>,
		public seats: Map<AuthorId, Seat>,
		public on: HostOn,
	) {}
}

