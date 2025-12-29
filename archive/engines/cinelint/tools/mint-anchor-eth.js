import { ethers } from "ethers";

const RPC = process.env.CINELINT_ETH_RPC;
const PK  = process.env.CINELINT_ETH_PK;
const DATA = process.env.CINELINT_COMMITMENT; // 0x...
if (!RPC) throw new Error("Set CINELINT_ETH_RPC");
if (!PK) throw new Error("Set CINELINT_ETH_PK (funded key for selected chain)");
if (!DATA || !/^0x[0-9a-fA-F]{64}$/.test(DATA)) throw new Error("Set CINELINT_COMMITMENT to 0x + 64 hex");

const provider = new ethers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(PK, provider);

const tx = await wallet.sendTransaction({
  to: wallet.address,
  value: 0n,
  data: DATA,
});
console.log("tx_hash:", tx.hash);
const r = await tx.wait();
console.log("mined:", r.hash, "block:", r.blockNumber, "status:", r.status);

