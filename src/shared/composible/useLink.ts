export function useLink() {
	return {
		link: (import.meta.env.VITE_LINK || 'router-link')
	}
}