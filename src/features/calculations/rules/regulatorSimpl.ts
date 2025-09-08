import type { Equipment, EquipmentItem, Room } from "../types";
import { useSettings } from "@/features/settings/composables/useSettings";

export default (equipments: EquipmentItem[]) => {
	const { regulatorCategory, maxPowerProperty } = useSettings();

	let equipment = null;

	if (equipments.length > 0) {
		equipment =
			equipments
				.filter((equipment) => equipment.category === regulatorCategory)
				.sort((a, b) => a.price - b.price)[0] || null;
	}

	return {
		equip: (room: Room, prevEquip: Equipment[]) => {
			if (!equipment || !room) {
				return prevEquip;
			}

			const maxPower =
				equipment.properties?.find(
					(property) => property.key === maxPowerProperty
				)?.value || 0;

			const roomPower =
				prevEquip?.reduce(
					(acc, curr) =>
						acc + (curr.power || 0) * (curr.quantity || 1),
					0
				) || 0;

			const quantity = maxPower ? Math.ceil(roomPower / +maxPower) : 1;

			if (quantity > 0) {
				prevEquip.push({
					id: equipment?.id || 0,
					name: equipment?.name || "",
					quantity: quantity,
					price: equipment?.price || 0,
				});
			}

			return prevEquip;
		},
	};
};
