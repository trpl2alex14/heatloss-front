import type { TypeImageDef } from "@/shared/types/table";
import MaterialIcon from "@assets/icons/material.svg";
import ConstructIcon from "@assets/icons/construct.svg";
import imageFleyt from "@/assets/images/fleyt.png";
import imageKouzi from "@/assets/images/kouzi.png";
import imageAll from "@/assets/images/grevolt.png";

const materialTypes: TypeImageDef[] = [
	{
		key: 1,
		label: "Материал",
		image: MaterialIcon,
	},
	{
		key: 2,
		label: "Конструкция",
		image: ConstructIcon,
	},
];


const productCategory: TypeImageDef[] = [
	{
		key: "fleyt",
		label: "Флэйт",
		image: imageFleyt,
	},
	{
		key: "kouzi",
		label: "Коузи",
		image: imageKouzi,
	},
	{
		key: "all",
		label: "Любой",
		image: imageAll,
	},
];

export const useTypes = () => {

	return {
		materialTypes,
		productCategory,

	};
};