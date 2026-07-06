import { type SchemaTypeDefinition } from "sanity";
import { productType } from "./productType";
import { categoryType } from "./categoryType";
import { brandType } from "./brandType";
import { addressType } from "./adressType";
import { orderType } from "./orderTypes";
import { storeType } from "./storeType";
import { reviewType } from "./reviewType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, productType, brandType, addressType, orderType, storeType, reviewType],
};
