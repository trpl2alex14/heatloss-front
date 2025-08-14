<template>
	<div class="p-0">
		<Head title="Head" subtitle="Общий компонент заголовка раздела">
			<template #actions>
				<RowCounter :value="123" label="Кейсов" />
				<BaseButton label="Действие" icon="plus" />
			</template>
		</Head>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				BaseSelectButton ({{ selectValue as string }})
			</h2>
			<BaseSelectButton v-model="selectValue" :options="selectOptions" />
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				BaseSelect ({{ selectedProduct || "Не выбран" }})
			</h2>
			<div class="space-y-4">
				<BaseSelect
					v-model="selectedProduct"
					:options="selectProductsOptions"
					label="Продукт"
					placeholder="Выберите продукт"
					class="w-54"
				/>
				<BaseSelect
					v-model="selectedProduct"
					:options="cities"
					label="Город"
					placeholder="Выберите город"
					class="w-54"
					filter
				/>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				BaseMultiSelect ({{ selectedProducts?.length || 0 }} выбрано)
			</h2>
			<div class="space-y-4">
				<BaseMultiSelect
					v-model="selectedProducts"
					:options="selectProductsOptions"
					label="Продукты"
					placeholder="Выберите продукты"
					class="w-80"
					:show-toggle-all="false"
				/>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				BasePagination ({{ pagination.page }})
			</h2>
			<BasePagination
				:currentPage="pagination.page"
				:totalPages="Math.ceil(pagination.total / pagination.pageSize)"
				@update:page="(page) => (pagination.page = page)"
			/>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">BaseProgressBar</h2>
			<div class="w-30 flex flex-col gap-2">
				<BaseProgressBar :value="50" style="height: 10px" />
				<BaseProgressBar :value="30" style="height: 10px" hide />
				<BaseProgressBar :value="10" />
				<BaseProgressBar :value="80" />
				<BaseProgressBar :value="100" />
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				BaseToggleSwitch ({{ toggleValue ? "Включен" : "Выключен" }})
			</h2>
			<div class="space-y-4">
				<BaseToggleSwitch
					v-model="toggleValue"
					label="Включить уведомления"
				/>
				<BaseToggleSwitch
					v-model="toggleValue2"
					label="Автосохранение"
				/>
				<BaseToggleSwitch v-model="toggleValue3" :disabled="true" />
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				ConstructionLayer ({{
					constructionLayer.enabled ? "Включен" : "Выключен"
				}})
			</h2>
			<div class="space-y-4">
				<ConstructionLayer
					v-model="constructionLayer"
					:materials="materials"
					humidity="A"
					@remove="handleRemoveLayer"
				/>
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium mb-2">Текущее состояние слоя:</h3>
					<pre class="text-sm">{{
						JSON.stringify(constructionLayer, null, 2)
					}}</pre>
				</div>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				Construction ({{ construction.name || "Без названия" }})
			</h2>
			<div class="space-y-4">
				<Construction
					v-model="construction"
					:materials="materials"
					:climate="climate"
					:surfaces="surfaces"
					@remove="handleRemoveConstruction"
					@duplicate="handleDuplicateConstruction"
				/>
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium mb-2">
						Текущее состояние конструкции:
					</h3>
					<pre class="text-sm">{{
						JSON.stringify(construction, null, 2)
					}}</pre>
				</div>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				SectionConstructions ({{ calculationDetails.calculateMethod }})
			</h2>
			<div class="space-y-4">
				<SectionConstructions v-model="calculationDetails" />
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium mb-2">Текущее состояние расчета:</h3>
					<pre class="text-sm">{{
						JSON.stringify(calculationDetails, null, 2)
					}}</pre>
				</div>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				RoomConstruction ({{
					roomConstruction.enabled ? "Включен" : "Выключен"
				}})
			</h2>
			<div class="space-y-4">
				<RoomConstruction
					v-model="roomConstruction"
					:construction="windowConstruction"
					:min-temp="-36"
					:required-temp="20"
					@remove="handleRemoveRoomConstruction"
				/>
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium mb-2">
						Текущее состояние конструкции помещения:
					</h3>
					<pre class="text-sm">{{
						JSON.stringify(roomConstruction, null, 2)
					}}</pre>
				</div>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				RoomEquipment ({{ equipment.name || "Без названия" }})
			</h2>
			<div class="space-y-4">
				<RoomEquipment
					v-model="equipment"
					:index="0"
					@remove="handleRemoveEquipment"
				/>
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium mb-2">
						Текущее состояние оборудования:
					</h3>
					<pre class="text-sm">{{
						JSON.stringify(equipment, null, 2)
					}}</pre>
				</div>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				Popover ({{ showPopover ? "Открыт" : "Закрыт" }})
			</h2>
			<div class="space-y-4">
				<BaseButton label="Открыть Popover" @click="togglePopover" />
				<Popover ref="popoverRef">
					<div class="p-4 min-w-60">
						<h4 class="text-sm font-medium mb-3">Пример Popover</h4>
						<p class="text-sm text-gray-600 mb-3">
							Это пример использования компонента Popover из
							PrimeVue
						</p>
						<div class="flex justify-end gap-2">
							<BaseButton
								label="Отмена"
								variant="text"
								severity="secondary"
								@click="closePopover"
							/>
							<BaseButton
								label="Применить"
								@click="closePopover"
							/>
						</div>
					</div>
				</Popover>
			</div>
		</section>

		<section class="mb-8 w-250">
			<h2 class="text-md font-normal mt-3">
				Room ({{ room.name || "Без названия" }})
			</h2>
			<div class="space-y-4">
				<RoomComponent
					v-model="room"
					:constructions="roomConstructions"
					:min-temp="-36"
					:required-temp="20"
					:floors="3"
					@auto="handleRoomAuto"
					@addEquipment="handleRoomAddEquipment"
					@moveUp="handleRoomMoveUp"
					@moveDown="handleRoomMoveDown"
					@duplicate="handleRoomDuplicate"
					@hide="handleRoomHide"
					@remove="handleRoomRemove"
				/>
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium mb-2">
						Текущее состояние помещения:
					</h3>
					<pre class="text-sm">{{
						JSON.stringify(room, null, 2)
					}}</pre>
				</div>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-md font-normal mt-3">
				BaseDataTable {{ searchValue }}
			</h2>
			<BaseDataTable
				:columns="columns"
				:data="tableData"
				:pagination="pagination"
				:loading="false"
				customizable
				expandable
				:actions="dropdownActions"
				:statuses="statuses"
				@update:pagination="(val) => (pagination = val)"
			>
				<template #top-left>
					<BaseSelectButton
						v-model="selectValue"
						:options="selectOptions"
					/>
				</template>
				<template #top-right>
					<BaseSearch v-model="searchValue" />
					<BaseDatePicker
						v-model="dates"
						selectionMode="range"
						:manualInput="false"
						placeholder="Период"
					/>
				</template>
				<template #slot-tag="{ data }">
					<template v-for="tag in data?.tag || []" :key="tag">
						<BaseChip :label="tag" />
					</template>
				</template>
				<template #slot-product="{ data }">
					<TypeColumn
						:type="data.product || 'all'"
						:types="productCategory"
						short
					/>
				</template>
				<template #slot-image="{ data }">
					<img
						v-if="data?.image"
						:src="data?.image"
						class="w-30 h-20"
					/>
				</template>
				<template #slot-progress="{ data }">
					<CalculationBtn
						v-if="typeof data?.progress === 'object'"
						:data="data?.progress"
					/>
					<BaseProgressBar
						v-else
						:value="data?.progress"
						style="height: 1rem; max-width: 10rem"
					>
						<template #compleat>
							<CalculationBtn :data="data?.progress" />
						</template>
					</BaseProgressBar>
				</template>
				<template #expansion="{ data }">
					<h5>Orders for {{ data }}</h5>
				</template>
			</BaseDataTable>
		</section>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Head from "@/shared/components/Head.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import BaseSelect from "@/shared/components/ui/BaseSelect.vue";
