import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
	type RouteLocation
} from "vue-router";
import EmptyLayout from "@layouts/EmptyLayout.vue";

import MapIcon from "@assets/icons/map-pinned.svg";
import BrickIcon from "@assets/icons/brick-wall.svg";
import HeaterIcon from "@assets/icons/heater.svg";
import UserIcon from "@assets/icons/user-round.svg";
import PasswordIcon from "@assets/icons/key-round.svg";

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
	//API
	{
		name: 'api-request',
		//path: '/api/requests/:id'
		path: '/data/requests.1222.json?:id', //TODO
		redirect: '/'
	},
	{
		name: 'api-requests',
		//path: '/api/requests/:id'
		path: '/data/requests.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-case',
		//path: '/api/requests/:id'
		path: '/data/case.1.json?', //TODO
		redirect: '/'
	},
	{
		name: 'api-cases',
		//path: '/api/requests/:id'
		path: '/data/cases.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-calculation-status',
		//path: '/api/calculations/:id/status',  //TODO
		path: '/data/calculation.public.json?:id',
		redirect: '/'
	},
	{
		name: 'api-calculation',
		//path: '/api/calculations/:id',  //TODO
		path: '/data/calculations.111.json?:id?',
		redirect: '/'
	},
	{
		name: 'api-calculations',
		//path: '/api/calculations',  //TODO
		path: '/data/calculations.lazy.json',
		redirect: '/'
	},
	{
		name: 'api-equipments',
		path: '/data/equipments.api.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-promos',
		path: '/data/promos.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-tags',
		path: '/data/tags.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-directories-equipments',
		path: '/data/equipments.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-climate',
		path: '/data/climate.json?:id', //TODO
		redirect: '/'
	},
	{
		name: 'api-climate-create',
		path: '/data/climate.create.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-material',
		path: '/data/material.get.json?:id', //TODO
		redirect: '/'
	},
	{
		name: 'api-material-create',
		path: '/data/material.create.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-equipment',
		path: '/data/equipment.get.json?:id', //TODO
		redirect: '/'
	},
	{
		name: 'api-equipment-create',
		path: '/data/equipment.create.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-equipment-status',
		path: '/data/equipment.get.json?:id', //TODO
		redirect: '/'
	},
	{
		name: 'api-directories-climates',
		path: '/data/climates.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-directories-materials',
		path: '/data/materials.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-directories-surfaces',
		path: '/data/surfaces.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-directories-material-categories',
		path: '/data/categories.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-directories-equipment-categories',
		path: '/data/categories.equipments.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-profile',
		path: '/data/profile.json', //TODO
		redirect: '/'
	},
	{
		name: 'api-profile-update',
		path: '/data/profile.errors.json?:id', //TODO
		redirect: '/'
	},
	{
		name: 'api-password',
		path: '/data/password.errors.json', //TODO
		redirect: '/'
	},
	//PATH
	//ROUTES
	{
		path: "/",
		redirect: "/calculations",
	},
	{
		path: "/calculations/create",
		name: "calculation-create",
		meta: { title: "Создать расчёт", icon: "file-plus-2.svg" },
		component: () =>
			import("@features/calculations/view/CalculationPage.vue"),
	},
	{
		path: "/calculations",
		name: "calculations",
		meta: { title: "Расчёты", icon: "layout-list.svg" },
		component: () =>
			import("@features/calculations/view/CalculationsPage.vue"),
	},
	{
		path: "/calculations/:id",
		name: 'calculation',
		component: () =>
			import("@features/calculations/view/CalculationPage.vue"),
		children: [
			{
				name: 'calculation-view',
				path: 'view',
				redirect: (to:RouteLocation) => '/calculations/view/' + to.params.id  //TODO
			},
			{
				name: 'calculation-pdf',
				path: 'pdf',
				redirect: (to:RouteLocation) => '/calculations/pdf/' + to.params.id  //TODO
			},
		]
	},
	{
		path: "/history/:key",
		name: 'history',
		component: () =>
			import("@features/calculations/view/CalculationPage.vue"),
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
		path: "/cases/create",
		name: "case-create",
		component: () =>
			import("@features/cases/components/CasePage.vue"),
	},
	{
		path: "/directories",
		name: "Directories",
		meta: { title: "Справочники", icon: "database.svg", hasSubMenu: true },
		component: () => import("@features/directories/components/Layout.vue"),
		children: [
			{
				path: "",
				name: "DirectoriesIndex",
				redirect: "/directories/equipment",
			},
			{
				path: "equipment",
				name: "DirectoriesEquipment",
				meta: { title: "Оборудование", icon: HeaterIcon },
				component: () =>
					import("@features/directories/view/EquipmentPage.vue"),
			},
			{
				path: "materials",
				name: "DirectoriesMaterials",
				meta: { title: "Огр. конструкции", icon: BrickIcon },
				component: () =>
					import("@features/directories/view/MaterialsPage.vue"),
			},
			{
				path: "climate",
				name: "DirectoriesClimate",
				meta: { title: "Климатология", icon: MapIcon },
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
			import("@features/settings/components/Layout.vue"),
		children: [
			{
				path: "",
				name: "SettingsIndex",
				redirect: "/settings/profile",
			},
			{
				path: "profile",
				name: "SettingsProfile",
				meta: { title: "Профиль", icon: UserIcon },
				component: () =>
					import("@features/settings/view/Profile.vue"),
			},
			{
				path: "password",
				name: "SettingsPassword",
				meta: { title: "Пароль", icon: PasswordIcon },
				component: () =>
					import("@features/settings/view/Password.vue"),
			},
		]
	},
	...(isDev
		? [
				{
					path: "/ui-kit",
					name: "UiKit",
					meta: { title: "UI", icon: "settings.svg" },
					component: () => import("@features/ui-kit/UiKitPage.vue"),
				},
		  ]
		: []),
	{
		path: '/:catchAll(.*)',
		component: () => import("@shared/components/NotFound.vue"),
		meta: { layout: EmptyLayout }
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
