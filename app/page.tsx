import ConnectButton from "@/components/ConnectButton";
import TransferForm from "@/components/TransferForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Lazorkit Passkey Demo
            </h1>
            <p className="text-gray-400 mt-2">Passkey Authentication + Gasless Transactions</p>
          </div>
          <ConnectButton />
        </header>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 max-w-2xl mx-auto">
          {/* Features Section */}
          <div className="p-6 border border-gray-700 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">✨ Key Features</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">🔐</span>
                <div>
                  <strong>Passkey Authentication:</strong> No seed phrases needed - use biometrics or device security
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⛽</span>
                <div>
                  <strong>Gasless Transactions:</strong> Send SOL without worrying about transaction fees
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💼</span>
                <div>
                  <strong>Smart Wallet:</strong> Powered by Lazorkit SDK for seamless Web3 UX
                </div>
              </li>
            </ul>
          </div>

          {/* Transfer Form */}
          <TransferForm />

          {/* Instructions */}
          <div className="p-6 border border-gray-700 rounded-lg bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-3">📖 How to Use</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Click "Connect Wallet" to create or access your passkey wallet</li>
              <li>Use your device's biometrics (Face ID, Touch ID, Windows Hello, etc.)</li>
              <li>Enter a recipient address and amount to send SOL</li>
              <li>Confirm the transaction - no gas fees required!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Lazorkit SDK • Deployed on Solana Devnet</p>
        </footer>
      </div>
    </main>
  );
}
