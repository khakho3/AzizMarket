export function AuthLoadingScreen({ message }: { message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center text-center"
      >
        <span
          aria-hidden="true"
          className="size-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700"
        />
        <p className="mt-4 text-sm font-bold text-slate-700">{message}</p>
      </div>
    </div>
  );
}
