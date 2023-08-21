// On the web we just export native fetch implementation
export { FormData, File  } from './package.js';
export const { Headers, Request, Response } = globalThis;
export default globalThis.fetch.bind(globalThis)
