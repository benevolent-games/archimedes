
import {Parcel} from "../types.js"

export class Nanny {
	biggest: number = -1

	removeDisorderly = ([id]: Parcel<any>) => {
		if (id <= this.biggest)
			return false
		this.biggest = id
		return true
	}
}

