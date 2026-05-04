"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-2xl">⚠</div>
            <h1 className="text-xl font-bold text-gray-800">Something went wrong</h1>
            <p className="text-sm text-gray-500">
              {error.digest ? `Error ID: ${error.digest}` : "An unexpected error occurred."}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={reset}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
              >
                Try again
              </button>
              <a href="/admin/login" className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2">
                Go to login
              </a>
            </div>
            <p className="text-xs text-gray-300">Check Vercel → Logs for details</p>
          </div>
        </main>
      </body>
    </html>
  );
}
