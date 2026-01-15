/**
 * Lazorkit SDK Configuration
 * 
 * This file contains the configuration for connecting to Lazorkit's
 * passkey authentication and gasless transaction infrastructure.
 */

export const LAZORKIT_CONFIG = {
  // Solana RPC endpoint - Use Devnet for development
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  
  // Lazorkit Portal URL - Manages passkey authentication
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh",
  
  // Paymaster configuration - Enables gasless transactions
  paymasterConfig: {
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://kora.devnet.lazorkit.com"
  }
};

/**
 * Network configuration for different environments
 */
export const NETWORK_CONFIG = {
  devnet: {
    rpcUrl: "https://api.devnet.solana.com",
    portalUrl: "https://portal.lazor.sh",
    paymasterUrl: "https://kora.devnet.lazorkit.com",
    explorerUrl: "https://explorer.solana.com?cluster=devnet"
  },
  mainnet: {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    portalUrl: "https://portal.lazor.sh",
    paymasterUrl: "https://kora.mainnet.lazorkit.com",
    explorerUrl: "https://explorer.solana.com"
  }
};
