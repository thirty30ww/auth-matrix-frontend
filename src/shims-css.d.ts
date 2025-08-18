// 申明TypeScript 如何处理 CSS 导入
declare module '*.css' {
    const css: string;
    export default css;
}