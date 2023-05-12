import { h } from 'vue';
import Theme from 'vitepress/theme';

export default {
  ...Theme,
  Layout: () => h(Theme.Layout, null, {}),
};
