import type { EquipmentItem } from "../types";
import { useSettings } from "@features/settings/composables/useSettings";
import regulatorSimpl from "./regulatorSimpl";

export default (equipments: EquipmentItem[]) => {
	const {  wifiTag } = useSettings();

    const filteredEquipments = equipments.filter((equipment) => equipment.tags.includes(wifiTag));

	return {
		...regulatorSimpl(filteredEquipments)
	};
};
