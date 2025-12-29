import { audit } from "../consensus/audit";

export const slashEngine = (engineId: string, reason: string) => {
  audit({
    domain: "FEDERATED",
    type: "ENGINE_SLASH",
    engineId,
    reason,
    at: new Date().toISOString()
  });

  audit({
    domain: "FEDERATED",
    type: "ENGINE_EXPELLED",
    engineId
  });

  process.exit(1);
};

