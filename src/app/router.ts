import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from "vue-router";

interface RouteMeta {
	title: string;
	icon?: string;
	bottom?: boolean;
	hasSubMenu?: boolean;
}

interface IAppRoute {
	name: string;
	path: string;
	meta: RouteMeta;
}

export type AppRoute = IAppRoute & RouteRecordRaw;

// Используем import.meta.env.MODE для совместимости с Vite
const isDev = import.meta.env.MODE !== "production";

const routes = [
	{
		path: "/create",
		name: "CreateCalculation",
		meta: { title: "Создать расчёт", icon: "file-plus-2.svg" },
		component: () =>
			import("@features/calculations/view/CalculationPage.vue"),
	},
	{
		path: "/",
		redirect: "/calculations",
	},
	{
		path: "/calculations",
		name: "Calculations",
		meta: { title: "Расчёты", icon: "layout-list.svg" },
		component: () =>
			import("@features/calculations/view/CalculationsPage.vue"),
	},
	{
		path: "/requests",
		name: "Requests",
		meta: { title: "Заявки", icon: "mails.svg" },
		component: () =>
			import("@features/requests/components/RequestsPage.vue"),
	},
	{
		path: "/cases",
		name: "Cases",
		meta: { title: "Кейсы", icon: "book-open-check.svg" },
		component: () => import("@features/cases/components/CasesPage.vue"),
	},
	{
		path: "/directories",
		name: "Directories",
		meta: { title: "Справочники", icon: "database.svg", hasSubMenu: true },
		component: () => import("@features/directories/view/Layout.vue"),
		children: [
			{
				path: "",
				name: "DirectoriesIndex",
				redirect: "/directories/equipment",
			},
			{
				path: "equipment",
				name: "DirectoriesEquipment",
				meta: { title: "Оборудование", icon: "heater.svg" },
				component: () =>
					import("@features/directories/view/EquipmentPage.vue"),
			},
			{
				path: "materials",
				name: "DirectoriesMaterials",
				meta: { title: "Огр. конструкции", icon: "brick-wall.svg" },
				component: () =>
					import("@features/directories/view/MaterialsPage.vue"),
			},
			{
				path: "climate",
				name: "DirectoriesClimate",
				meta: { title: "Климатология", icon: "map-pinned.svg" },
				component: () =>
					import("@features/directories/view/ClimatePage.vue"),
			},
		],
	},
	{
		path: "/settings",
		name: "Settings",
		meta: { title: "Настройки", icon: "settings.svg", bottom: true },
		component: () =>
			import("@features/settings/components/SettingsPage.vue"),
	},
	...(isDev
		? [
				{
					path: "/ui-kit",
					name: "UiKit",
					meta: { title: "UI", icon: "settings.svg" },
					component: () => import("@/features/ui-kit/UiKitPage.vue"),
				},
		  ]
		: []),
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
