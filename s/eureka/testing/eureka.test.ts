
import {Suite, expect} from "cynic"
import {setupHealthSituation} from "./situations/health.js"

export default <Suite>{

	async "systems can execute on the entities we want"() {
		const {assembly} = setupHealthSituation()
		const mortalId = assembly.create({health: 100, bleeding: 1})
		const wizardId = assembly.create({mana: 100, manaRegen: 1})
		assembly.execute()
		expect(assembly.require(mortalId))
	},
}

