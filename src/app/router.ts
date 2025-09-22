import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
	type RouteLocation
} from "vue-router";
import EmptyLayout from "@/layouts/EmptyLayout.vue";

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
		name: 'calculation-status',
		//path: '/api/calculations/:id/status',  //TODO	
		path: '/data/calculation.public.json?:id',
		redirect: '/'
	},
	{
		name: 'api-calculation',
		//path: '/api/calculations/:id',  //TODO	
		path: '/data/calculations.111.json?:id',
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
		path: '/data/equipment.json', //TODO
		redirect: '/'
	},	
	{
		name: 'api-directories-climete',
		path: '/data/climate.json', //TODO
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
	{
		path: '/:catchAll(.*)', 
		component: () => import("@/shared/components/NotFound.vue"),
		meta: { layout: EmptyLayout }
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
