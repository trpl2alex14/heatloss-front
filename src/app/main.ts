import Aura from "@primeuix/themes/aura";
import "@styles/style.css";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App)
	.use(router)
	.use(PrimeVue, { theme: { preset: Aura } })
	.mount("#app");
