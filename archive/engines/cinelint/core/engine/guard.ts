import path from "path";

export function assertCineLintPath(p: string) {
  if (p.includes("MK10-PRO")) {
    throw new Error("MK10-PRO access is forbidden in Verifrax");
  }
  return path.resolve(p);
}





