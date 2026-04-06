import { defineNuxtPlugin } from "#app";
import en from "~/i18n/en.json";
import uk from "~/i18n/uk.json";

export default defineNuxtPlugin({
  name: "app-i18n",
  dependsOn: ["orio-ui-i18n"],
  setup(nuxtApp) {
    const i18n = nuxtApp.$orioI18n as any;
    i18n.global.mergeLocaleMessage("en", en);
    i18n.global.mergeLocaleMessage("uk", uk);
  },
});
