import * as WebFetch from "./fetch.js"

export { ReadableStream, Blob, FormData  } from './package.js';
// Node 18+ introduces fetch API globally and it doesn't support our use-cases yet.
// For now we always use the polyfill.

// Marking export as a DOM File object instead of custom class.
export const fetch = /** @type {typeof globalThis.fetch} */
  WebFetch.fetch

export const Headers = WebFetch.Headers
export const Request = WebFetch.Request
export const Response = WebFetch.Response

export default fetch
