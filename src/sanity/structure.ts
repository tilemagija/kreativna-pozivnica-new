import type { StructureResolver } from "sanity/structure";

// Clean Studio menu for non-technical editors: two fixed single documents
// (settings + home page) and two lists (gallery, testimonials).
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Садржај")
    .items([
      S.listItem()
        .title("Подешавања сајта")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Почетна страна")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Страница: Уметност и поклони")
        .id("artPage")
        .child(S.document().schemaType("artPage").documentId("artPage")),
      S.listItem()
        .title("Страница: Додаци")
        .id("dodaciPage")
        .child(S.document().schemaType("dodaciPage").documentId("dodaciPage")),
      S.listItem()
        .title("Страница: Прилагодите баш вама")
        .id("prilagoditePage")
        .child(S.document().schemaType("prilagoditePage").documentId("prilagoditePage")),
      S.listItem()
        .title("Страница: Настанак")
        .id("nastanakPage")
        .child(S.document().schemaType("nastanakPage").documentId("nastanakPage")),
      S.listItem()
        .title("Страница: Акција")
        .id("salePage")
        .child(S.document().schemaType("salePage").documentId("salePage")),
      S.divider(),
      S.documentTypeListItem("artwork").title("Уметност и поклони (радови)"),
      S.documentTypeListItem("dodaciItem").title("Додаци (ставке)"),
      S.documentTypeListItem("prilagoditeItem").title("Прилагодите (примери)"),
      S.documentTypeListItem("sale").title("Акције (ставке)"),
      S.documentTypeListItem("testimonial").title("Утисци"),
      S.divider(),
      S.listItem()
        .title("Ценовник — правила и додаци")
        .id("pricing")
        .child(S.document().schemaType("pricing").documentId("pricing")),
      S.documentTypeListItem("paperOption").title("Ценовник — папири"),
      S.documentTypeListItem("envelopeOption").title("Ценовник — коверте"),
      S.divider(),
      S.documentTypeListItem("invitationTemplate").title("Позивнице — шаблони"),
      S.documentTypeListItem("category").title("Позивнице — категорије"),
      S.documentTypeListItem("sealMotif").title("Печат — мотиви"),
      S.documentTypeListItem("sealColor").title("Печат — боје воска"),
      S.divider(),
      S.documentTypeListItem("order").title("Наруџбине"),
      S.documentTypeListItem("inquiry").title("Упити"),
    ]);
