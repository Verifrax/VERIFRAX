import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState("");
  const [result, setResult] = useState<any>(null);

  async function run() {
    if (!file || !profile) return;

    const form = new FormData();
    form.append("file", file);
    form.append("profile", profile);

    const res = await fetch("http://localhost:3333/run", {
      method: "POST",
      body: form
    });

    const json = await res.json();
    setResult(json);
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Verifrax</h1>

      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <br /><br />

      <input
        type="text"
        placeholder="Profile path"
        value={profile}
        onChange={e => setProfile(e.target.value)}
        style={{ width: 400 }}
      />
      <br /><br />

      <button onClick={run}>Run Validation</button>

      {result && (
        <pre style={{ marginTop: 24 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}





