import { type Component } from "vue";

export interface SelectButtonOption {
	label: string;
	value: any;
	[key: string]: any;
}

export interface SelectOption {
	label?: string;
	value: any;
	icon?: string;
	[key: string]: any;
}

export interface Tag {
	icon?: string;
	label: string;
	group: 'calculation' | 'equipment' | 'all'
}

export interface PromoCode {
	code: string;
	description: string;
}

export interface ProxyDialog {
	data: {
		component: Component,
		props: {
			[key: string]: any
		},
		actions: {
			[key: string]: (...arg: any[]) => any;
		}
	}
}
