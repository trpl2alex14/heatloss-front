export interface SubMenuItem {
	path: string;
	title: string;
	icon?: string;
}

export interface SubMenuConfig {
	title: string;
	items: SubMenuItem[];
}
