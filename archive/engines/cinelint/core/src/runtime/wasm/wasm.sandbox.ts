export interface WasmSandbox {
  execute(bytes: Uint8Array, input: any): Promise<any>
}