import BaseMultiSelect from "@/shared/components/ui/BaseMultiSelect.vue";
import BasePagination from "@/shared/components/ui/BasePagination.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import BaseProgressBar from "@/shared/components/ui/BaseProgressBar.vue";
import BaseToggleSwitch from "@/shared/components/ui/BaseToggleSwitch.vue";
import Popover from "primevue/popover";
import CalculationBtn from "@/shared/components/CalculationBtn.vue";
import RowCounter from "@/shared/components/RowCounter.vue";
import type { ColumnDef, TypeLabelDef } from "@/shared/types/table";
import type { ActionDef } from "@/shared/types/menu";
import type {
	ConstructionLayer as ConstructionLayerType,
	Construction as ConstructionType,
	CalculationDetails,
	RoomConstruction as RoomConstructionType,
	Equipment,
	Room,
} from "@/features/calculations/types/calculation";
import type { ClimateItem } from "@/features/directories/types/climate";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import TypeColumn from "@/shared/components/TypeColumn.vue";
import ConstructionLayer from "@/features/calculations/components/ConstructionLayer.vue";
import Construction from "@/features/calculations/components/Construction.vue";
import SectionConstructions from "@/features/calculations/components/SectionConstructions.vue";
import RoomConstruction from "@/features/calculations/components/RoomConstruction.vue";
import RoomEquipment from "@/features/calculations/components/RoomEquipment.vue";
import RoomComponent from "@/features/calculations/components/Room.vue";
import { useTypes } from "@/shared/composables/useTypes";
import { useMaterialData } from "@/features/directories/composables/useMaterialData";

