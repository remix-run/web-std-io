import { Response } from "@remix-run/web-fetch"
import { Blob } from "@remix-run/web-blob"
import { assert } from "./test.js"

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("nodefetch recognizes blobs", async () => {
    const response = new Response(new Blob(["hello"]))

    assert.equal(await response.text(), "hello")
  })
}
