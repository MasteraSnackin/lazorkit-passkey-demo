# 🔐 Lazorkit Passkey Wallet Demo

> A complete Next.js example demonstrating Lazorkit SDK integration for passkey authentication and gasless smart wallet transactions on Solana

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Lazorkit](https://img.shields.io/badge/Built%20with-Lazorkit-blue)](https://lazorkit.com)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Tutorials](#tutorials)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Resources](#resources)

## 🎯 Overview

This project demonstrates how to integrate **Lazorkit SDK** into a Next.js application to enable:

- **Passkey-based authentication** - No seed phrases, users sign in with FaceID/TouchID/Windows Hello
- **Gasless transactions** - Users can transact without holding SOL for gas fees
- **Smart wallet infrastructure** - Secure, programmable wallets powered by Solana PDAs

Perfect for developers looking to understand Lazorkit integration patterns for production Solana dApps.

## ✨ Features

- ✅ **Complete passkey authentication flow**
- ✅ **Gasless USDC transfers** with paymaster integration  
- ✅ **Smart wallet creation** and management
- ✅ **Session persistence** across devices
- ✅ **Clean, documented code** with inline comments
- ✅ **Responsive UI** with TailwindCSS
- ✅ **TypeScript** for type safety
- ✅ **Production-ready** configuration

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A modern browser with **WebAuthn support** (Chrome, Firefox, Safari, Edge)
- Basic knowledge of React and Next.js

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MasteraSnackin/lazorkit-passkey-demo.git
cd lazorkit-passkey-demo
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Try It Out!

1. Click **"Connect Wallet"**
2. Create a passkey when prompted (use Face ID/Touch ID/Windows Hello)
3. Your smart wallet is created!
4. Try sending a gasless USDC transfer

## 📁 Project Structure

```
lazorkit-passkey-demo/
├── app/
│   ├── layout.tsx          # Root layout with LazorkitProvider
│   ├── page.tsx            # Main demo page
│   └── providers.tsx       # Client-side provider wrapper
├── components/
│   ├── ConnectButton.tsx   # Passkey connection component  
│   ├── TransferForm.tsx    # Gasless transfer UI
│   └── WalletInfo.tsx      # Wallet details display
├── lib/
│   └── config.ts           # Lazorkit configuration
├── tutorials/
│   ├── 01-passkey-setup.md
│   └── 02-gasless-transactions.md
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 Tutorials

### Tutorial 1: Setting Up Passkey Authentication

[Read the full tutorial](./tutorials/01-passkey-setup.md)

**Quick Overview:**

1. **Install Lazorkit SDK**
```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

2. **Configure Provider**
```typescript
import { LazorkitProvider } from '@lazorkit/wallet';

const config = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }
};

export function Providers({ children }) {
  return (
    <LazorkitProvider {...config}>
      {children}
    </LazorkitProvider>
  );
}
```

3. **Create Connect Button**
```typescript
import { useWallet } from '@lazorkit/wallet';

export function ConnectButton() {
  const { connect, disconnect, isConnected, wallet } = useWallet();
  
  return isConnected ? (
    <button onClick={disconnect}>
      Disconnect ({wallet?.smartWallet.slice(0, 6)}...)
    </button>
  ) : (
    <button onClick={connect}>Connect Wallet</button>
  );
}
```

### Tutorial 2: Sending Gasless Transactions

[Read the full tutorial](./tutorials/02-gasless-transactions.md)

**Quick Overview:**

```typescript
import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  
  const handleTransfer = async (recipient: string, amount: number) => {
    const instruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey!,
      toPubkey: new PublicKey(recipient),
      lamports: amount * LAMPORTS_PER_SOL
    });
    
    const signature = await signAndSendTransaction({
      instructions: [instruction],
      transactionOptions: {
        feeToken: 'USDC' // Pay gas in USDC!
      }
    });
    
    console.log('Transaction confirmed:', signature);
  };
  
  return (/* Your UI */);
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh  
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

### Switching to Mainnet

Update `lib/config.ts`:

```typescript
export const LAZORKIT_CONFIG = {
  rpcUrl: "https://api.mainnet-beta.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.mainnet.lazorkit.com"
  }
};
```

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MasteraSnackin/lazorkit-passkey-demo)

### Manual Deployment

```bash
npm run build
npm start
```

### Requirements

- Ensure your deployment supports **HTTPS** (required for WebAuthn/passkeys)
- Add environment variables to your hosting platform

## 📚 Resources

- **Lazorkit Docs**: https://docs.lazorkit.com/
- **GitHub Repo**: https://github.com/lazor-kit/lazor-kit
- **Telegram Community**: https://t.me/lazorkit
- **Solana Docs**: https://docs.solana.com/

## 🐛 Troubleshooting

### Passkey Creation Fails

- **Check browser support**: Passkeys require WebAuthn (Chrome 67+, Firefox 60+, Safari 13+)
- **Verify HTTPS**: Passkeys only work on https:// or localhost
- **Clear browser data**: Sometimes cached credentials cause issues

### Transaction Fails

- **Insufficient balance**: Ensure your smart wallet has enough USDC for gasless transactions
- **Network issues**: Check Solana network status at https://status.solana.com/
- **RPC errors**: Try switching to a different RPC endpoint

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## ⭐ Acknowledgments

- Built for the [Superteam Earn Lazorkit Bounty](https://earn.superteam.fun/)
- Powered by [Lazorkit SDK](https://lazorkit.com/)
- Built with [Next.js](https://nextjs.org/)

---

**Made with ❤️ for the Solana ecosystem**
