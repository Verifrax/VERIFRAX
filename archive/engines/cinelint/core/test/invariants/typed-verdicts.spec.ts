import { verifyFinalityProof } from "../../zk/backend/halo2/finality.verify";
import { verifyAnchors } from "../../anchors/verify";
import { verifyHardware } from "../../attestation/hardware/verify";
import { publishFinality } from "../../transparency/public.log";

describe("Typed verdict invariants", () => {
  it("ZK returns VALID only", () => {
    expect(() => verifyFinalityProof(new Uint8Array([1]), new Uint8Array([1]), {}))
      .toBe("VALID");
  });

  it("Anchors return ANCHORS_VALID only", async () => {
    await expect(verifyAnchors([{ anchorType: "ETH" }, { anchorType: "BTC" }]))
      .resolves.toBe("ANCHORS_VALID");
  });

  it("Hardware never returns boolean", () => {
    expect(() => verifyHardware()).toThrow();
  });

  it("Transparency returns FINALITY_PUBLISHED only", async () => {
    await expect(publishFinality({ root: "x" }))
      .resolves.toBe("FINALITY_PUBLISHED");
  });
});

