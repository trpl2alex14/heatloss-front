import type { Rule } from "../types";
import { type Ref, computed } from "vue";

import regulatorSimpl from "../rules/regulatorSimpl";
import radiatorLowPrice from "../rules/radiatorLowPrice";
import regulatorWiFi from "../rules/regulatorWiFi";
import radiatorForWindow from "../rules/radiatorForWindow";
import { useSettings } from "@/features/settings/composables/useSettings";

const defaultRulse: Rule[] = [
	//radiatorLowPrice,	
];

const { needRemoteControlTag, needForWindowTag } = useSettings();

export const useEquipRules = (tags: Ref<string[]>) => {
	
	return computed(() => {
		const rules = [];

		rules.push(...defaultRulse);

		if(tags.value.includes(needForWindowTag)) {
			rules.push(radiatorForWindow);
		}else{
			rules.push(radiatorLowPrice);
		}

		if(tags.value.includes(needRemoteControlTag)) {
			rules.push(regulatorWiFi);			
		}else{
			rules.push(regulatorSimpl);
		}

		return rules;
	});
};