const { productCategory } = useTypes();

const columns: ColumnDef[] = [
	{
		key: "heat",
		label: "",
		type: "icon",
		sort: 1,
	},
	{
		key: "product",
		label: "",
		type: "slot",
		sort: 2,
		style: "width: 50px; text-align: center",
	},
	{
		key: "progress",
		label: "Прогресс",
		type: "slot",
		sort: 3,
	},
	{
		key: "image",
		label: "Картинка",
		type: "slot",
		sort: 11,
	},
	{
		key: "date",
		label: "Дата",
		sortable: false,
		hidden: true,
		sort: 10,
		type: "date",
	},
	{ key: "name", label: "Название", sortable: true, sort: 2 },
	{
		key: "value",
		label: "Значение",
		sortable: false,
		hidden: true,
		sort: 5,
		type: "number",
	},
	{
		key: "amount",
		label: "Сумма",
		sortable: false,
		hidden: true,
		sort: 5,
		type: "number",
		measure: "₽",
	},
	{
		key: "status",
		label: "Статус",
		sortable: false,
		hidden: true,
		type: "status",
	},
	{ key: "tag", label: "Тэги", sortable: false, hidden: true, type: "slot" },
];

const tableData = ref([
	{
		id: 1,
		heat: "shop",
		product: "kouzi",
		name: "Пример 1",
		value: 123,
		amount: 1223,
		date: new Date("2025-01-01"),
		status: 1,
		tag: ["дом", "утепленный"],
		progress: 50,
		image: "/images/home1.jpg",
	},
	{
		id: 2,
		name: "Пример 2",
		heat: "shop",
		value: 456,
		amount: 1223,
		date: new Date("2022-03-24"),
		status: 2,
	},
	{
		heat: { icon: "shop", color: "#10d500" },
		id: 3,
		name: "Пример 3",
		value: 789,
		amount: 1223,
		date: new Date("2022-04-11"),
		status: 3,
		progress: 10,
	},
	{
		id: 4,
		heat: { icon: "shop", color: "#d10000" },
		product: "fleyt",
		name: ["Пример 4", " многострочный текст"],
		value: 101,
		amount: 1223,
		date: new Date("2022-03-24"),
		status: "hide",
		tag: ["каркасник"],
		progress: 1240,
	},
	{
		id: 5,
		heat: { icon: "shop", color: "#01d200" },
		product: "fleyt",
		name: ["Пример 5"],
		value: 101,
		amount: 1223,
		date: new Date("2022-03-24"),
		status: "hide",
		tag: ["каркасник"],
		progress: { url: "/calculations", label: "1240" },
	},
]);

