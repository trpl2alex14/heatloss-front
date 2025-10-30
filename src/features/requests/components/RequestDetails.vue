<template>
	<div class="flex flex-row gap-2">
		<div class="min-w-[25vw]">
			<div class="sticky top-0">
				<div class="flex items-center gap-2 w-full justify-between p-2 border-b border-gray-300">
					<TypeColumn :type="request.product || 'all'" :types="productCategory" />
					<div class="flex items-center gap-2 w-60">
						<BaseProgressBar :value="request?.progress" style="height: 1rem; max-width: 10rem">
							<template #compleat>
								<CalculationBtn :data="request?.progress" />
							</template>
						</BaseProgressBar>
						<BaseStatusTag :statuses="statuses" :status="request.status || 'pending'" class="w-30" />
					</div>
				</div>
				<RequestClient :client="client" :attachments="attachments" />
			</div>
		</div>
		<div class="flex flex-col gap-2 flex-1">
			<!-- Теги объекта -->
			<div class="flex flex-wrap gap-1">
				<Tag
					v-for="(tag, index) in request.tags"
					:key="index"
					:label="tag"
					icon-size="0.8rem"
					class="text-xs py-0.5 px-1"
				/>
			</div>

			<!-- Основные данные объекта -->
			<div class="flex gap-x-2">
				<BaseInputText v-model="request.city" label="Город / Регион" disabled class="flex-1" />
			</div>

			<div class="flex gap-x-2">
				<BaseInputText
					:model-value="
						request.width && request.length && request.area
							? `${request.width} х ${request.length} = ${request.area} м²`
							: ''
					"
					label="Размер объекта"
					class="flex-1"
					disabled
				/>
				<BaseInputText
					:model-value="request.wallHeight ? `${request.wallHeight} м` : ''"
					label="Высота мин."
					class="w-26"
					disabled
				/>
				<BaseInputText
					:model-value="request.ridgeHeight ? `${request.ridgeHeight} м` : ''"
					label="Высота макс."
					class="w-26"
					disabled
				/>
				<BaseInputText
					:model-value="request.floors ? request.floors.length.toString() : ''"
					label="Этажность"
					class="w-22"
					disabled
				/>
			</div>

			<!-- Секция конструкций -->
			<div class="flex justify-between items-center border-b border-gray-300 mt-2">
				<div class="font-medium">Конструкции</div>
			</div>

			<!-- Конструкции -->
			<div v-for="construction in request.constructions" :key="construction.id">
				<div class="text-sm py-1">
					{{ construction.label }}
					<span v-if="construction.area" class="font-bold">
						- {{ construction.area }}
						<span class="text-gray-500 font-normal">м²</span>
					</span>
				</div>
				<div v-for="material in construction.materials" :key="material.id" class="flex gap-x-2 pb-2">
					<BaseInputText :model-value="material.name" label="Материал" class="flex-1" disabled />
					<BaseInputText
						v-if="material.width"
						:model-value="material.width ? `${material.width}мм` : ''"
						label="Толщина"
						class="w-20"
						disabled
					/>
				</div>
			</div>

			<!-- Секция помещений -->
			<div class="flex justify-between items-center border-b border-gray-300 mt-2">
				<div class="font-medium">Помещения</div>
			</div>

			<!-- Этажи -->
			<div v-for="(floor, floorIndex) in request.floors" :key="floorIndex">
				<div class="text-sm my-3 mb-1">
					{{ floorIndex + 1 }} этаж
					<span
						v-for="tag in floor.tags"
						:key="tag"
						class="text-xs py-0.5 px-2 bg-gray-100 rounded-xl text-gray-600 mx-1 inline-block"
					>
						{{ tag }}
					</span>
				</div>

				<!-- Комнаты на этаже -->
				<div v-for="room in floor.rooms" :key="room.name" class="flex w-full flex-col">
					<div class="p-1">
						<div class="flex gap-x-2 pb-1">
							<BaseInputText :model-value="room.name" label="Название" class="flex-1" disabled />
							<BaseInputText
								v-if="room.windows"
								:model-value="
									room.windows
										? `${room.windows.reduce((sum, w) => sum + w.count, 0)} (${room.windows.reduce(
												(sum, w) => sum + (w.area || 0),
												0
										  )} м²)`
										: ''
								"
								label="Окна"
								class="w-22"
								disabled
							/>
							<BaseInputText :model-value="`${room.area} м²`" label="Площадь" class="w-20" disabled />
							<BaseInputText
								:model-value="room.height ? `${room.height} м` : ''"
								label="Высота"
								class="w-20"
								disabled
							/>
						</div>
						<div class="flex gap-x-1">
							<Tag
								v-for="tag in room.tags"
								:key="tag"
								:label="tag"
								icon-size="0.8rem"
								class="text-xs py-0.5 px-1"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="border-t border-gray-300 mt-2"></div>

			<!-- Электрика -->
			<div v-if="request.electricity" class="flex gap-x-2">
				<BaseInputText
					:model-value="request.electricity.power"
					label="Выделенная мощность"
					class="flex-1"
					disabled
				/>
				<BaseInputText
					v-if="request.electricity.price"
					:model-value="request.electricity.price.toString() + ' ₽'"
					label="Цена эл.энергии"
					class="flex-1"
					disabled
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseInputText from "@shared/components/ui/BaseInputText.vue";
import Tag from "@features/calculations/components/Tag.vue";
import { useRequestResource } from "@features/calculations/composables/useRequestResource.ts";
import { inject, onMounted, type Ref } from "vue";
import RequestClient from "./RequestClient.vue";
import { useTypes } from "@shared/composables/useTypes";
import TypeColumn from "@shared/components/TypeColumn.vue";
import { useStatus } from "../composables/useStatus";
import BaseStatusTag from "@shared/components/ui/BaseStatusTag.vue";
import BaseProgressBar from "@shared/components/ui/BaseProgressBar.vue";
import CalculationBtn from "@shared/components/CalculationBtn.vue";

interface Dialog {
	data: { id: number };
}

const statuses = useStatus();

const { productCategory } = useTypes();

const dialogRef = inject("dialogRef") as Ref<Dialog>;

const { requestData: request, attachments, client, loadRequestData } = useRequestResource();

onMounted(() => {
	if (dialogRef && dialogRef.value?.data) {
		loadRequestData(dialogRef.value?.data.id);
	}
});
</script>
