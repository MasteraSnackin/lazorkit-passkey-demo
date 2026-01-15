# Tutorial 2: Sending Gasless Transactions

## 🎯 Learning Objectives

By the end of this tutorial, you will:
- Understand how gasless transactions work on Solana
- Implement USDC transfers without gas fees
- Use the Lazorkit paymaster for sponsored transactions
- Build a complete transfer interface
- Handle transaction states and errors

## 📚 Prerequisites

- Completed [Tutorial 1: Passkey Authentication](./01-passkey-setup.md)
- Connected wallet with passkey
- Basic understanding of Solana transactions

## 💡 What are Gasless Transactions?

### Traditional Solana Transactions
- Users need SOL for transaction fees (~0.000005 SOL per transaction)
- Creates friction for new users
- Users must acquire SOL before using dApps

### Gasless Transactions with Lazorkit
- **Paymaster** pays transaction fees
- Users transact without holding SOL
- Fees can be paid in USDC or other tokens
- Powered by Lazorkit's smart wallet infrastructure

## 🔧 Step 1: Create Transfer Form Component

Create `components/TransferForm.tsx`:

```typescript
'use client';

import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!smartWalletPubkey) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxSignature(null);

      // 1. Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch (err) {
        throw new Error('Invalid recipient address');
      }

      // 2. Parse amount
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      if (isNaN(lamports) || lamports <= 0) {
        throw new Error('Invalid amount');
      }

      // 3. Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      // 4. Send transaction with gasless option
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: 'USDC'  // Pay gas fees in USDC!
        }
      });

      setTxSignature(signature);
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Send Gasless Transfer</h2>
      
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Amount (SOL)
          </label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Gasless Transaction'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {txSignature && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-semibold">Transaction Successful!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm break-all"
          >
            View on Solana Explorer: {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
          </a>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          🎉 Gas fees paid in USDC by paymaster - no SOL needed!
        </p>
      </div>
    </div>
  );
}
```

## 📝 Step 2: Understanding the Code

### Key Components

#### 1. **signAndSendTransaction Hook**
```typescript
const { signAndSendTransaction, smartWalletPubkey } = useWallet();
```

- `signAndSendTransaction`: Sends transactions through smart wallet
- `smartWalletPubkey`: Your wallet's public key

#### 2. **Creating Instructions**
```typescript
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipientPubkey,
  lamports,
});
```

Standard Solana transfer instruction - works with any Solana program!

#### 3. **Gasless Transaction Options**
```typescript
await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: 'USDC'  // Magic happens here!
  }
});
```

**How it works:**
1. Transaction is created with your instruction
2. Lazorkit paymaster detects `feeToken: 'USDC'`
3. Paymaster pays SOL fees
4. User's USDC balance is debited equivalent amount
5. Transaction confirmed - user never touched SOL!

## ✨ Step 3: Add to Main Page

Update `app/page.tsx`:

```typescript
'use client';

import { ConnectButton } from '../components/ConnectButton';
import { TransferForm } from '../components/TransferForm';
import { useWallet } from '@lazorkit/wallet';

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            🔐 Lazorkit Gasless Demo
          </h1>
          <p className="text-gray-600">
            Send SOL without paying gas fees!
          </p>
        </div>

        <ConnectButton />

        {isConnected && <TransferForm />}
      </div>
    </main>
  );
}
```

## 🛠️ Step 4: Test Your Gasless Transaction

### Testing Flow

1. **Connect your wallet** with passkey
2. **Enter recipient address** (use a test wallet)
3. **Enter amount** (e.g., 0.01 SOL)
4. **Click "Send Gasless Transaction"**
5. **Confirm with passkey** (Face ID/TouchID)
6. **Transaction confirmed!** - View on Solana Explorer

### What Happened?

✅ Transaction sent to Solana
✅ Gas fees paid by Lazorkit paymaster
✅ Your USDC balance debited small amount
✅ No SOL needed in your wallet!

## 💰 Advanced: Token Transfers

You can also send SPL tokens gaslessly:

```typescript
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

// Get token accounts
const sourceTokenAccount = await getAssociatedTokenAddress(
  tokenMintAddress,
  smartWalletPubkey
);

const destinationTokenAccount = await getAssociatedTokenAddress(
  tokenMintAddress,
  recipientPubkey
);

// Create transfer instruction
const instruction = createTransferInstruction(
  sourceTokenAccount,
  destinationTokenAccount,
  smartWalletPubkey,
  amount
);

// Send gaslessly!
await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: { feeToken: 'USDC' }
});
```

## ⚡ Performance Tips

### 1. Batch Multiple Instructions
```typescript
const instructions = [
  instruction1,
  instruction2,
  instruction3
];

await signAndSendTransaction({
  instructions,  // All in one transaction!
  transactionOptions: { feeToken: 'USDC' }
});
```

### 2. Handle Transaction Confirmation
```typescript
const signature = await signAndSendTransaction({...});

// Wait for confirmation
const confirmation = await connection.confirmTransaction(signature);
if (confirmation.value.err) {
  throw new Error('Transaction failed');
}
```

### 3. Estimate Fees
```typescript
// Fee is automatically calculated
// Typically 0.000005 SOL ~ $0.0001 in USDC
```

## 🐛 Troubleshooting

### Insufficient USDC Balance

**Problem**: "Insufficient USDC for gas fees"

**Solution**: Ensure your smart wallet has USDC. On Devnet, use a faucet.

### Transaction Failed

**Problem**: Transaction rejected

**Solutions**:
- Check recipient address is valid
- Ensure sufficient balance
- Try lowering amount
- Check Solana network status

### Paymaster Unavailable

**Problem**: "Paymaster service unavailable"

**Solutions**:
- Check internet connection
- Verify `paymasterUrl` in config
- Try again after a moment
- Check https://status.solana.com/

## ✅ Summary

You've successfully:
✅ Built a gasless transfer form
✅ Implemented USDC-paid gas fees
✅ Created a complete transaction flow
✅ Handled errors and confirmations
✅ Improved UX with no SOL requirement

## 🚀 Next Steps

- **Integrate with your dApp**: Use this pattern for any Solana program
- **Add token swaps**: Gasless Jupiter integration
- **Build NFT minting**: Mint NFTs without gas fees
- **Create subscriptions**: Automated recurring payments

## 📚 Additional Resources

- [Lazorkit Paymaster Docs](https://docs.lazorkit.com/paymaster)
- [Solana Transaction Guide](https://docs.solana.com/developing/programming-model/transactions)
- [SPL Token Documentation](https://spl.solana.com/token)

---

**Congrats! You've mastered gasless transactions on Solana! 🎉**
