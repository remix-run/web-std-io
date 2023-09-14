/**
 * Headers.js
 *
 * Headers class offers convenient helpers
 */

import {types} from 'util';
import http from 'http';
import { isIterable } from './utils/is.js'

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
 * @typedef {Headers | Record<string, string> | Iterable<readonly [string, string]> | Iterable<Iterable<string>>} HeadersInit
 */

/**
 * This Fetch API interface allows you to perform various actions on HTTP request and response headers.
 * These actions include retrieving, setting, adding to, and removing.
 * A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs.
 * You can add to this using methods like append() (see Examples.)
 * In all methods of this interface, header names are matched by case-insensitive byte sequence.
 *
 * @implements {globalThis.Headers}
 */
export default class Headers {
	/** @type {Map<string, string[]>} */
	#pairs = new Map();

	/**
	 * Headers class
	 *
	 * @constructor
	 * @param {HeadersInit} [init] - Response headers
	 */
	constructor(init) {
		if (init instanceof Headers) {
			for (const [name, value] of init.entries()) {
				this.append(name, value);
			}
		} else if (init == null) { // eslint-disable-line no-eq-null, eqeqeq
			// No op
		} else if (isIterable(init)) {
			// Sequence<sequence<ByteString>>
			// Note: per spec we have to first exhaust the lists then process them
			[...init].map(pair => {
					if (
						typeof pair !== 'object' || types.isBoxedPrimitive(pair)
					) {
						throw new TypeError('Each header pair must be an iterable object');
					}

					return [...pair];
				}).forEach(pair => {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}

					this.append(pair[0], pair[1]);
				});
		// } else if (Symbol.iterator in init && typeof init[Symbol.iterator] !== 'function') {
		// 	throw new TypeError("Failed to construct 'Headers': @@iterator must be a callable.")
		} else if (typeof init === "object" && init !== null) {
			for (const [name, value] of Object.entries(init)) {
				this.append(name, value);
			}
		} else {
			throw new TypeError('Failed to construct \'Headers\': The provided value is not of type \'(sequence<sequence<ByteString>> or record<ByteString, ByteString>)');
		}
	}

	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}

	toString() {
		return Object.prototype.toString.call(this);
	}

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		validateHeaderName(name)
		return this.#pairs.has(name);
	}

	/**
	 * @param {string} name
	 * @param {string} value
	 */
	set(name, value) {
		validateHeaderName(name);
		validateHeaderValue(name, value);
		name = name.toLowerCase();
		this.#pairs.set(name, [value]);
	}

	/**
	 * @param {string} name
	 * @param {string} value
	 */
	append(name, value) {
		validateHeaderName(name);
		validateHeaderValue(name, value);
		name = name.toLowerCase();
		let values = this.#pairs.get(name);
		if (values != null) {
			this.#pairs.set(name, [...values, value]);
		} else {
			this.#pairs.set(name, [value]);
		}
	}

	/**
	 * @param {string} name
	 */
	get(name) {
		validateHeaderName(name);
		const values = this.#pairs.get(name.toLowerCase());
		if (values == null) {
			return null;
		}

		let value = values.join(', ');
		if (/^content-encoding$/i.test(name)) {
			value = value.toLowerCase();
		}

		return value;
	}

	/**
	 * @returns {string[]}
	 */
	getSetCookie() {
		// Raw access - requires lowercase
		const values = this.#pairs.get('set-cookie');
		return values || [];
	}

  /**
	 * @param {string} name
	 * @returns {void}
	 */
	delete(name) {
		validateHeaderName(name)
		this.#pairs.delete(name);
	}

	/**
	 * @param {(value: string, key: string, parent: this) => void} callback
	 * @param {any} thisArg
	 * @returns {void}
	 */
	forEach(callback, thisArg = undefined) {
		for (let [name, value] of this.entries()) {
			callback.apply(thisArg, [value, name, this])
		}
	}

	/**
	 * @returns {IterableIterator<[string, string]>}
	 */
	entries() {
		/** @type [string,string][] */
		let entries = [];
		for (const name of this.#pairs.keys()) {
			if (name.toLowerCase() === 'set-cookie') {
				let cookies = this.getSetCookie();
				for (let cookie of cookies) {
					entries.push([name, cookie]);
				}
			} else {
				let value = this.get(name)
				if (value != null) {
					entries.push([name, value]);
				}
			}
		}
		entries.sort((a, b) => a[0].localeCompare(b[0]));
		return entries[Symbol.iterator]();
	}

	keys() {
		return [...this.entries()].map(e => e[0])[Symbol.iterator]();
	}

	values() {
		return [...this.entries()].map(e => e[1])[Symbol.iterator]();
	}

	[Symbol.iterator]() {
		return this.entries();
	}

	/**
	 * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
	 */
	[Symbol.for('nodejs.util.inspect.custom')]() {
		debugger;
		return [...this.keys()].reduce((result, key) => {
			const values = this.#pairs.get(key);
			if (!values  || values.length === 0) {
				return result;
			}

			// Http.request() only supports string as Host header.
			// This hack makes specifying custom Host header possible.
			if (key === 'host') {
				result[key] = values[0];
			} else {
				result[key] = values.length > 1 ? values : values[0];
			}

			return result;
		}, /** @type {Record<string, string|string[]>} */({}));
	}
}

/**
 * Create a Headers object from an http.IncomingMessage.rawHeaders, ignoring those that do
 * not conform to HTTP grammar productions.
 * @param {import('http').IncomingMessage['rawHeaders']} headers
 */
export function fromRawHeaders(headers = []) {
	return new Headers(
		headers
			// Split into pairs
			.reduce((result, value, index, array) => {
				if (index % 2 === 0) {
					result.push(array.slice(index, index + 2));
				}

				return result;
			}, /** @type {string[][]} */([]))
			.filter(([name, value]) => {
				try {
					validateHeaderName(name);
					validateHeaderValue(name, String(value));
					return true;
				} catch {
					return false;
				}
			})

	);
}
