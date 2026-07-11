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
      S.divider(),
      S.documentTypeListItem("galleryItem").title("Галерија"),
      S.documentTypeListItem("testimonial").title("Утисци"),
    ]);
