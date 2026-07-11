import { type SchemaTypeDefinition } from "sanity";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { siteSettings } from "./documents/siteSettings";
import { homePage } from "./documents/homePage";
import { galleryItem } from "./documents/galleryItem";
import { testimonial } from "./documents/testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  // reusable objects
  localeString,
  localeText,
  // content
  siteSettings,
  homePage,
  galleryItem,
  testimonial,
];
