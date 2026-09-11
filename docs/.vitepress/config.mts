import { defineConfig, UserConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { VitePressSidebarOptions } from 'vitepress-sidebar/types';

const fileAndStyles: Record<string, string> = {};

// vitepress配置
const vitepressConfig: UserConfig = {
  // base
  base: '/crazy-water-world/',
  // 语言
  lang: 'zh-CN',
  // meta标签
  title: '疯狂水世界wiki',
  // meta标签描述
  description: '一站式攻略合集',
  // 自定义图标
  head: [['link', { rel: 'icon', href: '/crazy-water-world/favicon.png' }]],
  // 当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀。
  cleanUrls: true,
  // 自定义主题配置
  themeConfig: {
    // 站点标题和图标
    siteTitle: '疯狂水世界',
    logo: '/favicon.png',

    // 导航栏
    nav: [{ text: '兑换码', link: '/兑换码/' }],

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/Numb9870/crazy-water-world' }],

    // 本地搜索
    search: {
      // 本地搜索提供器
      provider: 'local',
      // 本地搜索选项
      options: {
        // 本地搜索国际化配置
        locales: {
          // 中文
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    // 允许自定义上次更新的文本和日期格式
    lastUpdated: {
      text: '最后更新于：',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },

    // 渲染大纲容器
    outline: {
      // outline 中要显示的标题级别
      level: 'deep',
      // 显示在 outline 上的标题
      label: '页面导航',
    },

    // 可用于自定义出现在上一页和下一页链接上方的文本
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
  // 更新最后时间戳
  lastUpdated: true,
  // vite 配置
  vite: {
    server: {
      open: true,
    },
    ssr: {
      noExternal: ['naive-ui', 'date-fns', 'vueuc'],
    },
  },
  postRender(context) {
    const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/;
    const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/;
    const style = styleRegex.exec(context.content)?.[1];
    const vitepressPath = vitepressPathRegex.exec(context.content)?.[1];
    if (vitepressPath && style) {
      fileAndStyles[vitepressPath] = style;
    }
    context.content = context.content.replace(styleRegex, '');
    context.content = context.content.replace(vitepressPathRegex, '');
  },
  transformHtml(code, id) {
    const html = id.split('/').pop();
    if (!html) return;
    const style = fileAndStyles[`/${html}`];
    if (style) {
      return code.replace(/<\/head>/, `${style}</head>`);
    }
  },
};

// 侧边栏插件
const vitePressSidebarOptions: VitePressSidebarOptions[] = [
  {
    documentRootPath: '/docs',
    // 此选项用于为不同的路由规则指定不同的根目录
    scanStartPath: '菜单',
    // 此选项主要用于VitePress的重写规则
    resolvePath: '/菜单/',
    // VitePress使用此选项在遇到特定URI时显示相关菜单
    basePath: '/菜单/',
    // 如果为false,则创建菜单时所有分组都处于展开状态。如果为true,则创建菜单时所有分组都处于折叠状态。
    collapsed: false,
    // 如果值为 true，则显示带有 .md 文件中 h1 标题内容的标题
    useTitleFromFileHeading: true,
    // 如果值为 true，菜单名称的第一个字母将强制为大写
    capitalizeFirst: true,
    // 包含扫描根目录下的 index.md 文件
    includeRootIndexFile: true,
    // 包含子目录中的 index.md 文件
    includeFolderIndexFile: true,
  },
  {
    documentRootPath: '/docs',
    scanStartPath: '工具',
    basePath: '/工具/',
    resolvePath: '/工具/',
    collapsed: false,
    useTitleFromFileHeading: true,
    capitalizeFirst: true,
    includeRootIndexFile: true,
    includeFolderIndexFile: true,
  },
];

// 合并配置并导出
export default defineConfig(withSidebar(vitepressConfig, vitePressSidebarOptions));

// export default defineConfig(vitepressConfig);
