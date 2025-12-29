import { attestEngine } from "./engine.attest"
import { generateSBOM } from "../sbom/generate"

export function buildAttestation(binary: string, files: string[]) {
  return {
    engine: attestEngine(binary),
    sbom: generateSBOM(files),
    issuedAt: new Date().toISOString()
  }
}
