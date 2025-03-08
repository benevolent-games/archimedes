
import {setupEureka} from "../../eureka.js"

class MyContext {}

type MyComponents = {
	health: number
	bleeding: number
	mana: number
	manaRegen: number
}

export function setupHealthSituation() {
	const eureka = setupEureka<MyContext, MyComponents>()
	const assembly = eureka.assembly(new MyContext(), [
		eureka.system("bleeding")
			.select("health", "bleeding")
			.fn((entities, _assembly) => {
				for (const [,entity] of entities)
					entity.health -= entity.bleeding
			}),
		eureka.system("death")
			.select("health")
			.fn((entities, assembly) => {
				for (const [id, entity] of entities) {
					if (entity.health <= 0)
						assembly.delete(id)
				}
			}),
		eureka.system("mana regeneration")
			.select("mana", "manaRegen")
			.fn((entities, _assembly) => {
				for (const [,entity] of entities)
					entity.mana += entity.manaRegen
			}),
	])
	return {assembly}
}

