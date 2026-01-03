// Static HTML pages embedded in Worker
export const staticPages: Record<string, string> = {
  '/': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Deterministic Verification Execution</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; }
    .rule { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; }
    nav { margin: 2rem 0; }
    nav a { margin-right: 1rem; }
  </style>
</head>
<body>
  <h1>VERIFRAX</h1>
  <p><strong>Version:</strong> v2.7.0 | <strong>State:</strong> Frozen | <strong>Mode:</strong> Deterministic · Non-Interpretive · Irreversible</p>
  <nav>
    <a href="/verify">Execute</a>
    <a href="/pricing">Pricing</a>
    <a href="/legal">Legal</a>
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a>
    <a href="/refunds">Refunds</a>
    <a href="/status">Status</a>
  </nav>
  <h2>What VERIFRAX Is</h2>
  <p>VERIFRAX is a deterministic software verification service that accepts payment, mints execution tokens, executes deterministic verification, and generates immutable certificates.</p>
  <h2>What VERIFRAX Is Not</h2>
  <ul>
    <li><strong>Not a truth verification service</strong> — VERIFRAX does not verify the truth, accuracy, or legal validity of evidence</li>
    <li><strong>Not an advisory service</strong> — VERIFRAX provides no interpretation, guidance, or recommendations</li>
    <li><strong>Not a custody service</strong> — VERIFRAX does not hold, manage, or control user funds beyond payment processing</li>
    <li><strong>Not a general-purpose storage service</strong> — Evidence bundles are retained solely as a by-product of execution finality</li>
  </ul>
  <div class="rule">
    <p><strong>Determinism & Finality:</strong> One payment → one execution → one certificate. Identical inputs produce identical outputs. Execution is irreversible.</p>
  </div>
  <div class="rule">
    <p><strong>Non-Reliance:</strong> No party may rely on a VERIFRAX certificate as a substitute for independent verification, legal judgment, or regulatory determination.</p>
  </div>
  <p><a href="/verify">→ Execute Verification</a></p>
