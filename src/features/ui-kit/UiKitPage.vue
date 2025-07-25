<template>
	<div class="p-0">
		<Head title="Head" subtitle="Общий компонент заголовка раздела">
			<template #actions>
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
					<img
						v-bind="getProductInfo(data?.product)"
						class="w-5 h-5"
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
import { ref, onMounted } from "vue";
import Head from "@/shared/components/Head.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDataTable from "@/shared/components/ui/BaseDataTable.vue";
import BaseSelectButton from "@/shared/components/ui/BaseSelectButton.vue";
import BasePagination from "@/shared/components/ui/BasePagination.vue";
import BaseSearch from "@/shared/components/ui/BaseSearch.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import BaseProgressBar from "@/shared/components/ui/BaseProgressBar.vue";
import CalculationBtn from "@/shared/components/calculationBtn.vue";
import type {
	ColumnDef,
	ActionDef,
	StatusDef,
} from "@/shared/composible/useTable";
import BaseChip from "@/shared/components/ui/BaseChip.vue";
import { loadImage } from "@/shared/utils/assetLoader";

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

const statuses: StatusDef[] = [
	{ key: 1, label: "Опубликован", type: "success" },
	{ key: 2, label: "В работе", type: "info" },
	{ key: 3, label: "Кейс", type: "warn" },
	{ key: "hide", label: "Скрыт", type: "secondary" },
];

const products = ref([
	{ key: "kouzi", label: "Коузи", img: "kouzi.png" },
	{ key: "fleyt", label: "Флэйт", img: "fleyt.png" },
	{ key: "all", label: "Гревольт", img: "grevolt.png" },
]);

const productImages = ref<Record<string, string>>({});

onMounted(async () => {
	const images = await Promise.all(
		products.value.map(async (product) => {
			return {
				[product.key]: await loadImage(product.img),
			};
		})
	);
	productImages.value = Object.assign({}, ...images);
});

const getProductInfo = (key: string) => {
	const product = products.value.find((product) => product.key === key);
	return {
		src: productImages.value[key || "all"],
		alt: product?.label || "",
	};
};

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
</script>
