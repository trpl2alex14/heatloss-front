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

// Используем для UI kit
const isDev = import.meta.env.MODE !== "production" && false;
const isFrontTest = false;

const routes = [
	//API test
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
		path: isFrontTest ? '/data/calculation.public.json?:id' : '/api/calculations/:id/status',
		redirect: '/'
	},
	{
		name: 'api-calculation',
		path: isFrontTest ? '/data/calculations.111.json?:id?' : '/api/calculations/:id?',
		redirect: '/'
	},
	{
		name: 'api-calculations',
		path: isFrontTest ? '/data/calculations.lazy.json' : '/api/calculations',
		redirect: '/'
	},
	{
		name: 'api-equipment-status',
		path: isFrontTest ? '/data/equipment.get.json?:id' : '/api/equipments/:id/status',
		redirect: '/'
	},
	{
		name: 'api-equipments',
		path: isFrontTest ? '/data/equipments.api.json' : '/api/equipments',
		redirect: '/'
	},
	{
		name: 'api-directories-equipments',
		path: isFrontTest ? '/data/equipments.json' : '/api/equipments?all',
		redirect: '/'
	},
	{
		name: 'api-equipment',
		path: isFrontTest ? '/data/equipment.get.json?:id' : '/api/equipments/:id',
		redirect: '/'
	},
	{
		name: 'api-equipment-create',
		path: isFrontTest ? '/data/equipment.create.json' : '/api/equipments/create',
		redirect: '/'
	},
	{
		name: 'api-directories-material-categories',
		path: isFrontTest ? '/data/categories.json' : '/api/categories/material',
		redirect: '/'
	},
	{
		name: 'api-directories-equipment-categories',
		path: isFrontTest ? '/data/categories.equipments.json' : '/api/categories/equipment',
		redirect: '/'
	},
	{
		name: 'api-material',
		path: isFrontTest ? '/data/material.get.json?:id' : '/api/materials/:id',
		redirect: '/'
	},
	{
		name: 'api-material-create',
		path: isFrontTest ? '/data/material.create.json' : '/api/materials/create',
		redirect: '/'
	},
	{
		name: 'api-directories-materials',
		path: isFrontTest ? '/data/materials.json' : '/api/materials',
		redirect: '/'
	},
	{
		name: 'api-directories-climates',
		path: isFrontTest ? '/data/climates.json' : '/api/climates',
		redirect: '/'
	},
	{
		name: 'api-climate',
		path: isFrontTest ? '/data/climate.json?:id' : '/api/climates/:id',
		redirect: '/'
	},
	{
		name: 'api-climate-create',
		path: isFrontTest ? '/data/climate.create.json' : '/api/climates/create',
		redirect: '/'
	},
	{
		name: 'api-promos',
		path: isFrontTest ? '/data/promos.json' : '/api/promos',
		redirect: '/'
	},
	{
		name: 'api-tags',
		path: isFrontTest ? '/data/tags.json' : '/api/tags',
		redirect: '/'
	},
	{
		name: 'api-directories-surfaces',
		path: isFrontTest ? '/data/surfaces.json' : '/api/surfaces',
		redirect: '/'
	},
	{
		name: 'api-profile',
		path: isFrontTest ? '/data/profile.json' : '/api/profile',
		redirect: '/'
	},
	{
		name: 'api-profile-update',
		path: isFrontTest ? '/data/profile.errors.json?:id' : '/api/profile/:id',
		redirect: '/'
	},
	{
		name: 'api-password',
		path: isFrontTest ? '/data/password.errors.json' : '/api/password',
		redirect: '/'
	},
	{
		name: 'logout',
		path: '/logout',
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
				redirect: (to:RouteLocation) => '/view/' + to.params.id
			},
			{
				name: 'calculation-pdf',
				path: 'pdf',
				redirect: (to:RouteLocation) => '/pdf/' + to.params.id
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
			import("@features/requests/view/RequestsPage.vue"),
	},
	{
		path: "/cases",
		name: "Cases",
		meta: { title: "Кейсы", icon: "book-open-check.svg" },
		component: () => import("@features/cases/view/CasesPage.vue"),
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
