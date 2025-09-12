import type { Equipment, EquipmentItem, Room } from "../types";
import { useSettings } from "@/features/settings/composables/useSettings";

type Radiator = EquipmentItem & {
	power: number;
};

export default (equipments: EquipmentItem[]) => {
	const { radiatorCategory, powerProperty, deltaPower } = useSettings();

	let radiators: Radiator[] = [];

	if (equipments.length > 0) {
		radiators = equipments
			.filter((equipment) =>
				Array.isArray(radiatorCategory)
					? radiatorCategory.includes(equipment.category)
					: equipment.category === radiatorCategory
			)
			.map((equipment) => {
				let power = Number(
					equipment.properties?.find((property) => property.key === powerProperty)?.value || 0
				);
				if (power === 0 || equipment.price === 0) {
					return null;
				}

				return {
					...equipment,
					power: power,
				};
			})
			.filter((equipment) => equipment !== null);
	}

	const effectiveRadiator = (
		heatLoss: number,
		radiators: Radiator[]
	): (Radiator & { quantity: number; effectivePower: number }) | null => {
		if (heatLoss === 0 || radiators.length === 0) {
			return null;
		}

		const calculatedRadiators = radiators.map((radiator) => {
			const quantity = Math.max(1, Math.ceil(heatLoss / radiator.power));
			return {
				...radiator,
				quantity: (quantity - 1) || 1,
				effectivePower: (radiator.price * quantity) / heatLoss,
			};
		});

		return calculatedRadiators.sort((b, a) => a.effectivePower - b.effectivePower).pop() || null;
	};

	return {
		equip: (room: Room, prevEquip: Equipment[]) => {
			if (!radiators || radiators.length === 0 || !room || (room?.baseHeat || 0) > room.heatLoss) {
				return prevEquip;
			}

			let heatLoss = room.heatLoss - (room.baseHeat || 0);

			do {
				const radiator = effectiveRadiator(heatLoss, radiators);

				if (!radiator) {
					return prevEquip;
				}

				prevEquip.push({
					id: radiator.id,
					name: radiator.name,
					quantity: radiator.quantity || 1,
					price: radiator.price,
					power: radiator.power,
					article: radiator?.article || "",
				});

				heatLoss -= radiator.power * radiator.quantity;
			} while (heatLoss > room.heatLoss * deltaPower);

			return prevEquip;
		},
	};
};
