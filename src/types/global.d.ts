/* eslint-disable */
// @ts-nocheck
declare module "*.css" {
	const classes: { [key: string]: string };
	export default classes;
}

type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Type>;
