/* tslint:disable */
/* eslint-disable */
/**
*/
export class App {
  free(): void;
/**
* @param {string} element_id
*/
  constructor(element_id: string);
/**
* @param {number} delta_time
* @param {number} canvas_height
* @param {number} canvas_width
*/
  update(delta_time: number, canvas_height: number, canvas_width: number): void;
/**
*/
  render(): void;
/**
* @param {number} lat
* @param {number} lon
* @param {number} alt
*/
  add_fireball(lat: number, lon: number, alt: number): void;
/**
* @param {Uint32Array} list
*/
  static set_filter(list: Uint32Array): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_app_free: (a: number) => void;
  readonly app_new: (a: number, b: number) => number;
  readonly app_update: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly app_render: (a: number, b: number) => void;
  readonly app_add_fireball: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly app_set_filter: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h23d9e4ca3e4111cd: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hfb46c97fd1fe0f0f: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* Synchronously compiles the given `bytes` and instantiates the WebAssembly module.
*
* @param {BufferSource} bytes
*
* @returns {InitOutput}
*/
export function initSync(bytes: BufferSource): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
