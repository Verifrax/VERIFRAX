export async function verifyEthAnchor({ rpc, tx_hash, expected_commitment }) {
  if (!rpc) throw new Error("missing rpc");
  if (!tx_hash) throw new Error("missing tx_hash");

  // Hard fail on placeholder / invalid URLs
  if (rpc.includes("<") || rpc.includes(">")) {
    throw new Error(`invalid rpc url placeholder: ${rpc}`);
  }
  let u;
  try { u = new URL(rpc); } catch { throw new Error(`invalid rpc url: ${rpc}`); }
  if (!/^https?:$/.test(u.protocol)) throw new Error(`rpc url must be http(s): ${rpc}`);

  // First check if transaction exists
  const txBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getTransactionByHash",
    params: [tx_hash],
  };

  const txRes = await fetch(rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(txBody),
  });
  if (!txRes.ok) throw new Error(`rpc http ${txRes.status}`);
  const txJson = await txRes.json();
  if (!txJson.result) {
    throw new Error(`tx not found on this RPC: ${tx_hash}`);
  }

  // Then get receipt
  const receiptBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getTransactionReceipt",
    params: [tx_hash],
  };

  const res = await fetch(rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(receiptBody),
  });
  if (!res.ok) throw new Error(`rpc http ${res.status}`);

  const j = await res.json();
  const r = j.result;
  if (!r) {
    throw new Error("receipt not yet available (pending or pruned)");
  }
  if (!r.status || r.status === "0x0") throw new Error("tx failed");

  const hay = JSON.stringify(r).toLowerCase();
  if (expected_commitment && !hay.includes(String(expected_commitment).toLowerCase())) {
    throw new Error("commitment mismatch: commitment not found in receipt");
  }

  return { ok: true, blockNumber: r.blockNumber };
}
