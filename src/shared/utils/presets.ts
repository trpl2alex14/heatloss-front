import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

export const myStylePreset = definePreset(Aura, {
	components: {
		chip: {
			root: {
				borderRadius: "0.6rem",
				paddingY: "0.2rem",
			},
		},
	},
	semantic: {
		primary: {
			50: "{red.50}",
			100: "{red.100}",
			200: "{red.200}",
			300: "{red.300}",
			400: "{red.400}",
			500: "{red.500}",
			600: "{red.600}",
			700: "{red.700}",
			800: "{red.800}",
			900: "{red.900}",
			950: "{red.950}",
		},
		colorScheme: {
			light: {
				primary: {
					color: "#E70111",
					inverseColor: "#ffffff",
					hoverColor: "#af0410",
					activeColor: "#ed0314",
				},
			},
		},
	},
});
