
import Sparrow from "sparrow-rtc"
import {endpoint, Fns, JsonRpc} from "renraku"

import {CustomApi} from "./types.js"
import {Liaison} from "../core/liaison.js"
import {Fiber} from "../core/parts/fiber.js"
import {FiberRpc} from "./parts/fiber-api.js"
import {Authority} from "../core/authority.js"
import {AuthorId, Telegram} from "../core/types.js"

export class Host<Api extends CustomApi> {
	static async make<Api extends CustomApi>(
			authority: Authority<any>,
			customHostApi: (authorId: AuthorId) => Api["host"],
		) {

		const sparrow = await Sparrow.host({

			// accept people joining, send/receive some data
			welcome: prospect => connection => {
				const authorId = authority.idCounter.next()
				console.log(`client connected: ${authorId}`)

				const fibers = {
					tele: new Fiber(),
					custom: new Fiber(),
					meta: new Fiber<JsonRpc.Bidirectional>(),
				}
				const megafiber = Fiber.multiplex(fibers)
				megafiber.entangleCable(connection.cable)

				const fiberRpc = new FiberRpc(fibers.custom, endpoint(customHostApi(authorId)))
				const customRemote = fiberRpc.remote as Api["client"]

				const liaison = new Liaison<Telegram<any>[]>(authorId, fibers.tele)
				authority.liaisons.add(liaison)
				liaison.send([authority.getStateTelegram()])

				return () => {
					authority.liaisons.delete(liaison)
					console.log(`client disconnected: ${authorId}`)
				}
			},

			// lost connection to the sparrow signaller
			closed: () => console.warn(`connection to sparrow signaller has died`),
		})

		// anybody with this invite code can join
		sparrow.invite
			// "215fe776f758bc44"
	}
}

