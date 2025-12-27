# Anchor Minting Guide

## Expected Commitment

Your certificate's expected commitment (merkle root) that must be anchored:

```
expectedCommitment= 2cce864567b3f2f60a90da953f516999cd112ecc1546d6780ac36d9a15dfa1a0
```

This value must appear in your anchor transactions/entries.

## Step A — Decide Network

**Mainnet (chain_id: 1)**
- RPC: `https://cloudflare-eth.com` or `https://rpc.ankr.com/eth`
- Requires real ETH for gas

**Sepolia Testnet (chain_id: 11155111)**
- RPC: `https://rpc.sepolia.org` or `https://sepolia.infura.io/v3/YOUR_KEY`
- Free testnet ETH available from faucets

Choose based on your needs. For testing, Sepolia is recommended.

## ETH Anchor Minting

### Step B: Mint Anchor Transaction with Commitment

**Cheapest approach: Send 0 ETH with commitment in calldata**

1. Create a transaction:
   - **To**: Your own address (or burn address `0x0000000000000000000000000000000000000000`)
   - **Value**: 0 ETH
   - **Data**: `0x2cce864567b3f2f60a90da953f516999cd112ecc1546d6780ac36d9a15dfa1a0`
     (Your commitment prefixed with `0x`)

2. Sign and broadcast the transaction

3. Wait for it to be mined

4. Copy the transaction hash (64 hex characters after `0x`)

**Example using web3.js or ethers.js:**
```javascript
const tx = await wallet.sendTransaction({
  to: wallet.address, // or burn address
  value: 0,
  data: '0x2cce864567b3f2f60a90da953f516999cd112ecc1546d6780ac36d9a15dfa1a0'
});
const receipt = await tx.wait();
console.log('Transaction hash:', receipt.transactionHash);
```

### Step C: Mint Transaction (Using Provided Script)

**Quick mint using `tools/mint-anchor-eth.js`:**

```bash
cd /Users/midiakiasat/Desktop/Kaaffilm/apps/Verifrax

# For Sepolia (recommended for testing):
export CINELINT_ETH_RPC='https://rpc.sepolia.org'
export CINELINT_ETH_PK='0xYOUR_PRIVATE_KEY'  # Funded wallet on Sepolia
export CINELINT_COMMITMENT='0x2cce864567b3f2f60a90da953f516999cd112ecc1546d6780ac36d9a15dfa1a0'

node tools/mint-anchor-eth.js
# Output: tx_hash: 0x...
# Output: mined: 0x... block: 12345 status: 1
```

**For Mainnet:**
```bash
export CINELINT_ETH_RPC='https://cloudflare-eth.com'
export CINELINT_ETH_PK='0xYOUR_PRIVATE_KEY'  # Funded wallet on Mainnet
export CINELINT_COMMITMENT='0x2cce864567b3f2f60a90da953f516999cd112ecc1546d6780ac36d9a15dfa1a0'

node tools/mint-anchor-eth.js
```

### Step D: Set Chain ID and Transaction Hash

**After minting, set both chain_id and tx_hash:**

```bash
cd /Users/midiakiasat/Desktop/Kaaffilm/apps/Verifrax

# Set chain_id (Mainnet=1, Sepolia=11155111)
jq '.chain_id=1' out/cert-bundles/run-003/anchors/eth.json > /tmp/eth.json && mv /tmp/eth.json out/cert-bundles/run-003/anchors/eth.json
# OR for Sepolia:
# jq '.chain_id=11155111' out/cert-bundles/run-003/anchors/eth.json > /tmp/eth.json && mv /tmp/eth.json out/cert-bundles/run-003/anchors/eth.json

# Set transaction hash (from Step C output)
node tools/anchors/set-eth-tx.mjs out/cert-bundles/run-003/anchors/eth.json 0xREAL_64HEX_TXHASH
```

**Note:** `chain_id` is now **required** in preflight. The verifier will:
1. Check that `chain_id` exists in `anchors/eth.json`
2. Call `eth_chainId` on your RPC
3. Fail if chain IDs don't match (fail-closed)

### Step E: Repack and Verify

**For Mainnet:**
```bash
node tools/bundle-pack.mjs out/cert-bundles/run-003

CINELINT_ETH_RPC='https://cloudflare-eth.com' bash tools/verify-external-eth.sh out/run-003.zip
```

**For Sepolia:**
```bash
node tools/bundle-pack.mjs out/cert-bundles/run-003

CINELINT_ETH_RPC='https://rpc.sepolia.org' bash tools/verify-external-eth.sh out/run-003.zip
```

**Expected outcome:** `VERIFIED+EXTERNAL+eth`

## Rekor Anchor Minting

### Step 1: Submit Entry to Rekor

Use Sigstore tooling to submit an entry containing your commitment.

### Step 2: Get UUID

After submission, you'll receive a Rekor entry UUID.

### Step 3: Set UUID

```bash
node tools/anchors/set-rekor-uuid.mjs out/cert-bundles/run-003/anchors/rekor.json \
<your-rekor-uuid>
```

### Step 4: Repack and Verify

```bash
node tools/bundle-pack.mjs out/cert-bundles/run-003

node verify.mjs . --external=rekor
```

## Error Messages Reference

### ETH Verification Errors

- `tx not found on this RPC: 0x...` - Transaction hash doesn't exist on this chain/RPC
- `receipt not yet available (pending or pruned)` - Transaction exists but receipt not available
- `tx failed` - Transaction was reverted (status=0x0)
- `commitment mismatch: commitment not found in receipt` - Commitment not found in receipt data
- `eth.chain_id mismatch (rpc=X, proof=Y)` - RPC chain doesn't match proof chain_id

### Preflight Errors

- `eth.rpc (env CINELINT_ETH_RPC or anchors/eth.json)` - RPC endpoint not provided
- `eth.chain_id (anchors/eth.json)` - **chain_id is required** (cannot be undefined, null, or empty)
- `eth.tx_hash invalid (must be 0x + 64 hex)` - Transaction hash format invalid
- `eth.chain_id check failed: rpc http XXX` - RPC HTTP error during chain_id check
- `eth.chain_id check failed: rpc returned null chainId` - RPC returned invalid response
- `eth.chain_id mismatch (rpc=X, proof=Y)` - RPC chain doesn't match proof chain_id (fail-closed)
- `eth.chain_id check failed: <error message>` - Network or other error during chain_id validation

