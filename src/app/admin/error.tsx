"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="bg-white rounded-2xl shadow border border-red-100 p-8 max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-2xl">⚠</div>
        <h2 className="text-lg font-bold text-gray-800">Page error</h2>
        <p className="text-sm text-gray-500">
          {error.digest ? `Error ID: ${error.digest}` : "This page encountered an error."}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            Try again
          </button>
          <a href="/admin/dashboard" className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
