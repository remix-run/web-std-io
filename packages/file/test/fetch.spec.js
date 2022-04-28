import { Response } from "@remix-run/web-fetch";
import { File } from "@remix-run/web-file";
import { assert } from "./test.js";

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("node-fetch recognizes blobs", async () => {
    const response = new Response(new File(["hello"], "path/file.txt"));

    assert.equal(await response.text(), "hello");
  });
};
