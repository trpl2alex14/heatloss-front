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
}

export interface PromoCode {
	code: string;
	description: string;
}