</body>
</html>`,

  '/verify': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Execute Verification</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    form { margin: 2rem 0; }
    .field { margin: 1rem 0; }
    label { display: block; font-weight: bold; margin-bottom: 0.5rem; }
    input, select, textarea { width: 100%; padding: 0.5rem; font-size: 1rem; border: 1px solid #ccc; box-sizing: border-box; }
    button { background: #000; color: #fff; padding: 0.75rem 2rem; border: none; cursor: pointer; font-size: 1rem; }
    button:hover { background: #333; }
    .error { background: #fee; padding: 1rem; margin: 1rem 0; border-left: 4px solid #c00; }
    .success { background: #efe; padding: 1rem; margin: 1rem 0; border-left: 4px solid #0c0; }
    code { background: #f5f5f5; padding: 0.2rem 0.4rem; }
    .payment-section { margin: 2rem 0; padding: 1rem; background: #f5f5f5; border-left: 4px solid #000; }
    .payment-button { background: #000; color: #fff; padding: 0.75rem 2rem; border: none; cursor: pointer; font-size: 1rem; margin: 0.5rem 0; width: 100%; }
    .payment-button:hover { background: #333; }
    .payment-button:disabled { background: #ccc; cursor: not-allowed; }
    .legal-copy { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Execute Verification</h1>
  <p><a href="/">← Back to Home</a></p>
  <div id="error" class="error" style="display: none;"></div>
  <div id="success" class="success" style="display: none;"></div>
  <div id="paymentSection" class="payment-section" style="display: none;">
    <h2>Pay & Generate Execution Token</h2>
    <p>You need an execution token to proceed. Generate one by completing payment:</p>
    <button class="payment-button" id="payTierA" onclick="initiatePayment('A')">Pay & Generate Execution Token — Tier A (€650)</button>
    <button class="payment-button" id="payTierB" onclick="initiatePayment('B')">Pay & Generate Execution Token — Tier B (€1,500)</button>
    <div class="legal-copy">
      <p><strong>One payment authorizes exactly one deterministic execution. No retries. No refunds due to outcome. No interpretation.</strong></p>
    </div>
  </div>
  <form id="verifyForm" enctype="multipart/form-data">
    <div class="field">
      <label for="token">Execution Token (Bearer Token)</label>
      <textarea id="token" name="token" rows="3" required placeholder="v1.eyJqdGkiOi..."></textarea>
      <small>Paste the execution token received after payment completion.</small>
    </div>
    <div class="field">
      <label for="profile_id">Verification Profile</label>
      <select id="profile_id" name="profile_id" required>
        <option value="">Select profile...</option>
        <option value="public@1.0.0">public@1.0.0</option>
        <option value="priority@1.0.0">priority@1.0.0</option>
      </select>
    </div>
    <div class="field">
      <label for="bundle">Evidence Bundle (Binary File)</label>
      <input type="file" id="bundle" name="bundle" required accept="*/*">
      <small>Upload the evidence bundle file to be verified.</small>
    </div>
    <button type="submit">Execute Verification</button>
  </form>
  <div class="legal-copy">
    <p><strong>One payment authorizes exactly one deterministic execution. No retries. No refunds due to outcome. No interpretation.</strong></p>
  </div>
  <h2>Error States</h2>
  <ul>
    <li><code>MISSING_TOKEN</code> — No execution token provided</li>
    <li><code>INVALID_TOKEN_FORMAT</code> — Token format is invalid</li>
    <li><code>INVALID_SIGNATURE</code> — Token signature verification failed</li>
    <li><code>TOKEN_EXPIRED</code> — Token has expired</li>
    <li><code>TOKEN_NOT_FOUND</code> — Token not found in system</li>
    <li><code>TOKEN_ALREADY_USED</code> — Token has already been consumed</li>
    <li><code>MISSING_FIELDS</code> — Required fields (bundle, profile_id) are missing</li>
  </ul>
  <script>
    // Check for session_id query param and auto-fill token
    (async function() {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (sessionId) {
        try {
          const response = await fetch(\`/api/get-token?session_id=\${sessionId}\`);
          const result = await response.json();
          if (response.ok && result.token) {
            document.getElementById('token').value = result.token;
            document.getElementById('paymentSection').style.display = 'none';
          } else {
            document.getElementById('paymentSection').style.display = 'block';
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = 'Token not yet available. Please wait a moment and refresh, or complete payment.';
            errorDiv.style.display = 'block';
          }
        } catch (error) {
          document.getElementById('paymentSection').style.display = 'block';
        }
      } else {
        // Check if token field is empty, show payment section
        const tokenField = document.getElementById('token');
        if (!tokenField.value.trim()) {
          document.getElementById('paymentSection').style.display = 'block';
        }
      }
    })();

    async function initiatePayment(tier) {
      const errorDiv = document.getElementById('error');
      errorDiv.style.display = 'none';
      const buttonA = document.getElementById('payTierA');
      const buttonB = document.getElementById('payTierB');
      buttonA.disabled = true;
      buttonB.disabled = true;
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier })
        });
        const result = await response.json();
        if (!response.ok) {
          errorDiv.textContent = \`Error: \${result.error || 'Payment initiation failed'}\`;
          errorDiv.style.display = 'block';
          buttonA.disabled = false;
          buttonB.disabled = false;
        } else {
          window.location.href = result.checkout_url;
        }
      } catch (error) {
        errorDiv.textContent = \`Network error: \${error.message}\`;
        errorDiv.style.display = 'block';
        buttonA.disabled = false;
        buttonB.disabled = false;
      }
    }

    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorDiv = document.getElementById('error');
      const successDiv = document.getElementById('success');
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';
      const token = document.getElementById('token').value.trim();
      const profileId = document.getElementById('profile_id').value;
      const bundleFile = document.getElementById('bundle').files[0];
      if (!token || !profileId || !bundleFile) {
        errorDiv.textContent = 'All fields are required';
        errorDiv.style.display = 'block';
        return;
      }
      const formData = new FormData();
      formData.append('bundle', bundleFile);
      formData.append('profile_id', profileId);
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Authorization': \`Bearer \${token}\` },
          body: formData
        });
        const result = await response.json();
        if (!response.ok) {
          errorDiv.textContent = \`Error: \${result.error || 'Unknown error'}\`;
          errorDiv.style.display = 'block';
        } else {
          const certHash = result.certificate_hash;
          successDiv.innerHTML = \`Verification complete. Certificate hash: <code>\${certHash}</code><br><a href="/certificate/\${certHash}">View Certificate</a>\`;
          successDiv.style.display = 'block';
        }
      } catch (error) {
        errorDiv.textContent = \`Network error: \${error.message}\`;
        errorDiv.style.display = 'block';
      }
    });
  </script>
</body>
</html>`,

  '/pricing': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Pricing</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: bold; }
    .rule { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; }
    .payment-button { background: #000; color: #fff; padding: 0.75rem 2rem; border: none; cursor: pointer; font-size: 1rem; margin: 0.5rem 0; width: 100%; }
    .payment-button:hover { background: #333; }
    .payment-button:disabled { background: #ccc; cursor: not-allowed; }
    .payment-section { margin: 2rem 0; }
    .legal-copy { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; font-size: 0.9rem; }
    .error { background: #fee; padding: 1rem; margin: 1rem 0; border-left: 4px solid #c00; }
  </style>
</head>
<body>
  <h1>Pricing</h1>
  <p><a href="/">← Back to Home</a></p>
  <table>
    <thead>
      <tr><th>Tier</th><th>Description</th><th>Price</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>A</td>
        <td>Public Deterministic Verification</td>
        <td>€650</td>
      </tr>
      <tr>
        <td>B</td>
        <td>Priority Deterministic Verification</td>
        <td>€1,500</td>
      </tr>
    </tbody>
  </table>
  <div class="payment-section">
    <h2>Pay & Generate Execution Token</h2>
    <div id="error" class="error" style="display: none;"></div>
    <button class="payment-button" id="payTierA" onclick="initiatePayment('A')">Pay & Generate Execution Token — Tier A (€650)</button>
    <button class="payment-button" id="payTierB" onclick="initiatePayment('B')">Pay & Generate Execution Token — Tier B (€1,500)</button>
    <div class="legal-copy">
      <p><strong>One payment authorizes exactly one deterministic execution. No retries. No refunds due to outcome. No interpretation.</strong></p>
    </div>
  </div>
  <div class="rule">
    <p><strong>Payment Terms:</strong></p>
    <ul>
      <li>One-time payment only (no subscription)</li>
      <li>One execution per payment</li>
      <li>No account required</li>
      <li>Payment processed by Stripe</li>
      <li>VAT may apply (EU customers)</li>
    </ul>
  </div>
  <div class="rule">
    <p><strong>What You Receive:</strong></p>
    <ul>
      <li>One execution token (single-use, time-limited)</li>
      <li>One deterministic verification execution</li>
      <li>One certificate (canonical JSON, content-addressed, immutable)</li>
      <li>Certificate retrieval via <code>/certificate/{hash}</code></li>
    </ul>
  </div>
  <script>
    async function initiatePayment(tier) {
      const errorDiv = document.getElementById('error');
      errorDiv.style.display = 'none';
      const buttonA = document.getElementById('payTierA');
      const buttonB = document.getElementById('payTierB');
      buttonA.disabled = true;
      buttonB.disabled = true;
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier })
        });
        const result = await response.json();
        if (!response.ok) {
          errorDiv.textContent = \`Error: \${result.error || 'Payment initiation failed'}\`;
          errorDiv.style.display = 'block';
          buttonA.disabled = false;
          buttonB.disabled = false;
        } else {
          window.location.href = result.checkout_url;
        }
      } catch (error) {
        errorDiv.textContent = \`Network error: \${error.message}\`;
        errorDiv.style.display = 'block';
        buttonA.disabled = false;
        buttonB.disabled = false;
      }
    }
  </script>
</body>
</html>`,

  '/terms': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Terms of Service</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; }
    .rule { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; }
  </style>
</head>
<body>
  <h1>Terms of Service</h1>
  <p><strong>Version:</strong> v2.7.0 | <strong>Effective:</strong> 2026-01-03</p>
  <p><a href="/">← Back to Home</a></p>
  <h2>1. Service Description</h2>
  <p>VERIFRAX is a deterministic software verification service. One payment authorizes exactly one execution. Execution is irreversible. Certificate issuance closes the dispute space permanently.</p>
  <h2>2. Payment and Execution</h2>
  <ul>
    <li>One payment → one execution → one certificate</li>
    <li>No retries, no re-execution, no refunds due to outcome, dissatisfaction, or third-party rejection</li>
    <li>Execution tokens are single-use and cannot be recovered if lost</li>
    <li>Execution is deterministic: identical inputs produce identical outputs</li>
  </ul>
  <h2>3. Non-Interpretive Service</h2>
  <p>VERIFRAX provides no advice, no interpretation, no opinions. VERIFRAX executes computation. It does not judge meaning.</p>
  <div class="rule">
    <p><strong>Non-Reliance:</strong> No party may rely on a VERIFRAX certificate as a substitute for independent verification, legal judgment, or regulatory determination.</p>
  </div>
  <h2>4. What VERIFRAX Is Not</h2>
  <ul>
    <li>Not a truth verification service</li>
    <li>Not an advisory service</li>
    <li>Not a custody service</li>
    <li>Not a dispute resolution service</li>
    <li>Not a certification authority</li>
    <li>Not a guarantee service</li>
  </ul>
  <h2>5. Version Scope</h2>
  <p>These terms apply to VERIFRAX v2.7.0 only. Future versions are separate systems, not updates to v2.7.0.</p>
  <h2>6. Governing Law</h2>
  <p>These terms are governed by the laws of Italy. Jurisdiction: Milan, Italy.</p>
  <p><a href="/legal">→ Full Legal Documentation</a></p>
</body>
</html>`,

  '/privacy': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Privacy Policy</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; }
    .rule { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p><strong>Version:</strong> v2.7.0 | <strong>Effective:</strong> 2026-01-03</p>
  <p><a href="/">← Back to Home</a></p>
  <h2>1. No Accounts, No Profiling</h2>
  <p>VERIFRAX does not require user accounts. No user profiling, no resale of data, no marketing databases.</p>
  <h2>2. Data Collection</h2>
  <p>VERIFRAX collects and processes:</p>
  <ul>
    <li><strong>Payment data:</strong> Processed by Stripe (payment processor). VERIFRAX receives payment confirmation webhooks only.</li>
    <li><strong>Evidence bundles:</strong> Retained solely as a by-product of execution finality and certificate reproducibility, not as a custodial or access service.</li>
    <li><strong>Execution tokens:</strong> Stored in key-value store (Cloudflare KV) with state tracking (issued/burned).</li>
    <li><strong>Certificates:</strong> Stored in immutable storage (Cloudflare R2) at content-addressed paths.</li>
  </ul>
  <h2>3. Data Retention</h2>
  <ul>
    <li><strong>Evidence bundles:</strong> Retained permanently as part of certificate reproducibility (immutable storage).</li>
    <li><strong>Certificates:</strong> Retained permanently (immutable storage).</li>
    <li><strong>Execution tokens:</strong> Retained permanently with state tracking (for audit and finality enforcement).</li>
  </ul>
  <h2>4. Lawful Basis (GDPR)</h2>
  <p>Processing is based on:</p>
  <ul>
    <li><strong>Contract:</strong> Payment and execution service delivery</li>
    <li><strong>Legitimate interest:</strong> Certificate reproducibility and execution finality enforcement</li>
  </ul>
  <h2>5. Data Subject Rights</h2>
  <p>Under GDPR, you have rights to access, rectification, erasure, restriction, portability, and objection. However:</p>
  <ul>
    <li>Evidence bundles and certificates are immutable (cannot be modified or deleted)</li>
    <li>Execution tokens are required for finality enforcement (cannot be deleted)</li>
    <li>Requests for data subject rights should be sent to: legal@verifrax.net</li>
  </ul>
  <h2>6. Data Storage Location</h2>
  <p>Data is stored in Cloudflare infrastructure (EU/US). Payment processing is handled by Stripe (see Stripe privacy policy).</p>
  <h2>7. No Third-Party Sharing</h2>
  <p>VERIFRAX does not share data with third parties except:</p>
  <ul>
    <li>Stripe (payment processing)</li>
    <li>Cloudflare (infrastructure provider)</li>
  </ul>
  <p><a href="/legal">→ Full Legal Documentation</a></p>
</body>
</html>`,

  '/refunds': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Refund Policy</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; }
    .rule { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; }
    .no-refund { background: #fee; padding: 1rem; margin: 1rem 0; border-left: 4px solid #c00; }
  </style>
</head>
<body>
  <h1>Refund Policy</h1>
  <p><strong>Version:</strong> v2.7.0 | <strong>Effective:</strong> 2026-01-03</p>
  <p><a href="/">← Back to Home</a></p>
  <h2>Refund Eligibility</h2>
  <p>Refunds are available <strong>only</strong> for system non-execution:</p>
  <ul>
    <li>Payment completed but execution token never minted due to platform fault</li>
    <li>System failure preventing execution completion</li>
    <li>Infrastructure failure preventing certificate generation</li>
  </ul>
  <div class="no-refund">
    <h2>No Refund For:</h2>
    <ul>
      <li>Execution outcome dissatisfaction</li>
      <li>Third-party rejection of certificate</li>
      <li>User error (wrong evidence, wrong profile, etc.)</li>
      <li>Certificate interpretation disputes</li>
      <li>Lost execution tokens</li>
      <li>Expired execution tokens</li>
      <li>Successful execution (certificate generated)</li>
    </ul>
  </div>
  <h2>Refund Process</h2>
  <p>To request a refund for system non-execution:</p>
  <ol>
    <li>Contact: legal@verifrax.net</li>
    <li>Provide: Payment intent ID, evidence of system failure</li>
    <li>Review period: 30 days</li>
    <li>Refund method: Original payment method via Stripe</li>
  </ol>
  <div class="rule">
    <p><strong>Payment Processor:</strong> Stripe is the payment processor. Stripe is not an arbiter of meaning, interpretation, or certificate validity.</p>
  </div>
  <h2>Execution Finality</h2>
  <p>One payment → one execution → one certificate. Execution is irreversible. Certificate issuance closes the dispute space permanently. No refund is available as a consequence of execution outcome, dissatisfaction, or third-party rejection.</p>
  <p><a href="/legal">→ Full Legal Documentation</a></p>
</body>
</html>`,

  '/legal': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VERIFRAX — Legal Documentation</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1 { border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; }
    .doc { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-left: 4px solid #000; }
    .doc a { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Legal Documentation</h1>
  <p><strong>Version:</strong> v2.7.0 | <strong>Status:</strong> Frozen</p>
  <p><a href="/">← Back to Home</a></p>
  <h2>Authority Documents</h2>
  <p>All documents are public, static, and version-locked to v2.7.0.</p>
  <div class="doc">
    <h3><a href="/legal/SYSTEM_DEFINITION_STATEMENT_v2.7.0.md">System Definition Statement</a></h3>
    <p>Defines what VERIFRAX is and is not. Mechanical behavior only. No outcome claims.</p>
  </div>
  <div class="doc">
    <h3><a href="/legal/EXECUTION_FINALITY_STATEMENT_v2.7.0.md">Execution Finality Statement</a></h3>
    <p>One payment → one execution → irreversible → dispute space closed. No exceptions.</p>
  </div>
  <div class="doc">
    <h3><a href="/legal/OPERATOR_NON_INTERFERENCE_DECLARATION_v2.7.0.md">Operator Non-Interference Declaration</a></h3>
    <p>Operator cannot alter executions, revoke certificates, recover tokens, or interfere with certificate validity.</p>
  </div>
  <div class="doc">
    <h3><a href="/legal/VERSION_FREEZE_AND_GOVERNANCE_NOTICE_v2.7.0.md">Version Freeze & Governance Notice</a></h3>
    <p>v2.7.0 is frozen permanently. Future versions are new systems, not updates.</p>
  </div>
  <div class="doc">
    <h3><a href="/legal/AUTHORITY_STATE_FINAL_v2.7.0.md">Authority State Final</a></h3>
    <p>Final sealed state declaration. Authority state: CLOSED.</p>
  </div>
  <h2>Public Pages</h2>
  <ul>
    <li><a href="/terms">Terms of Service</a></li>
    <li><a href="/privacy">Privacy Policy</a></li>
    <li><a href="/refunds">Refund Policy</a></li>
  </ul>
  <h2>Contact</h2>
  <p>Legal inquiries: legal@verifrax.net</p>
</body>
</html>`,
};

