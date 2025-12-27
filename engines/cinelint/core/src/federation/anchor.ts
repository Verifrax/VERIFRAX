export interface Anchor {
  root: string;
  anchoredAt: string;
  anchorType: "ETH" | "BTC" | "REKOR";
}

export const anchorRoot = (root: string, anchorType: Anchor["anchorType"]): Anchor =>
  Object.freeze({
    root,
    anchorType,
    anchoredAt: new Date().toISOString()
  });

import { verifyAnchors } from "../anchors/verify";

export const requireMultiAnchor = async (anchors: Anchor[]) => {
  const types = new Set(anchors.map(a => a.anchorType));
  if (types.size < 2) throw new Error("INSUFFICIENT_ANCHOR_DIVERSITY");
  const verdict = await verifyAnchors(anchors);
  return verdict === "ANCHORS_VALID";
};
