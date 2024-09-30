import { defineNuxtPlugin } from '#app';
import ClientOnlyAModal from '~/components/clientOnlyAModal';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ClientOnlyAModal', ClientOnlyAModal);
});
