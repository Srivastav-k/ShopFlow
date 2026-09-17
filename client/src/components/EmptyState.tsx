interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = '📦' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
