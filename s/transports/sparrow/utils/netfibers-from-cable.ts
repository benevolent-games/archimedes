
import {StdCable} from "sparrow-rtc"
import {Netfibers} from "../../../session/parts/netfibers.js"

export function netfibersFromCable(cable: StdCable) {
	const netfibers = new Netfibers()
	netfibers.megafiber.entangleCable(cable)
	return netfibers
}

