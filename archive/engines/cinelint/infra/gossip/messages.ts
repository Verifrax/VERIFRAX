export type GossipMessage =
  | { type: "proposal"; payload: unknown }
  | { type: "vote"; payload: unknown }
  | { type: "commit"; payload: unknown }
