export type ActionDef =
	| {
			separator: true;
	  }
	| {
			label: string;
			icon?: string;
			command: (id: number) => void;
	  };