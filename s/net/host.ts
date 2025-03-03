
import {Map2} from "@benev/slate"
import {Sparrow, SparrowHost} from "sparrow-rtc"

import {Seat} from "./utils/seat.js"
import {HostOn} from "./utils/host-on.js"
import {Liaison} from "../core/liaison.js"
import {Netfibers} from "./parts/netfibers.js"
import {Authority} from "../core/authority.js"
import {AuthorId, Telegram} from "../core/types.js"

export class Host<xAuthority extends Authority<any>> {
	static async make<xAuthority extends Authority<any>>(authority: xAuthority) {
		const seats = new Map2<AuthorId, Seat>()
		const on = new HostOn()

		const sparrow = await Sparrow.host({
			welcome: _prospect => connection => {
				const authorId = authority.idCounter.next()
				console.log(`client connected: ${authorId}`)

				const fibers = Netfibers.forCable(connection.cable)
				const liaison = new Liaison<Telegram<any>[]>(authorId, fibers.virtual.primary)
				authority.liaisons.add(liaison)
				liaison.send([authority.getStateTelegram()])

				const seat = new Seat(liaison, fibers.virtual.userland)
				seats.set(authorId, seat)
				on.seated.publish(seat)

				return () => {
					authority.liaisons.delete(liaison)
					on.unseated.publish(seat)
					console.log(`client disconnected: ${authorId}`)
				}
			},

			// lost connection to the sparrow signaller
			closed: () => console.warn(`connection to sparrow signaller has died`),
		})

		return new this(sparrow, authority, seats, on)
	}

	constructor(
		public sparrow: SparrowHost,
		public authority: xAuthority,
		public seats: Map<AuthorId, Seat>,
		public on: HostOn,
	) {}
}

