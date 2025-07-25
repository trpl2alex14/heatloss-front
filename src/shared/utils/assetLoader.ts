export const loadIcon = async (icon: string) => {
	const iconUrl = new URL(`../../assets/icons/${icon}`, import.meta.url);
	return iconUrl.toString();
};

export const loadImage = async (image: string) => {
	const iconUrl = new URL(`../../assets/images/${image}`, import.meta.url);
	return iconUrl.toString();
};