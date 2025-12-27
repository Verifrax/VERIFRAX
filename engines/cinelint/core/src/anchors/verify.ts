export const ANCHOR_VERDICT = ["ANCHORS_VALID"] as const;
export type AnchorVerdict = typeof ANCHOR_VERDICT[number];

export const verifyAnchors = async (anchors: any[]): Promise<AnchorVerdict> => {
  if (!anchors || anchors.length < 2) throw new Error("INSUFFICIENT_ANCHORS");
  const types = new Set(anchors.map((a: any) => a.anchorType));
  if (types.size < 2) throw new Error("ANCHOR_DIVERSITY_REQUIRED");
  return "ANCHORS_VALID";
};
