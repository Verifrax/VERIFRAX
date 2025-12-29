#!/usr/bin/env node
/**
 * Add Cloudflare Worker Route
 * 
 * Adds the /api/* route to verifrax.net pointing to verifrax-edge worker.
 * 
 * Usage: node scripts/add-cloudflare-route.mjs
 * 
 * Requires:
 * - CLOUDFLARE_API_TOKEN environment variable
 * - CLOUDFLARE_ACCOUNT_ID environment variable (optional, will use default)
 * - CLOUDFLARE_ZONE_ID environment variable (optional, will fetch automatically)
 */

import https from 'https';
import { URL } from 'url';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'WWpeH5cXJXYJ6BM7EL-Cb_tHPgUBykvMmi5AQq-u';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'cdc2afb98b3dd0a01a57d30ce5c24b73';
const DOMAIN = 'verifrax.net';
const WORKER_NAME = 'verifrax-edge';
const ROUTE_PATTERN = `${DOMAIN}/api/*`;

const API_BASE = 'https://api.cloudflare.com/client/v4';

function apiRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : undefined;

    const requestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API error: ${res.statusCode} ${res.statusMessage}\n${JSON.stringify(parsed, null, 2)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}\nResponse: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    if (body) {
      req.write(body);
    }
    
    req.end();
  });
}

async function getZoneId(domain) {
  console.log(`Fetching zone ID for ${domain}...`);
  const data = await apiRequest(`/zones?name=${domain}`);
  
  if (!data.result || data.result.length === 0) {
    throw new Error(`Zone not found for domain: ${domain}`);
  }

  const zoneId = data.result[0].id;
  console.log(`Zone ID: ${zoneId}`);
  return zoneId;
}

async function getWorkerId(workerName) {
  console.log(`Fetching worker ID for ${workerName}...`);
  const data = await apiRequest(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/services/${workerName}`);
  
  if (!data.result) {
    throw new Error(`Worker not found: ${workerName}`);
  }

  const workerId = data.result.id || workerName; // Workers API may use name directly
  console.log(`Worker ID: ${workerId}`);
  return workerId;
}

async function getExistingRoutes(zoneId) {
  console.log(`Fetching existing routes for zone ${zoneId}...`);
  const data = await apiRequest(`/zones/${zoneId}/workers/routes`);
  
  return data.result || [];
}

async function addRoute(zoneId, pattern, workerName) {
  console.log(`Adding route: ${pattern} → ${workerName}...`);
  
  const existingRoutes = await getExistingRoutes(zoneId);
  
  // Check if route already exists
  const existing = existingRoutes.find(r => r.pattern === pattern);
  if (existing) {
    console.log(`Route already exists: ${pattern}`);
    console.log(`  Pattern: ${existing.pattern}`);
    console.log(`  Script: ${existing.script || 'N/A'}`);
    return existing;
  }

  // Add the route
  const data = await apiRequest(`/zones/${zoneId}/workers/routes`, {
    method: 'POST',
    body: {
      pattern: pattern,
      script: workerName,
    },
  });

  if (data.success) {
    console.log(`✓ Route added successfully: ${pattern} → ${workerName}`);
    return data.result;
  } else {
    throw new Error(`Failed to add route: ${JSON.stringify(data, null, 2)}`);
  }
}

async function main() {
  try {
    console.log('=== Adding Cloudflare Worker Route ===\n');
    console.log(`Domain: ${DOMAIN}`);
    console.log(`Route: ${ROUTE_PATTERN}`);
    console.log(`Worker: ${WORKER_NAME}`);
    console.log(`Account ID: ${CLOUDFLARE_ACCOUNT_ID}\n`);

    // Get zone ID (use env var if provided, otherwise fetch)
    const zoneId = process.env.CLOUDFLARE_ZONE_ID || await getZoneId(DOMAIN);
    
    // Verify worker exists
    await getWorkerId(WORKER_NAME);
    
    // Add the route
    await addRoute(zoneId, ROUTE_PATTERN, WORKER_NAME);
    
    console.log('\n=== Route Configuration Complete ===');
    console.log(`\nVerify with:`);
    console.log(`  curl -i https://${DOMAIN}/api/ping`);
    console.log(`\nExpected: Same behavior as before (Hello World!), but with semantic route structure.`);
    
  } catch (error) {
    console.error(`\n✗ Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

