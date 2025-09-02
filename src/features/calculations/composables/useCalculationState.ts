import type { TypeLabelDef } from "@shared/types/table.ts";
import type { CalculationStatus } from "../types";

export const statuses: TypeLabelDef[] & { key: CalculationStatus }[] = [
	{ key: "published", label: "Опубликован", type: "success" },
	{ key: "working", label: "В работе", type: "info" },
	{ key: "case", label: "Кейс", type: "warn" },
	{ key: "hide", label: "Скрыт", type: "secondary" },
];
