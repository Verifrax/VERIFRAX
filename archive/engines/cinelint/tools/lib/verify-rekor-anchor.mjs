export async function verifyRekorAnchor({ rekor_url, uuid, expected }) {
  const base = rekor_url || "https://rekor.sigstore.dev";
  if (!uuid) throw new Error("missing uuid");

  const url = `${base}/api/v1/log/entries/${uuid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`rekor http ${res.status}`);
  const j = await res.json();

  const entry = j[uuid];
  if (!entry) throw new Error("rekor entry missing");

  const hay = JSON.stringify(entry).toLowerCase();
  if (expected && !hay.includes(String(expected).toLowerCase())) {
    throw new Error("expected commitment not found in rekor entry");
  }
  if (!entry.verification || !entry.verification.inclusionProof) {
    throw new Error("missing inclusionProof");
  }
  return { ok: true, logIndex: entry.logIndex };
}
