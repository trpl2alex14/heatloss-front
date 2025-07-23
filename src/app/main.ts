import "@styles/style.css";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { myStylePreset } from "@shared/utils/presets";

createApp(App)
	.use(router)
	.use(PrimeVue, { theme: { preset: myStylePreset } })
	.mount("#app");
