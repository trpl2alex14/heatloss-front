import { useConfirm as usePrimeConfirm } from "primevue/useconfirm";

export const useConfirm = () => {
	const confirm = usePrimeConfirm();

	const confirmDelete = async (event?: any, message?: string ) => {
		return new Promise((resolve, reject) => {
			const config = {
				message: message || 'Вы точно хотите удалить запись?',
				icon: 'pi pi-info-circle',
				rejectProps: {
					label: 'Отмена',
					severity: 'secondary',
					outlined: true
				},
				acceptProps: {
					label: 'Удалить',
					severity: 'danger'
				},
				accept: () => {
					resolve(event?.currentTarget || 1);
				},
				reject: () => {
					reject();	
				}
			};
			if(event?.currentTarget){
				confirm.require({
					target: event?.currentTarget,
					...config
				});	
			}else {
				confirm.require({
					header: 'Удаление',					
					...config
				});					
			}
		});	
	}

	return {
		confirmDelete
	}
}