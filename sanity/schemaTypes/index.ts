import { type SchemaTypeDefinition } from "sanity";
import { productType } from "./productType";
import { categoryType } from "./categoryType";
import { brandType } from "./brandType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, productType, brandType],
};
