
import {Map2} from "@benev/slate"

import {Hub} from "./parts/hub.js"
import {Seat} from "./parts/seat.js"
import {HostOn} from "./parts/host-on.js"
import {Liaison} from "../core/liaison.js"
import {Authority} from "../core/authority.js"
import {Simulator} from "../core/simulator.js"
import {AuthorId, InferSimulatorSchema, Telegram} from "../core/types.js"

export class Host<xSimulator extends Simulator<any>> {
	static async make<xSimulator extends Simulator<any>>(options: {
			hub: Hub
			simulator: xSimulator,
		}) {

		const authority = new Authority(options.simulator)
		const seats = new Map2<AuthorId, Seat>()
		const on = new HostOn()

		options.hub.onSpoke(spoke => {
			const authorId = authority.idCounter.next()
			console.log(`client connected: ${authorId}`)

			const liaison = new Liaison<Telegram<any>[]>(authorId, spoke.fibers.sub.primary)
			authority.liaisons.add(liaison)
			liaison.send([authority.getStateTelegram()])

			const seat = new Seat(liaison, spoke.fibers.sub.userland)
			seats.set(authorId, seat)
			on.seated.publish(seat)

			return () => {
				authority.liaisons.delete(liaison)
				on.unseated.publish(seat)
				console.log(`client disconnected: ${authorId}`)
			}
		})

		return new this(authority, seats, on)
	}

	constructor(
		public authority: Authority<InferSimulatorSchema<xSimulator>>,
		public seats: Map<AuthorId, Seat>,
		public on: HostOn,
	) {}
}

