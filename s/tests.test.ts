
import "@benev/slate/x/node.js"

import {Suite} from "cynic"
import eureka from "./eureka/testing/eureka.test.js"
import parcels from "./core/parts/parcels/parcels.test.js"

export default <Suite>{
	eureka,
	archimedes: {
		parcels,
	},
}

