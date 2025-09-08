import type { Equipment, EquipmentItem, Room } from "../types";
import { useSettings } from "@/features/settings/composables/useSettings";
import radiatorLowPrice from "./radiatorLowPrice";

export default (equipments: EquipmentItem[]) => {
	const { excludeForWindow } = useSettings();

	const filteredEquipments = equipments.filter(
		(equipment) => !equipment.tags.some((tag) => excludeForWindow.includes(tag))
	);

	const baseRule = radiatorLowPrice(filteredEquipments);

	return {
		equip: (room: Room, prevEquip: Equipment[]) => {
			const windowCount =
				room.roomConstructions
					.filter((construction) => construction.enabled)
					.reduce((acc, construction) => acc + (construction?.count || 0), 0) || 1;

			const modifyRoom = {
				...room,
				heatLoss: room.heatLoss / windowCount,
			};

			const result = baseRule.equip(modifyRoom, prevEquip);
			return result.map((equipment) => ({
				...equipment,
				quantity: equipment.quantity * windowCount,
			}));
		},
	};
};
