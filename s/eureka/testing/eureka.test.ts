
import {Suite, expect} from "cynic"
import {setupHealthSituation} from "./situations/health.js"

export default <Suite>{

	async "systems can execute on the right entities"() {
		const {assembly} = setupHealthSituation()
		const warrior = assembly.create({health: 100, bleeding: 1})
		const wizard = assembly.create({health: 100, mana: 0, manaRegen: 1})
		expect(warrior.components.health).equals(100)
		expect(wizard.components.health).equals(100)
		assembly.execute()
		expect(warrior.components.health).equals(99)
		expect(wizard.components.health).equals(100)
	},

	async "warrior can bleed out, gets deleted"() {
		const {assembly} = setupHealthSituation()
		const warrior = assembly.create({health: 2, bleeding: 1})
		expect(assembly.get(warrior.id)).ok()
		assembly.execute()
		expect(assembly.get(warrior.id)).ok()
		assembly.execute()
		expect(assembly.get(warrior.id)).not.ok()
	},
}

