
import {Suite} from "cynic"
import eurekaTest from "./eureka/testing/eureka.test.js"
import parcelsTest from "./core/parts/parcels/parcels.test.js"

export default <Suite>{
	parcelsTest,
	eurekaTest,
}

