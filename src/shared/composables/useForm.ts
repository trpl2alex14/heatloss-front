import {type RejectResponse, useApiRequest} from "@shared/composables/useApiRequest.ts";
import {computed, ref, watch} from "vue";
import {serialize} from "@shared/utils/serialize.ts";
import {useRejectResponse} from "@shared/composables/useRejectResponse.ts";

export type Routes = {
	get: string,
	update?: string,
	create?: string,
	delete?: string
}

export const useForm = <Entity>(routes: Routes, def?: Entity) => {
	const {get, post} = useApiRequest();
	const {
		errors,
		errorMessage,
		getErrorFields,
		isInvalidField: isInvalidFieldInReject,
		getErrorFieldMessage
	}
		= useRejectResponse();

	const entity = ref();

	const isChanged = ref(false);

	if(def) {
		entity.value = def;
	}

	watch(
		() => entity.value,
		() => {
			isChanged.value = true;
			if(errors.value){
				errors.value = null;
				//TODO: deep changes entity
			}
		},
		{
			deep: true,
		}
	);

	const isInvalidField = (name: string, cb?: (field: string) => boolean) => {
		return isInvalidFieldInReject(name, cb);
	};

	const fetchEntity = async (id?: number) => {
		entity.value = await get<Entity>(routes.get, {id});
	};

	const makeFormData = (entity: Entity) => {
		if (entity && typeof entity === 'object') {
			return serialize(entity);
		}

		return null;
	}

	const save = async (id?: number, cb? :(entity: Entity) => any) => {
		isChanged.value = false;
		errors.value = null;

		const name = (id ? routes.update : routes.create) || routes.get;
		const params = id ? {id} : undefined;
		return post<Entity>(name, params, makeFormData(cb ? cb(entity.value) : entity.value), {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.catch((result: RejectResponse) => {
				errors.value = {...result};
			});
	};

	return {
		entity,
		errors,
		isInvalidField,
		getErrorFields: (field?: string) => errors.value ? getErrorFields(errors.value, field) : undefined,
		isChanged,
		errorMessage: computed(() => errorMessage.value || ""),
		fetchEntity,
		save,
		getErrorFieldMessage
	}
}
