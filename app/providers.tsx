'use client';

import { LazorkitProvider } from '@lazorkit/wallet';
import { LAZORKIT_CONFIG } from '../lib/config';

/**
 * Providers Component
 * 
 * This component wraps the application with the LazorkitProvider,
 * enabling passkey authentication and gasless transactions throughout the app.
 * 
 * The 'use client' directive ensures this runs on the client-side only,
 * as the Lazorkit SDK requires browser APIs (WebAuthn).
 */
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
