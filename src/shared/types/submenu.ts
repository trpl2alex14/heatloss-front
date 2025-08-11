export interface SubMenuItem {
	path: string;
	title: string;
	icon?: string;
	action?: () => void;
}

export interface SubMenuConfig {
	title: string;
	items: SubMenuItem[];
}
