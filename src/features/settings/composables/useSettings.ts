export const useSettings = () => {

	return {
		comfortTemp: 23,
		freezeTemp: 5,
		powerPrice: 3.6,
		tagsForTitle: ['дом', 'квартира', 'ком. объект'],

		deltaPower: 0.02,
		powerProperty: 'power',
		maxPowerProperty: 'max_power', //терморегуляторы

		regulatorCategory: 'Терморегулятор',
		radiatorCategory: ['Конвекторы', 'Радиаторы'],
	};
}