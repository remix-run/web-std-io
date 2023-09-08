/**
 * Headers.js
 *
 * Headers class offers convenient helpers
 */

import http from 'http';
import { Headers as HeadersPolyfill } from 'headers-polyfill';

const validators = /** @type {{validateHeaderName?:(name:string) => any, validateHeaderValue?:(name:string, value:string) => any}} */
(http)

const validateHeaderName = typeof validators.validateHeaderName === 'function' ?
	validators.validateHeaderName :
	/**
	 * @param {string} name
	 */
	name => {
		if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
			const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
			Object.defineProperty(err, 'code', {value: 'ERR_INVALID_HTTP_TOKEN'});
			throw err;
		}
	};

const validateHeaderValue = typeof validators.validateHeaderValue === 'function' ?
	validators.validateHeaderValue :
	/**
	 * @param {string} name
	 * @param {string} value
	 */
	(name, value) => {
		if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
			const err = new TypeError(`Invalid character in header content ["${name}"]`);
			Object.defineProperty(err, 'code', {value: 'ERR_INVALID_CHAR'});
			throw err;
		}
	};

/**
 *  @typedef {import("headers-polyfill").HeadersObject} HeadersObject
 *  @typedef {import("headers-polyfill").HeadersList} HeadersList
 *  @typedef {Headers | HeadersObject | HeadersList} HeadersInit
 */

export default HeadersPolyfill;

/**
 * Create a Headers object from an http.IncomingMessage.rawHeaders, ignoring those that do
 * not conform to HTTP grammar productions.
 * @param {import('http').IncomingMessage['rawHeaders']} headers
 */
export function fromRawHeaders(headers = []) {
	let init = headers
    // Split into pairs
    .reduce((result, _, index, array) => {
    	if (index % 2 === 0) {
    		let [k, v] = array.slice(index, index + 2);
    		result.push([k, v]);
    	}
    	return result;
    }, /** @type {[string, string][]} */([]))
    .filter(([name, value]) => {
    	try {
    		validateHeaderName(name);
    		validateHeaderValue(name, String(value));
    		return true;
    	} catch {
    		return false;
    	}
    });
	return new HeadersPolyfill(init);
}
