let killed = false;

export const engageKillSwitch = () => {
  killed = true;
  process.exit(1);
};

export const assertAlive = () => {
  if (killed) throw new Error("ENGINE_PERMANENTLY_DISABLED");
};

