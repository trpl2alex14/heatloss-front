import "@styles/style.css";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { myStylePreset } from "@shared/utils/presets";
import ConfirmationService from 'primevue/confirmationservice';

createApp(App)
	.use(router)
	.use(ConfirmationService)
	.use(PrimeVue, { 
		locale: {
			clear: "Очистить",
			today: "Сегодня",
			monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
			monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
			dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],			
			dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],			
			dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],			
		},
		theme: { preset: myStylePreset } 
	})
	.mount("#app");
