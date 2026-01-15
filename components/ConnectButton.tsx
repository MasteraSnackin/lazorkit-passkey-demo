'use client';

import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';

/**
 * ConnectButton Component
 * 
 * Handles passkey-based wallet connection and disconnection.
 * Uses Lazorkit's useWallet hook to manage authentication state.
 * 
 * Features:
 * - Passkey creation/authentication with WebAuthn
 * - Loading states during connection
 * - Error handling
 * - Connected wallet display
 */
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
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      setError(null);
    } catch (err) {
      console.error('Disconnection error:', err);
    }
  };

  // Connected state
  if (isConnected && wallet) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-800">
            {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
          </span>
        </div>
        <button 
          onClick={handleDisconnect}
          className="px-6 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  // Disconnected state
  return (
    <div className="flex flex-col items-center gap-3">
      <button 
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-8 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Connect with Passkey
          </span>
        )}
      </button>
      
      {error && (
        <div className="max-w-md p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-semibold">Connection Failed</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 max-w-xs text-center">
        No wallet extension needed. Just use your device's biometrics (Face ID, Touch ID, or Windows Hello)
      </p>
    </div>
  );
}
