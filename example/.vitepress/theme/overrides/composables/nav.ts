/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ref, watch } from 'vue';
import { useRoute } from 'vitepress';

type TypedConst = string;

export function useNav() {
  const isScreenOpen = ref(false);
  const typedConst: TypedConst = 'typed const worked';

  console.info('Overriden useNav', typedConst);

  function openScreen() {
    isScreenOpen.value = true;
    window.addEventListener('resize', closeScreenOnTabletWindow);
  }

  function closeScreen() {
    isScreenOpen.value = false;
    window.removeEventListener('resize', closeScreenOnTabletWindow);
  }

  function toggleScreen() {
    isScreenOpen.value ? closeScreen() : openScreen();
  }

  function closeScreenOnTabletWindow() {
    window.outerWidth >= 768 && closeScreen();
  }

  const route = useRoute();
  watch(() => route.path, closeScreen);

  return {
    isScreenOpen,
    openScreen,
    closeScreen,
    toggleScreen,
  };
}
