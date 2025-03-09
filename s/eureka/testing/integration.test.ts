
import {Suite, expect} from "cynic"
import {setupIntegrationSituation} from "./situations/integration.js"

export default <Suite>{

	async "we host a game, we join it"() {
		const integration = setupIntegrationSituation()
		// TODO establish an archimedes loopback that is
	},
}

