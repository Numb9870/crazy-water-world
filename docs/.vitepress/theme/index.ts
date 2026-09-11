import DefaultTheme from 'vitepress/theme';
// @ts-ignore
import './custom.css';
import { setup } from '@css-render/vue3-ssr';
import { NConfigProvider } from 'naive-ui';
import { useRoute } from 'vitepress';
import { defineComponent, h, inject } from 'vue';

const { Layout } = DefaultTheme;

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject('css-render-collect') as any;
    return {
      style: collect(),
    };
  },
  render() {
    return h('css-render-style', {
      innerHTML: this.style,
    });
  },
});

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute();
    return () => {
      return h('vitepress-path', null, [route.path]);
    };
  },
});

const NaiveUIProvider = defineComponent({
  render() {
    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true },
      {
        // @ts-ignore
        default: () => [h(Layout, null, { default: this.$slots.default?.() }), import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null],
      },
    );
  },
});

export default {
  extends: DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp: ({ app }: { app: any }) => {
    // @ts-ignore
    if (import.meta.env.SSR) {
      const { collect } = setup(app);
      app.provide('css-render-collect', collect);
    }
  },
};
