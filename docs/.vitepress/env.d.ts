/// <reference types="vitepress/client" />

declare module "*.css" {
  const content: string;
  export default content;
}