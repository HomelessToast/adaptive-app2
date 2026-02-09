"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecoverOrderPage() {
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const handleRecover = async () => {
    if (!paymentIntentId && !sessionId) {
      setResult({ success: false, message: "Please enter either a Payment Intent ID or Session ID" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/recover-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentId || undefined,
          sessionId: sessionId || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Order recovered successfully! Manufacturing email has been sent.",
          details: data,
        });
        setPaymentIntentId("");
        setSessionId("");
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to recover order",
          details: data,
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">Recover Order & Resend Manufacturing Email</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-gray-600 mb-6">
            Enter either a Payment Intent ID or Checkout Session ID from Stripe to recover the order data and resend the manufacturing email.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="paymentIntentId" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Intent ID (e.g., pi_3Swr0Q2LxjHUN8QE1yIChgQz)
              </label>
              <input
                id="paymentIntentId"
                type="text"
                value={paymentIntentId}
                onChange={(e) => setPaymentIntentId(e.target.value)}
                placeholder="pi_..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="text-center text-gray-400">OR</div>

            <div>
              <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
                Checkout Session ID (e.g., cs_test_...)
              </label>
              <input
                id="sessionId"
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="cs_..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleRecover}
              disabled={isLoading}
              className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Recovering Order..." : "Recover Order & Send Manufacturing Email"}
            </button>
          </div>
        </div>

        {result && (
          <div
            className={`rounded-lg p-6 ${
              result.success
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">
              {result.success ? "✓ Success" : "✗ Error"}
            </h3>
            <p className="mb-2">{result.message}</p>
            {result.details && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                <pre className="mt-2 text-xs bg-white p-4 rounded overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to find these IDs in Stripe:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Payment Intent ID: Found in the payment details (starts with "pi_")</li>
            <li>Session ID: Found in checkout session details (starts with "cs_")</li>
            <li>You can find these in your Stripe Dashboard → Payments or Checkout Sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
