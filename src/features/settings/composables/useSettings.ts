export const useSettings = () => {

	return {
		comfortTemp: 23,
		freezeTemp: 5,
		powerPrice: 3.6,
		tagsForTitle: ['дом', 'квартира', 'ком. объект'],

		seasonTag: 'весна и осень',
		frostProtectionTag: 'защита от промерзания',

		allowedTags: ['дом', 'квартира', 'ком. объект', 'весна и осень', 'защита от промерзания', 
			'дистанционное управление', 'окраска по ral'],

		deltaPower: 0.02, //допустимое отклонение мощности
		powerProperty: 'power',
		maxPowerProperty: 'max_power', //терморегуляторы

		regulatorCategory: 'Терморегулятор',
		radiatorCategory: ['Конвекторы', 'Радиаторы'],

		needRemoteControlTag: 'дистанционное управление',
		wifiTag: 'wifi',

		needForWindowTag: 'для окон',
		excludeForWindow: ['вертикальный'],

		isMansardaTag: "мансарда",

		crmEndpointUrl: "https://kouzi.bitrix24.ru/crm/",
		crmLeadPath: "lead/details/",
		crmDealPath: "deal/details/"
	};
}