// Legal markdown documents
export const legalDocs: Record<string, string> = {
  '/legal/SYSTEM_DEFINITION_STATEMENT_v2.7.0.md': `# VERIFRAX SYSTEM DEFINITION STATEMENT — v2.7.0

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** FINAL  
**Authority:** VERIFRAX_AUTHORITY.lock

---

## 1. WHAT VERIFRAX IS

VERIFRAX is a deterministic software verification service that:

1. **Accepts payment** via Stripe Checkout Session (one-time payment, EUR)
2. **Mints execution tokens** upon successful payment confirmation (cryptographically signed, single-use)
3. **Accepts evidence bundles** (binary files) with a verification profile identifier
4. **Executes deterministic verification** using a specified verifier version
5. **Generates certificates** (canonical JSON documents) containing:
   - Evidence bundle hash (SHA-256)
   - Verification profile identifier
   - Verifier version
   - Execution timestamp
   - Verdict (verified/not_verified)
   - Reason codes (if any)
   - Certificate hash (SHA-256 of canonical certificate content)
6. **Stores certificates** in immutable storage (Cloudflare R2) at content-addressed paths
7. **Serves certificates** via public HTTP endpoint using certificate hash

---

## 2. WHAT VERIFRAX IS NOT

VERIFRAX is not:

1. **A truth verification service** — VERIFRAX does not verify the truth, accuracy, or legal validity of evidence
2. **An advisory service** — VERIFRAX provides no interpretation, guidance, or recommendations
3. **A custody service** — VERIFRAX does not hold, manage, or control user funds beyond payment processing
4. **A general-purpose storage or custody service** — Evidence bundles are retained solely as a by-product of execution finality and certificate reproducibility, not as a custodial or access service.
5. **A dispute resolution service** — VERIFRAX does not resolve disputes, mediate, or arbitrate
6. **A certification authority** — VERIFRAX does not issue certificates of authenticity, compliance, or legal standing
7. **A guarantee service** — VERIFRAX makes no guarantees about outcomes, acceptance, or third-party reliance

---

## 3. MECHANICAL BEHAVIOR (NO INTERPRETATION)

### Payment Processing

- Payment is processed by Stripe, not VERIFRAX
- Payment success is determined by Stripe webhook events
- VERIFRAX verifies webhook signatures using HMAC-SHA256
- Payment failure results in no execution token

### Token Generation

- Execution tokens are generated only upon successful payment confirmation
- Tokens are cryptographically signed using HMAC-SHA256
- Tokens contain: unique identifier (jti), tier, payment intent ID, amount, currency, issuance time, expiration time
- Tokens are single-use and cannot be recovered if lost
- Token expiration is enforced (default: 3600 seconds from issuance)

### Execution Process

- Execution requires a valid, unexpired, unused execution token
- Evidence bundle is accepted via multipart form upload
- Bundle hash is computed using SHA-256
- Verification profile identifier is required
- Execution is deterministic: same inputs produce same outputs
- Execution cannot be retried, modified, or reversed

### Certificate Generation

- Certificate content is determined solely by:
  - Evidence bundle hash
  - Verification profile identifier
  - Verifier version
  - Execution timestamp
  - Verdict (derived from verification)
  - Reason codes (derived from verification)
- Execution timestamps reflect system clock time at execution and are not representations of external event timing
- Certificate hash is computed from canonical JSON serialization (excluding certificate_hash field)
- Certificate is stored at path: \`cert/<certificate_hash>.json\`
- Certificate storage is write-once (no overwrite, no delete)

### Certificate Retrieval

- Certificates are retrievable via HTTP GET at \`/certificate/<certificate_hash>\`
- Certificate hash must be exactly 64 hexadecimal characters
- Invalid hash format returns HTTP 404
- Non-existent certificate returns HTTP 404
- Certificate content is returned as canonical JSON

---

## 4. NO CLAIMS

VERIFRAX makes no claims about:

- The truth, accuracy, or validity of evidence
- The legal effect or admissibility of certificates
- The acceptance of certificates by third parties (courts, regulators, etc.)
- The interpretation or meaning of verdicts
- The suitability of certificates for any purpose
- The continued availability of the service
- The accuracy or completeness of verification results

No party may rely on a VERIFRAX certificate as a substitute for independent verification, legal judgment, or regulatory determination.

---

## 5. SYSTEM BOUNDARIES

### VERIFRAX Controls

- Payment acceptance (via Stripe integration)
- Token generation and validation
- Execution scheduling and processing
- Certificate generation and storage
- Certificate retrieval

### VERIFRAX Does Not Control

- Payment processing (Stripe)
- Evidence bundle content or validity
- Third-party acceptance of certificates
- Certificate interpretation or legal effect
- Service availability (infrastructure provider: Cloudflare)
- Certificate validity after issuance (certificates are independently verifiable)

---

## 6. TECHNICAL SPECIFICATIONS

- **Payment Processing:** Stripe Checkout Sessions (one-time payment)
- **Token Signing:** HMAC-SHA256 with base64url encoding
- **Hash Algorithm:** SHA-256
- **Storage:** Cloudflare R2 (immutable, content-addressed)
- **Execution Platform:** Cloudflare Workers
- **Certificate Format:** Canonical JSON (deterministic field ordering)
- **API Surface:** Closed, enumerable endpoints only

---

## 7. VERSION IDENTIFICATION

This statement applies to VERIFRAX v2.7.0 only.

System version is identified by:
- \`VERIFIER_VERSION\` environment variable: \`v2.7.0\`
- Certificate field: \`verifier_version: "v2.7.0"\`
- Authority lock file: \`VERIFRAX_AUTHORITY.lock\`

Future versions are separate systems, not updates to v2.7.0.

---

**END OF SYSTEM DEFINITION STATEMENT**`,

  '/legal/EXECUTION_FINALITY_STATEMENT_v2.7.0.md': `# VERIFRAX EXECUTION FINALITY STATEMENT — v2.7.0

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** FINAL  
**Authority:** VERIFRAX_AUTHORITY.lock

---

## EXECUTION FINALITY RULE

**One payment authorizes exactly one execution. Execution is irreversible. Certificate issuance closes the dispute space permanently.**

---

## DETAILED PROVISIONS

### 1. Payment-to-Execution Binding

- One successful payment generates exactly one execution token
- One execution token authorizes exactly one execution
- Payment and execution are bound cryptographically (token signature)
- No payment authorizes multiple executions
- No execution occurs without payment

### 2. Execution Irreversibility

- Execution cannot be reversed, cancelled, or undone
- Execution cannot be modified after initiation
- Execution cannot be retried with the same token
- Execution failure does not create a new execution right
- Execution success does not create additional execution rights

### 3. Token Consumption

- Execution tokens are consumed (burned) upon use
- Token consumption is atomic and irreversible
- Token state transitions: \`issued\` → \`burned\` (one-way)
- No token recovery mechanism exists
- No token regeneration mechanism exists
- Lost tokens cannot be recovered

### 4. Certificate Issuance Finality

- Certificate issuance occurs exactly once per execution
- Certificate content is determined deterministically from execution inputs
- Certificate hash is computed from certificate content (excluding certificate_hash field)
- Certificate storage is write-once (no overwrite, no delete)
- Certificate issuance closes the execution transaction permanently

### 5. Dispute Space Closure

Upon certificate issuance:

- The execution transaction is closed
- No re-execution is possible under any circumstance
- No certificate modification is possible
- No certificate revocation is possible
- No refund is available as a consequence of execution outcome, dissatisfaction, or third-party rejection
- The dispute space for that execution is permanently closed

### 6. No Exceptions

This finality rule applies:

- Regardless of user error (wrong evidence, wrong profile, etc.)
- Regardless of outcome dissatisfaction
- Regardless of third-party rejection
- Regardless of certificate interpretation disputes
- Regardless of service availability issues
- Regardless of operator status or actions

### 7. Legal Effect

This statement defines the mechanical behavior of the VERIFRAX system.

It does not:

- Create legal obligations beyond those explicitly stated
- Modify existing legal relationships
- Create warranties or guarantees
- Limit liability beyond applicable law

It does:

- Establish the technical and operational boundaries of the system
- Define what the system will and will not do
- Provide clarity for legal interpretation

---

## QUOTABLE STATEMENT

**"One payment authorizes exactly one execution. Execution is irreversible. Certificate issuance closes the dispute space permanently. No exceptions."**

---

**END OF EXECUTION FINALITY STATEMENT**`,

  '/legal/OPERATOR_NON_INTERFERENCE_DECLARATION_v2.7.0.md': `# VERIFRAX OPERATOR NON-INTERFERENCE DECLARATION — v2.7.0

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** FINAL  
**Authority:** VERIFRAX_AUTHORITY.lock

---

## OPERATOR CAPABILITY LIMITATIONS

The VERIFRAX operator (the entity operating the VERIFRAX service) **cannot**:

1. Alter executions after initiation
2. Revoke certificates after issuance
3. Recover lost execution tokens
4. Modify certificate content
5. Delete certificates from storage
6. Overwrite existing certificates
7. Grant execution rights without payment
8. Bypass payment requirements
9. Modify execution results
10. Interfere with certificate validity

---

## DETAILED PROVISIONS

### 1. Execution Alteration Prohibition

**Operator cannot alter executions.**

- Execution process is deterministic and automated
- Execution inputs (evidence bundle, profile) determine outputs
- No manual intervention path exists in execution code
- No operator override mechanism exists
- Execution results cannot be modified by operator action

### 2. Certificate Revocation Prohibition

**Operator cannot revoke certificates.**

- Certificates are stored in immutable storage (Cloudflare R2)
- Certificate storage has no delete operation
- Certificate storage has no overwrite operation
- No revocation mechanism exists in system code
- Certificates remain valid regardless of operator status

### 3. Token Recovery Prohibition

**Operator cannot recover lost tokens.**

- Tokens are cryptographically signed and single-use
- Token state is stored in KV (key-value store)
- Token state transitions are one-way: \`issued\` → \`burned\`
- No token regeneration mechanism exists
- No token recovery mechanism exists
- Lost tokens are permanently lost

### 4. Certificate Modification Prohibition

**Operator cannot modify certificate content.**

- Certificate content is determined deterministically from execution inputs
- Certificate hash is computed from certificate content
- Certificate storage path is derived from certificate hash
- No certificate modification mechanism exists
- Certificates are immutable by design

### 5. Payment Bypass Prohibition

**Operator cannot grant execution rights without payment.**

- Execution tokens are generated only upon successful payment confirmation
- Payment confirmation requires valid Stripe webhook signature
- Webhook signature verification cannot be forged by operator
- No payment bypass mechanism exists
- No free execution mechanism exists

### 6. Certificate Validity Independence

**Certificates remain valid regardless of operator status.**

- Certificates are independently verifiable (cryptographic self-sufficiency)
- Certificate validity does not depend on VERIFRAX service availability
- Certificate validity does not depend on operator existence
- Certificate validity does not depend on infrastructure availability
- Certificates are facts, not records dependent on system state

### 7. Infrastructure Provider Limitations

**Infrastructure provider (Cloudflare) cannot alter certificates.**

- Certificate storage (R2) is write-once by policy
- No delete operation exists for certificate objects
- No overwrite operation exists for certificate objects
- Infrastructure provider cannot modify certificate content
- Infrastructure provider cannot revoke certificates

---

## OPERATOR CAPABILITIES (WHAT OPERATOR CAN DO)

The operator **can**:

1. **Operate the service** — Deploy, maintain, and operate the VERIFRAX service
2. **Monitor operations** — Observe system behavior, logs, and metrics
3. **Respond to system failures** — Address infrastructure issues, bugs, or service disruptions
4. **Process refunds** — Issue refunds for system execution failures (as per refund policy)
5. **Discontinue service** — Cease operating the service (certificates remain valid)

The operator **cannot**:

- Interfere with execution determinism
- Modify certificate content or validity
- Recover lost tokens
- Grant execution rights without payment
- Revoke or delete certificates

---

## LEGAL PROTECTION

This declaration protects the operator by:

1. **Establishing clear boundaries** — Defining what the operator cannot do
2. **Preventing liability claims** — Demonstrating that operator cannot interfere with execution or certificate validity
3. **Clarifying system behavior** — Making explicit that system behavior is deterministic and automated
4. **Limiting operator responsibility** — Establishing that operator is not responsible for certificate interpretation or third-party acceptance

This declaration protects users by:

1. **Guaranteeing system integrity** — Certificates cannot be modified or revoked
2. **Ensuring payment value** — Execution rights cannot be granted without payment
3. **Providing certainty** — System behavior is deterministic and predictable
4. **Establishing independence** — Certificates remain valid regardless of operator status

---

## TECHNICAL ENFORCEMENT

These limitations are enforced by:

1. **Cryptographic signatures** — Tokens and webhooks are cryptographically signed
2. **Immutable storage** — Certificates stored in write-once storage
3. **Deterministic execution** — Execution results determined by inputs, not operator action
4. **No override mechanisms** — System code contains no operator override paths
5. **Content-addressed storage** — Certificate paths derived from content, preventing modification

---

## QUOTABLE STATEMENT

**"The VERIFRAX operator cannot alter executions, revoke certificates, recover tokens, or interfere with certificate validity. Certificates remain valid regardless of operator status, service availability, or infrastructure provider actions."**

---

**END OF OPERATOR NON-INTERFERENCE DECLARATION**`,

  '/legal/VERSION_FREEZE_AND_GOVERNANCE_NOTICE_v2.7.0.md': `# VERIFRAX VERSION FREEZE & GOVERNANCE NOTICE — v2.7.0

**Version:** v2.7.0  
**Date:** 2026-01-03  
**Status:** FROZEN  
**Authority:** VERIFRAX_AUTHORITY.lock

---

## VERSION FREEZE DECLARATION

**VERIFRAX v2.7.0 is frozen. No modifications, updates, or changes will be made to v2.7.0. Any future version is a new system, not an update to v2.7.0.**

---

## FREEZE PROVISIONS

### 1. Code Freeze

- VERIFRAX v2.7.0 code is frozen
- No code changes will be made to v2.7.0
- No bug fixes will be applied to v2.7.0
- No feature additions will be made to v2.7.0
- No modifications affecting execution semantics, certificate generation, or verification behavior will be applied
- Infrastructure-level mitigations that do not alter system behavior may occur

### 2. Specification Freeze

- VERIFRAX v2.7.0 specification is frozen
- No specification changes will be made to v2.7.0
- No API changes will be made to v2.7.0
- No behavior changes will be made to v2.7.0

### 3. Certificate Version Binding

- Certificates issued by v2.7.0 contain \`verifier_version: "v2.7.0"\`
- Certificate version is immutable
- Certificate version identifies the verifier that generated the certificate
- Certificate version cannot be changed after issuance

### 4. Future Versions Are New Systems

- Any version after v2.7.0 (e.g., v2.8.0, v3.0.0) is a **new system**
- New versions are not updates to v2.7.0
- New versions may have different:
  - APIs
  - Behavior
  - Certificate formats
  - Verification algorithms
  - Payment models
- New versions do not affect v2.7.0 certificates
- v2.7.0 certificates remain valid regardless of new versions

---

## GOVERNANCE MODEL

### 1. Version Authority

- Each version is a separate, independent system
- Each version has its own:
  - Authority lock file
  - Specification
  - Codebase
  - Certificate format
  - API surface
- Versions do not inherit from previous versions
- Versions do not modify previous versions

### 2. Certificate Version Permanence

- Certificates reference verifier version permanently
- Certificate version field (\`verifier_version\`) is immutable
- Certificate validity is tied to the verifier version that generated it
- Certificate verification requires the matching verifier version
- Certificates cannot be "upgraded" to new versions

### 3. Backward Compatibility

- VERIFRAX v2.7.0 makes no backward compatibility guarantees
- Future versions may break compatibility with v2.7.0
- v2.7.0 certificates are not guaranteed to be processable by future versions
- v2.7.0 API is not guaranteed to be supported by future versions

### 4. Forward Compatibility

- VERIFRAX v2.7.0 makes no forward compatibility guarantees
- v2.7.0 may not support certificates from future versions
- v2.7.0 may not support APIs from future versions
- v2.7.0 is frozen and will not evolve

---

## RETROACTIVE LIABILITY PREVENTION

### 1. Version Isolation

- Each version is isolated from other versions
- Changes to future versions do not affect v2.7.0
- v2.7.0 behavior is fixed and cannot be retroactively modified
- v2.7.0 certificates cannot be retroactively invalidated by future versions

### 2. No Retroactive Changes

- v2.7.0 will not be modified retroactively
- v2.7.0 certificates will not be modified retroactively
- v2.7.0 behavior will not be changed retroactively
- v2.7.0 specifications will not be changed retroactively

### 3. Certificate Permanence

- v2.7.0 certificates remain valid permanently
- v2.7.0 certificates cannot be invalidated by:
  - Future versions
  - Operator actions
  - Infrastructure changes
  - Service discontinuation
- v2.7.0 certificates are independently verifiable

---

## VERSION IDENTIFICATION

### 1. System Version

VERIFRAX v2.7.0 is identified by:

- \`VERIFIER_VERSION\` environment variable: \`v2.7.0\`
- Authority lock file: \`VERIFRAX_AUTHORITY.lock\` (contains \`VERSION=v2.7.0\`)
- Git commit: \`7012ffc34166231569f42fd6a258d12adc7accdf\` (phase-7 completion)
- Status endpoint: \`/status\` returns \`verifier_version: "v2.7.0"\`

### 2. Certificate Version

Certificates issued by v2.7.0 contain:

- \`verifier_version: "v2.7.0"\` field
- Certificate hash computed using v2.7.0 canonicalization rules
- Certificate format defined by v2.7.0 specification

### 3. API Version

v2.7.0 API surface:

- \`/api/create-payment-intent\` (POST)
- \`/api/stripe/webhook\` (POST)
- \`/api/verify\` (POST)
- \`/certificate/:hash\` (GET)
- \`/status\` (GET)

---

## FREEZE DATE

**Freeze Date:** 2026-01-03  
**Freeze Authority:** VERIFRAX_AUTHORITY.lock  
**Freeze Status:** PERMANENT

---

## QUOTABLE STATEMENT

**"VERIFRAX v2.7.0 is frozen. No modifications will be made. Any future version is a new system, not an update. Certificates reference verifier version permanently and cannot be retroactively modified."**

---

**END OF VERSION FREEZE & GOVERNANCE NOTICE**`,

  '/legal/AUTHORITY_STATE_FINAL_v2.7.0.md': `# VERIFRAX — SUPER-PRO ADVANCED · SUPER-IDEAL AUTHORITY STATE

**System:** VERIFRAX  
**Authority Level:** FINAL · FROZEN · SEALED  
**Operational Mode:** Deterministic · Non-Interpretive · Irreversible

This document states the **ideal, complete, and closed authority posture** of VERIFRAX as an institutional-grade verification primitive.

---

## I. SYSTEM IDENTITY (NON-NEGOTIABLE)

VERIFRAX is a **deterministic verification execution system**.

* One payment → one execution → one certificate
* Identical inputs → identical outputs (byte-for-byte)
* No randomness, no interpretation, no discretion
* No mutable state, no retries, no revisions

The system executes computation. It does not judge meaning.

---

## II. EXECUTION FINALITY (ABSOLUTE)

* Execution is **irreversible**
* Tokens are **single-use and burned**
* Certificate issuance **closes the transaction permanently**
* No revocation, no modification, no appeal
* Outcome dissatisfaction and third-party rejection are irrelevant

Finality is technical, not procedural.

---

## III. CERTIFICATE ONTOLOGY

Certificates are **facts**, not opinions.

Each certificate is:

* Canonical JSON
* Content-addressed by its own SHA-256 hash
* Immutable and independently verifiable
* Valid regardless of operator, infrastructure, or time

Certificates do not expire. Infrastructure may.

---

## IV. OPERATOR FIREWALL (TOTAL)

The operator:

* Cannot alter executions
* Cannot revoke or modify certificates
* Cannot recover tokens
* Cannot bypass payment
* Cannot interpret or explain outcomes

Silence is enforced by design.
Liability is structurally contained.

---

## V. STORAGE & CUSTODY BOUNDARY

* Evidence retention exists **only** as a by-product of execution finality and reproducibility
* No custodial, access, or retrieval service is implied
* No general-purpose storage function exists

VERIFRAX is not a repository. It is an execution trace.

---

## VI. GOVERNANCE & VERSION ISOLATION

* Each version is a **separate system**
* v2.7.0 is **frozen permanently**
* No changes affecting execution semantics, verification logic, or certificate generation
* Infrastructure mitigations may occur only if behavior remains unchanged

Future versions do not modify the past.

---

## VII. NON-RELIANCE RULE

No party may rely on a VERIFRAX certificate as a substitute for:

* Independent verification
* Legal judgment
* Regulatory determination

Reliance is external. VERIFRAX is neutral.

---

## VIII. INSTITUTIONAL POSTURE

VERIFRAX is:

* Court-safe
* Auditor-compatible
* Infrastructure-independent
* Operator-independent
* Jurisdiction-agnostic

It is a **verification primitive**, not a service narrative.

---

## IX. AUTHORITY REFERENCES

* **VERIFRAX v2.6.0 — Institutional Blueprint** 
* **VERIFRAX v2.7.0 — Complete Authority Dossier** 

These artifacts define the closed authority perimeter.

---

## X. END STATE

VERIFRAX exists in a **sealed condition**.

* Deterministic
* Final
* Non-interpretive
* Institution-ready

No further explanation is required.
No further action is permitted.

**AUTHORITY STATE: CLOSED**`,
};

