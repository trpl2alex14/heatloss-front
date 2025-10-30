import type { TypeLabelDef } from "@shared/types/table";
import type { RequestStatus } from "../types/request";

export const useStatus = (): TypeLabelDef[] & { key: RequestStatus }[] => [
	{ key: "pending", label: "Заполняются", type: "info" },
	{ key: "working", label: "В работе", type: "warn" },
	{ key: "processed", label: "Заполнены", type: "danger" },
	{ key: "completed", label: "Обработаны", type: "success" },
	{ key: "cancelled", label: "Отменены", type: "secondary" },
];
