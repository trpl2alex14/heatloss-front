import type {User} from "@shared/types/user.ts";
import {computed, ref} from "vue";
import {useApiRequest} from "@shared/composables/useApiRequest.ts";

const user = ref<User>();
const isLoading = ref(false);

export const useAuth = () => {
	const { get, post } = useApiRequest<User>();

	const fetch = async () => {
		isLoading.value = true;
		get('api-profile')
			.then((result)=>user.value = result)
			.finally(()=>isLoading.value = false);
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
		logout,
		reload: fetch
	}
}
