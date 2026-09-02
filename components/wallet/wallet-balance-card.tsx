type WalletBalanceCardProps = {
  balance: number;
};

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  return (
    <div className="flex h-full min-h-48 flex-col justify-between rounded-md border bg-white p-3 shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground">Your Balance</p>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {balance.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-lg font-medium text-foreground">Coins</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Get up to 100% off on your next booking
      </p>
    </div>
  );
}
