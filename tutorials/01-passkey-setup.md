# Tutorial 1: Setting Up Passkey Authentication with Lazorkit

## 🎯 Learning Objectives

By the end of this tutorial, you will:
- Understand how passkey authentication works on Solana
- Set up a Next.js project with Lazorkit SDK
- Implement passkey-based wallet creation
- Handle user authentication states
- Create a secure smart wallet without seed phrases

## 📚 Prerequisites

- Node.js 18+ installed
- Basic understanding of React/Next.js
- Familiarity with Web3 concepts
- A modern browser supporting WebAuthn (Chrome 67+, Firefox 60+, Safari 13+)

## 🚀 Step 1: Project Setup

### Install Dependencies

First, create a new Next.js project and install Lazorkit:

```bash
npx create-next-app@latest lazorkit-demo
cd lazorkit-demo
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

### Install Polyfills

Lazorkit requires Node.js polyfills for browser environments:

```bash
npm install --save-dev vite-plugin-node-polyfills
```

## 🔧 Step 2: Configure the Provider

### Create Configuration File

Create `lib/config.ts`:

```typescript
// lib/config.ts
export const LAZORKIT_CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }
};
```

**Understanding the Configuration:**
- `rpcUrl`: Solana RPC endpoint (Devnet for testing)
- `portalUrl`: Lazorkit portal service for passkey management  
- `paymasterConfig`: Enables gasless transactions

### Set Up Provider Wrapper

Create `app/providers.tsx`:

```typescript
'use client';

import { LazorkitProvider } from '@lazorkit/wallet';
import { LAZORKIT_CONFIG } from '../lib/config';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazorkitProvider 
      rpcUrl={LAZORKIT_CONFIG.rpcUrl}
      portalUrl={LAZORKIT_CONFIG.portalUrl}
      paymasterConfig={LAZORKIT_CONFIG.paymasterConfig}
    >
      {children}
    </LazorkitProvider>
  );
}
```

### Update Root Layout

Modify `app/layout.tsx`:

```typescript
import { Providers } from './providers';
import './globals.css';

// Add Buffer polyfill for Next.js
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## 🔑 Step 3: Implement Passkey Authentication

### Create Connect Button Component

Create `components/ConnectButton.tsx`:

```typescript
'use client';

import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';

export function ConnectButton() {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    isConnecting,
    wallet 
  } = useWallet();
  
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  if (isConnected && wallet) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-600">
          Connected: {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
        </p>
        <button 
          onClick={disconnect}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect with Passkey'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
```

### Understanding the Hook

The `useWallet()` hook provides:

- `connect()`: Initiates passkey creation/authentication
- `disconnect()`: Logs out the user
- `isConnected`: Boolean indicating connection state
- `isConnecting`: Boolean for loading state
- `wallet`: Object containing wallet information
- `smartWalletPubkey`: Public key for transactions

## 🎨 Step 4: Create Main Page

Update `app/page.tsx`:

```typescript
'use client';

import { ConnectButton } from '../components/ConnectButton';
import { useWallet } from '@lazorkit/wallet';

export default function Home() {
  const { wallet, smartWalletPubkey } = useWallet();

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            🔐 Lazorkit Passkey Demo
          </h1>
          <p className="text-gray-600">
            Experience passwordless authentication with smart wallets
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <ConnectButton />
          
          {wallet && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Wallet Information:</h3>
              <p className="text-sm break-all">
                <strong>Smart Wallet:</strong> {smartWalletPubkey?.toString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

## ⚙️ Step 5: Test the Application

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Test Passkey Flow

1. **Click "Connect with Passkey"**
2. **Browser prompts passkey creation:**
   - Use Face ID, Touch ID, or Windows Hello
   - Or use device PIN/password
3. **Passkey is created and stored securely**
4. **Your smart wallet address appears**
5. **Try disconnecting and reconnecting** - no seed phrase needed!

## 💡 How It Works

### Passkey Authentication Flow

1. **User clicks "Connect"**
2. **Lazorkit SDK calls WebAuthn API**
3. **Browser creates cryptographic key pair:**
   - Private key: Stored securely in device (TPM/Secure Enclave)
   - Public key: Registered with Lazorkit Portal
4. **Smart wallet derived from passkey**
5. **User authenticated without passwords!**

### Security Benefits

- **No seed phrases to lose or leak**
- **Biometric authentication** (Face ID/TouchID)
- **Phishing resistant** - passkeys are domain-bound
- **Hardware-backed security** (TPM, Secure Enclave)
- **Cross-device sync** via iCloud/Google Password Manager

## 🛠️ Troubleshooting

### Passkey Creation Fails

**Problem**: "Passkey not supported"

**Solutions**:
- Ensure you're on HTTPS or localhost
- Update your browser to latest version
- Check browser passkey settings

### Buffer is not defined

**Problem**: "Buffer is not defined" error

**Solution**: Add polyfill in `layout.tsx`:
```typescript
if (typeof window !== 'undefined') {
  window.Buffer = require('buffer').Buffer;
}
```

### RPC Connection Errors

**Problem**: Cannot connect to Solana

**Solutions**:
- Check network status: https://status.solana.com/
- Try different RPC endpoint
- Verify firewall settings

## ✅ Summary

You've successfully:
✅ Set up Lazorkit SDK in Next.js
✅ Configured the provider with Devnet
✅ Implemented passkey authentication
✅ Created a smart wallet without seed phrases
✅ Built a secure, user-friendly auth flow

## 🚀 Next Steps

Continue to [Tutorial 2: Sending Gasless Transactions](./02-gasless-transactions.md) to learn how to:
- Send SOL and tokens without gas fees
- Use the paymaster for gasless UX
- Handle transaction states
- Build a complete transfer interface

## 📚 Additional Resources

- [Lazorkit Documentation](https://docs.lazorkit.com/)
- [WebAuthn Guide](https://webauthn.guide/)
- [Solana Passkeys](https://www.helius.dev/blog/solana-passkeys)
- [Next.js Documentation](https://nextjs.org/docs)
