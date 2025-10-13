import type {User} from "@shared/types/user.ts";
import {computed, ref} from "vue";
import {useApiRequest} from "@shared/composables/useApiRequest.ts";

export const useAuth = () => {
	const user = ref<User>();
	const isLoading = ref(false);

	const { get, post } = useApiRequest<User>();

	const fetch = async () => {
		isLoading.value = true;
		user.value = await get('api-profile');
	}

	const shortName = computed(() => {
		let name =  user.value?.name || 'Пользователь';

		if(name.length > 15) {
			const word = name.split(' ');
			name = word[0] + (word.length === 1 ? '' : ` ${word[1][0]}.`)
		}

		return name;
	})

	const logout = async () => {
		await post('logout');
	}

	fetch().finally(()=>isLoading.value=false);

	return {
		user,
		isLoading,
		shortName,
		logout
	}
}
