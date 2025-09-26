import {type RejectResponse, useApiRequest} from "@/shared/composables/useApiRequest";
import {computed, ref, watch} from "vue";
import {serialize} from "@shared/utils/serialize.ts";

export type Routes = {
	get: string,
	update: string,
	create: string,
	delete?: string
}
export const useForm = <Entity>(routes: Routes) => {
	const {get, post} = useApiRequest();

	const entity = ref();

	const isChanged = ref(false);

	const errors = ref<{
		fields: string[];
		message: string;
	} | null>(null);

	const errorMessage = computed(() => (!isChanged.value && errors.value !== null ? errors.value.message : ""));

	watch(
		entity,
		() => {
			isChanged.value = true;
		},
		{
			deep: true,
		}
	);

	const isInvalidField = (name: string) => {
		return !isChanged.value && errors.value !== null && errors.value.fields.includes(name);
	};

	const fetchEntity = async (id: number) => {
		entity.value = await get<Entity>(routes.get, {id});
	};

	const makeFormData = (entity: Entity) => {
		if (entity && typeof entity === 'object') {
			return serialize(entity);
		}

		return null;
	}

	const save = async (id?: number) => {
		isChanged.value = false;

		const name = id ? routes.update : routes.create;
		const params = id ? {id} : undefined;
		return post<Entity>(name, params, makeFormData(entity.value), {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.catch((result: RejectResponse) => {
				errors.value = {
					message: result.message,
					fields: Object.keys(result.fields),
				};
			});
	};

	return {
		entity,
		isInvalidField,
		isChanged,
		errorMessage,
		fetchEntity,
		save
	}
}
