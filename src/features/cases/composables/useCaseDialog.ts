import type {DynamicDialogInstance} from "primevue/dynamicdialogoptions";
import {useDialog} from "primevue";
import {defineAsyncComponent} from "vue";

export type DialogOptions = {
	onClose?: () => void;
	onSave?: () => void;
} & ({ id: number } | { calculation: number});

export const useCaseDialog = () => {
	const dialog = useDialog();

	const ProxyDialog = defineAsyncComponent(() => import("@shared/components/ProxyDialog.vue"));

	let openDialog: DynamicDialogInstance;
	const openCaseDialog = (options : DialogOptions) => {
		openDialog = dialog.open(ProxyDialog, {
			props: {
				header: "Кейс",
				showHeader: false,
				style: {
					width: "40vw",
				},
				modal: true,
			},
			data: {
				component: defineAsyncComponent(() => import("../components/CasePage.vue")),
				props: {
					id: 'id' in options ? options.id : undefined,
					calculation: 'calculation' in options ? options.calculation : undefined
				},
				actions: {
					close: () => {
						openDialog.close();
						options.onClose && options.onClose();
					},
					save: () => {
						openDialog.close();
						options.onSave && options.onSave();
					},
				},
			},
		});
	};

	return {
		openCaseDialog
	}
}
