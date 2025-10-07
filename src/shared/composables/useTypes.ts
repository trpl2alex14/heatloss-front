import type { TypeImageDef } from "@shared/types/table";
import MaterialIcon from "@assets/icons/material.svg";
import ConstructIcon from "@assets/icons/construct.svg";
import imageFleyt from "@assets/images/fleyt.png";
import imageKouzi from "@assets/images/kouzi.png";
import imageAll from "@assets/images/grevolt.png";
import type { Product } from "@shared/types/produtcs";
import type {SurfaceType} from "@features/directories/types";

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

type ProductType = TypeImageDef & {key: Product};

const productCategory: ProductType[] = [
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

const typeSurfaces: { value:SurfaceType, label: string }[] = [
	{
		value: 'roof',
		label: 'Кровля'
	},
	{
		value: 'wall',
		label: 'Стены'
	},
	{
		value: 'floor',
		label: 'Фундамент/Пол'
	},
	{
		value: 'window',
		label: 'Остекление'
	}
];

export const useTypes = () => {

	return {
		materialTypes,
		productCategory,
		typeSurfaces
	};
};
