import { useRouter } from "vue-router";
import type { AppRoute } from "@app/router";
import { ref, onMounted, computed } from "vue";
import { loadIcon } from "@shared/utils/assetLoader";

type MenuRoute = AppRoute & { meta: { iconSrc?: string } };

export default () => {
	const router = useRouter();

	const allMenuRoutes = ref<MenuRoute[]>([]);

	onMounted(async () => {
		const routes = router.options.routes.filter(
			(r): r is MenuRoute => !!r.name && !!r.meta && !!r.meta.title
		);

		const routesWithIcons = await Promise.all(
			routes.map(async (r) => ({
				...r,
				meta: {
					...r.meta,
					iconSrc: r.meta?.icon
						? await loadIcon(r.meta.icon)
						: undefined,
				},
			}))
		);
		allMenuRoutes.value = routesWithIcons;
	});

	const topMenuRoutes = computed(() =>
		allMenuRoutes.value.filter((r) => !r?.meta?.bottom)
	);

	const bottomMenuRoutes = computed(() =>
		allMenuRoutes.value.filter((r) => r?.meta?.bottom)
	);

	return {
		topMenuRoutes,
		bottomMenuRoutes,
	};
};
