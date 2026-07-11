import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = imageUrlBuilder({ projectId, dataset });

// Derive the accepted source type from the builder itself (version-proof).
export const urlFor = (source: Parameters<typeof builder.image>[0]) =>
  builder.image(source);
