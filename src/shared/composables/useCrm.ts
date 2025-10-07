import { useSettings } from "@features/settings/composables/useSettings";

export const useCrm = () => {
	const { crmEndpointUrl, crmDealPath, crmLeadPath } = useSettings();

	const getDealUrl = (id: number) => {
		return crmEndpointUrl + crmDealPath + id;
	};

	const getLeadUrl = (id: number) => {
		return crmEndpointUrl + crmLeadPath + id;
	};

	return {
		getDealUrl,
		getLeadUrl
	};
};
