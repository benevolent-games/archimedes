
import {Sparrow} from "sparrow-rtc"
import {Hub} from "../../session/parts/hub.js"
import {Spoke} from "../../session/parts/spoke.js"
import {Netfibers} from "../../session/parts/netfibers.js"
import {netfibersFromCable} from "./utils/netfibers-from-cable.js"

export async function sparrowHub(options: {
		closed: () => void
		connected: (netfibers: Netfibers) => () => void
	}) {

	const hub = new Hub()

	const sparrow = await Sparrow.host({
		closed: options.closed,
		welcome: _prospect => connection => {
			const fibers = netfibersFromCable(connection.cable)
			const disconnect = () => connection.disconnect()
			const spoke = new Spoke(fibers, disconnect)
			return hub.invoke(spoke)
		},
	})

	return {sparrow, hub}
}