const statuses: TypeLabelDef[] = [
	{ key: 1, label: "Опубликован", type: "success" },
	{ key: 2, label: "В работе", type: "info" },
	{ key: 3, label: "Кейс", type: "warn" },
	{ key: "hide", label: "Скрыт", type: "secondary" },
];

const pagination = ref({ page: 1, pageSize: 10, total: 11 });

const searchValue = ref("");

const dropdownActions: ActionDef[] = [
	{
		label: "Действие 1",
		icon: "pi pi-check",
		command: (id: number) => alert("Действие 1 " + id),
	},
	{
		label: "Действие 2",
		icon: "pi pi-times",
		command: (id: number) => alert("Действие 2 " + id),
	},
];

const selectOptions = [
	{ label: "Все", value: "all" },
	{ label: "Опубликованы", value: "published" },
	{ label: "Черновики", value: "drafts" },
	{ label: "Кейсы", value: "cases" },
];
const selectValue = ref("all");

const dates = ref(null);

// Данные для BaseSelect
const selectedProduct = ref();

// Данные для BaseMultiSelect
const selectedProducts = ref<(string | number)[]>([]);

const selectProductsOptions = productCategory.map((item) => ({
	label: item.label,
	value: item.key,
	icon: item.image,
}));

const cities = [
	{ label: "Москва", value: "moscow" },
	{ label: "Санкт-Петербург", value: "saint-petersburg" },
	{ label: "Новосибирск", value: "novosibirsk" },
	{ label: "Екатеринбург", value: "ekaterinburg" },
	{ label: "Казань", value: "kazan" },
	{ label: "Ростов-на-Дону", value: "rostov-on-don" },
	{ label: "Уфа", value: "ufa" },
	{ label: "Красноярск", value: "krasnoyarsk" },
	{ label: "Пермь", value: "perm" },
	{ label: "Волгоград", value: "volgograd" },
	{ label: "Краснодар", value: "krasnodar" },
];

// Данные для BaseToggleSwitch
const toggleValue = ref(false);
const toggleValue2 = ref(true);
const toggleValue3 = ref(false);

// Данные для ConstructionLayer
// Загрузка материалов
const { materialData: materials, loadMaterialData } = useMaterialData();

onMounted(() => {
	loadMaterialData();
});

const constructionLayer = ref<ConstructionLayerType>({
	enabled: true,
	name: "Раствор цементно-песчаный, 1800 кг/м³",
	materialId: 1,
	thickness: 150,
	type: 1,
});

const handleRemoveLayer = () => {
	console.log("Слой удален");
};

// Данные для Construction
const climate = ref<ClimateItem>({
	id: 1,
	region: "Центральный",
	city: "Москва",
	humidity: "А",
	minTemp: -36,
	avgTemp: -3.1,
	heatingSeason: 214,
	roofNorm: 4.5,
	wallNorm: 3.2,
	floorNorm: 4.2,
});

const surfaces = ref([
	{ id: 1, name: "наружная", type: "wall" as const },
	{ id: 2, name: "внутренняя", type: "wall" as const },
	{ id: 3, name: "крыша", type: "roof" as const },
	{ id: 4, name: "пол", type: "floor" as const },
]);

const construction = ref<ConstructionType>({
	id: 1,
	name: "Крыша утепленная наклонная",
	area: 145,
	layers: [
		{
			enabled: true,
			name: "Раствор цементно-песчаный, 1800 кг/м³",
			materialId: 1,
			thickness: 150,
			type: 1,
		},
		{
			enabled: true,
			name: "СИП панель 174мм",
			materialId: 3,
			type: 2,
		},
	],
	snipResistance: 3.83,
	calculatedResistance: 6.83,
});

const handleRemoveConstruction = () => {
	console.log("Конструкция удалена");
};

const handleDuplicateConstruction = () => {
	console.log("Конструкция дублирована");
};

