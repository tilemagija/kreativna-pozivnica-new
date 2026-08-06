import { type SchemaTypeDefinition } from "sanity";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { templateTextField } from "./objects/templateTextField";
import { siteSettings } from "./documents/siteSettings";
import { homePage } from "./documents/homePage";
import { testimonial } from "./documents/testimonial";
import { inquiry } from "./documents/inquiry";
import { artwork } from "./documents/artwork";
import { artPage } from "./documents/artPage";
import { dodaciPage } from "./documents/dodaciPage";
import { dodaciItem } from "./documents/dodaciItem";
import { prilagoditePage } from "./documents/prilagoditePage";
import { prilagoditeItem } from "./documents/prilagoditeItem";
import { nastanakPage } from "./documents/nastanakPage";
import { sale } from "./documents/sale";
import { salePage } from "./documents/salePage";
import { paperOption } from "./documents/paperOption";
import { envelopeOption } from "./documents/envelopeOption";
import { pricing } from "./documents/pricing";
import { invitationTemplate } from "./documents/invitationTemplate";
import { category } from "./documents/category";
import { invitationType } from "./documents/invitationType";
import { sealMotif } from "./documents/sealMotif";
import { sealColor } from "./documents/sealColor";
import { order } from "./documents/order";

export const schemaTypes: SchemaTypeDefinition[] = [
  // reusable objects
  localeString,
  localeText,
  templateTextField,
  // content
  siteSettings,
  homePage,
  testimonial,
  inquiry,
  artwork,
  artPage,
  dodaciPage,
  dodaciItem,
  prilagoditePage,
  prilagoditeItem,
  nastanakPage,
  sale,
  salePage,
  paperOption,
  envelopeOption,
  pricing,
  invitationTemplate,
  category,
  invitationType,
  sealMotif,
  sealColor,
  order,
];
