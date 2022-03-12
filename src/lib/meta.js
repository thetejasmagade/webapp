import { useMeta } from "vue-meta";

export function useCalculatedMeta({ title, description, featuredImageURL }) {
  const meta = {
    meta: [
      { vmid: "og:locale", name: "og:locale", content: "en_US" },
      { vmid: "og:type", name: "og:type", content: "website" },
    ],
  };
  if (title) {
    meta.title = title;
    meta.meta.push({ vmid: "og:title", name: "og:title", content: title });
    meta.meta.push({
      vmid: "twitter:title",
      name: "twitter:title",
      content: title,
    });
  }
  if (description) {
    meta.description = description;
    meta.meta.push({
      vmid: "description",
      name: "description",
      content: description,
    });
    meta.meta.push({
      vmid: "og:description",
      name: "og:description",
      content: description,
    });
    meta.meta.push({
      vmid: "twitter:description",
      name: "twitter:description",
      content: description,
    });
  }
  if (featuredImageURL) {
    meta.meta.push({
      vmid: "og:image",
      name: "og:image",
      content: featuredImageURL,
    });
    meta.meta.push({
      vmid: "twitter:image",
      name: "twitter:image",
      content: featuredImageURL,
    });
    meta.meta.push({
      vmid: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    });
  }

  useMeta(meta);
}
