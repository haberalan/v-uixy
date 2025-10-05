declare module "*.css" {
  const content: { [key: string]: CSSProperties };
  export default content;
}
