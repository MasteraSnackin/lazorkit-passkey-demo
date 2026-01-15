"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export default function TransferForm() {
  const { publicKey, sendTransaction, connection } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!publicKey || !connection) {
      setStatus("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setStatus("Creating transaction...");

      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);
      
      // Convert SOL to lamports
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // Create transfer instruction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      setStatus("Sending transaction...");
      
      // Send transaction (Lazorkit handles gasless sponsorship)
      const signature = await sendTransaction(transaction, connection);
      
      setStatus(`Success! Transaction: ${signature}`);
      
      // Reset form
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transfer error:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="p-6 border border-gray-700 rounded-lg">
        <p className="text-gray-400">Connect your wallet to send transfers</p>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-700 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">Send SOL (Gasless)</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Solana address..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Amount (SOL)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.1"
          step="0.01"
          min="0"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleTransfer}
        disabled={loading || !recipient || !amount}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
      >
        {loading ? "Processing..." : "Send Transfer"}
      </button>

      {status && (
        <div className={`p-3 rounded-lg ${
          status.includes("Success") ? "bg-green-900/20 text-green-400" : 
          status.includes("Error") ? "bg-red-900/20 text-red-400" : 
          "bg-blue-900/20 text-blue-400"
        }`}>
          <p className="text-sm break-all">{status}</p>
        </div>
      )}
    </div>
  );
}