// Данные для SectionConstructions
const calculationDetails = ref<CalculationDetails>({
	id: 1,
	date: "2024-01-01",
	status: "working",
	area: 150,
	title: "Тестовый расчет",
	city: "Москва",
	useSeason: "permanent",
	climate: {
		id: 1,
		city: "Москва",
		region: "Центральный",
		humidity: "80",
		minTemp: -25,
		avgTemp: 5,
		heatingSeason: 220,
		wallNorm: 3.2,
		roofNorm: 4.2,
		floorNorm: 4.2,
	},
	requiredTemp: 20,
	freezeTemp: -36,
	calculateMethod: "detailed",
	constructions: [],
	rooms: [],
});

// Данные для RoomConstruction
const roomConstruction = ref<RoomConstructionType>({
	id: 1,
	enabled: true,
	area: 15,
	count: 2,
	heatLoss: 0,
});

const windowConstruction = ref<ConstructionType>({
	id: 1,
	name: "Окно ПВХ двухкамерное",
	area: 15,
	layers: [
		{
			enabled: true,
			name: "Стеклопакет",
			materialId: 1,
			type: 2,
		},
	],
	surface: {
		id: 1,
		name: "Окно",
		type: "window",
	},
	snipResistance: 0.5,
	calculatedResistance: 0.5,
});

const handleRemoveRoomConstruction = () => {
	console.log("Конструкция помещения удалена");
};

// Данные для RoomEquipment
const equipment = ref<Equipment>({
	id: 1,
	name: "Флэйт 50 - 500 Вт белый",
	quantity: 3,
	price: 12500,
});

const handleRemoveEquipment = () => {
	console.log("Оборудование удалено");
};

// Данные для Popover
const showPopover = ref(false);
const popoverRef = ref();

const togglePopover = (event: Event) => {
	popoverRef.value.toggle(event);
};

const closePopover = () => {
	popoverRef.value.hide();
};

// Данные для Room
const room = ref<Room>({
	id: 1,
	name: "Спальня",
	area: 18,
	floor: 1,
	width: 6,
	length: 3,
	height: 2.5,
	minHeight: 1.5,
	isMansard: false,
	heatLoss: 0,
	roomConstructions: [
		{
			id: 1,
			enabled: true,
			area: 15,
			count: 2,
			heatLoss: 724,
		},
	],
	equipment: [
		{
			id: 1,
			name: "Флэйт 50 - 500 Вт белый",
			quantity: 3,
			price: 12500,
			power: 500,
		},
		{
			id: 2,
			name: "Регулятор температуры",
			quantity: 1,
			price: 2900,
		},
	],
});

const roomConstructions = ref<ConstructionType[]>([
	{
		id: 1,
		name: "Стена наружная",
		area: 15,
		layers: [
			{
				enabled: true,
				name: "Кирпич керамический",
				materialId: 1,
				thickness: 250,
				type: 1,
			},
		],
		surface: {
			id: 1,
			name: "Стена",
			type: "wall",
		},
		snipResistance: 3.2,
		calculatedResistance: 3.2,
	},
	{
		id: 2,
		name: "Окно ПВХ двухкамерное",
		area: 6,
		layers: [
			{
				enabled: true,
				name: "Стеклопакет",
				materialId: 2,
				type: 2,
			},
		],
		surface: {
			id: 2,
			name: "Окно",
			type: "window",
		},
		snipResistance: 0.5,
		calculatedResistance: 0.5,
	},
]);

const handleRoomAuto = () => {
	console.log("Авто подбор оборудования для помещения");
};

const handleRoomAddEquipment = () => {
	console.log("Добавление оборудования в помещение");
};

const handleRoomMoveUp = () => {
	console.log("Перемещение помещения вверх");
};

const handleRoomMoveDown = () => {
	console.log("Перемещение помещения вниз");
};

const handleRoomDuplicate = () => {
	console.log("Дублирование помещения");
};

const handleRoomHide = () => {
	console.log("Скрытие помещения");
};

const handleRoomRemove = () => {
	console.log("Удаление помещения");
};
</script>
