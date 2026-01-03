/**
 * PHASE 2: Public Execution Surface
 * 
 * GET /verify
 * 
 * One-time deterministic verification execution.
 * Flow: Upload → Finality Acknowledgement → Payment → Automatic Execution → Result
 * 
 * CRITICAL: No accounts, no interpretation, no guidance.
 */

"use client";

import { useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const PRICE_EUR = 650; // €650 (Phase 3: updated from €500)

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const elementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'eur',
};

type State = 
  | "IDLE" 
  | "UPLOADING" 
  | "UPLOADED" 
  | "PAYING" 
  | "EXECUTING" 
  | "COMPLETE" 
  | "ERROR";

export default function VerifyPage() {
  const [state, setState] = useState<State>("IDLE");
  const [file, setFile] = useState<File | null>(null);
  const [bundleHash, setBundleHash] = useState<string>("");
  const [bundleSize, setBundleSize] = useState<number>(0);
  const [uploadId, setUploadId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [certificateHash, setCertificateHash] = useState<string>("");

  // Compute SHA-256 hash client-side
  async function computeHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // Handle file selection
  async function handleFile(f: File | null) {
    if (!f) return;

    // Check size (100 MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (f.size > maxSize) {
      setError(`File exceeds size limit of ${maxSize / (1024 * 1024)} MB`);
      setState("ERROR");
      return;
    }

    setFile(f);
    setBundleSize(f.size);
    setState("UPLOADING");
    setError("");

    try {
      // Compute hash
      const hash = await computeHash(f);
      setBundleHash(hash);

      // Upload bundle
      const formData = new FormData();
      formData.append('file', f);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'X-Bundle-Hash': `sha256:${hash}`,
        },
        body: f,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadId(data.upload_id);
      setState("UPLOADED");
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setState("ERROR");
    }
  }

  // Payment component (separate to use Stripe hooks)
  function PaymentForm({ 
    uploadId, 
    onPaymentSuccess,
    onError 
  }: { 
    uploadId: string; 
    onPaymentSuccess: (eat: string) => void;
    onError: (message: string) => void;
  }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!stripe || !elements) return;

      setProcessing(true);

      try {
        // Create payment intent
        const intentResponse = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price_tier: 'public_standard' }),
        });

        if (!intentResponse.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { client_secret } = await intentResponse.json();

        // Get card element
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        // Confirm payment
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (stripeError) {
          throw new Error(stripeError.message || 'Payment failed');
        }

        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
          throw new Error('Payment not completed');
        }

        // Wait for webhook to process and add EAT to metadata
        // Poll PaymentIntent until EAT is available
        let eat: string | null = null;
        let attempts = 0;
        const maxAttempts = 10;

        while (!eat && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          
          const response = await fetch(`/api/payment-intent/${paymentIntent.id}`, {
            method: 'GET',
          });

          if (response.ok) {
            const data = await response.json();
            eat = data.metadata?.eat_token || null;
          }

          attempts++;
        }

        if (!eat) {
          throw new Error('EAT not found in payment metadata');
        }

        onPaymentSuccess(eat);
      } catch (err: any) {
        onError(err.message || 'Payment failed');
      } finally {
        setProcessing(false);
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-border rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        <Button type="submit" disabled={!stripe || processing}>
          {processing ? 'Processing...' : `Pay €${PRICE_EUR} and Execute`}
        </Button>
      </form>
    );
  }

  // Execute verification
  async function executeVerification(eat: string) {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${eat}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_id: uploadId,
          profile_id: 'public@1.0.0',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Verification failed');
      }

      const data = await response.json();
      
      // Extract certificate hash
      const hash = data.certificate_hash;
      if (!hash) {
        throw new Error('Certificate hash not returned');
      }
      
      setCertificateHash(hash);
      setState("COMPLETE");

      // Redirect to certificate page
      window.location.href = `/certificate/${hash}`;
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setState("ERROR");
    }
  }

  // Format file size
  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-[520] tracking-[-0.015em] mb-2">
          VERIFRAX — One-Time Deterministic Verification
        </h1>
        <p className="text-sm text-muted">
          This process executes exactly once and produces a final, immutable certificate.
        </p>
      </header>

      {/* Execution Card */}
      <div className="border border-border rounded-md p-6 space-y-6">
        {/* Section A: Evidence Upload */}
        <section>
          <h2 className="text-sm font-[420] text-muted mb-4">Evidence Upload</h2>
          
          {state === "IDLE" || state === "ERROR" ? (
            <DropZone
              label="Select evidence bundle"
              accept=".bin,.zip,.tar,.tar.gz"
              onFile={handleFile}
            />
          ) : state === "UPLOADING" ? (
            <div className="text-sm text-muted">Uploading and computing hash...</div>
          ) : state === "UPLOADED" ? (
            <div className="space-y-2">
              <div className="text-sm font-mono text-text">
                Bundle Hash: <span className="text-muted">{bundleHash}</span>
              </div>
              <div className="text-sm text-muted">
                Bundle Size: {formatSize(bundleSize)}
              </div>
              <div className="text-xs text-muted mt-2">
                File locked. Refresh to upload a different file.
              </div>
            </div>
          ) : null}

          {state === "ERROR" && error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}
        </section>

        {/* Section B: Finality Acknowledgement */}
        {state === "UPLOADED" && (
          <section className="border-t border-border pt-6">
            <div className="text-sm text-muted space-y-2">
              <p>This verification executes exactly once.</p>
              <p>Payment authorizes a single irreversible computation.</p>
              <p>Once executed, the result cannot be repeated, revised, or reversed.</p>
            </div>
          </section>
        )}

        {/* Section C: Payment & Execution */}
        {state === "UPLOADED" && (
          <section className="border-t border-border pt-6">
            <Elements stripe={stripePromise} options={elementsOptions}>
              <PaymentForm 
                uploadId={uploadId} 
                onPaymentSuccess={async (eat) => {
                  setState("EXECUTING");
                  await executeVerification(eat);
                }}
                onError={(message) => {
                  setError(message);
                  setState("ERROR");
                }}
              />
            </Elements>
          </section>
        )}

        {/* Execution State */}
        {state === "EXECUTING" && (
          <div className="text-sm text-muted">
            Executing deterministic verification…
          </div>
        )}

        {/* Complete State */}
        {state === "COMPLETE" && (
          <div className="text-sm text-muted">
            Verification complete. Redirecting to certificate...
          </div>
        )}
      </div>

      {/* Status Line */}
      <div className="mt-6 text-xs text-muted text-center">
        {state === "IDLE" && "Upload an evidence bundle to begin"}
        {state === "UPLOADING" && "Processing upload..."}
        {state === "UPLOADED" && "Ready for payment and execution"}
        {state === "PAYING" && "Processing payment..."}
        {state === "EXECUTING" && "Verification in progress"}
        {state === "COMPLETE" && "Execution complete"}
        {state === "ERROR" && "Error occurred"}
      </div>
    </div>
  );
}
