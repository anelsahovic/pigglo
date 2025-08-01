import { Wallet } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { currencySymbols } from '@/lib/currencySymbols';
import { walletIconMap } from '@/lib/ walletIcons';
import { FaClockRotateLeft } from 'react-icons/fa6';
import Link from 'next/link';

type Props = {
  wallet: Wallet;
};

export default function WalletCard({ wallet }: Props) {
  const symbol = currencySymbols[wallet.currency];
  const Icon = walletIconMap[wallet.icon];

  return (
    <Link
      href={`/wallets/${wallet.id}`}
      className="group relative flex flex-col justify-between gap-4 p-5 shadow-md border rounded-2xl bg-gradient-to-br from-primary via-rose-300 to-rose-400 hover:shadow-lg transition-all duration-200 ease-in-out"
    >
      {/* Icon + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl text-white group-hover:scale-110 transition-transform">
            {Icon}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
            <div className="flex items-center gap-2 text-muted">
              <FaClockRotateLeft />
              <span className="text-sm text-muted">
                {formatDistanceToNow(wallet.updatedAt)} ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="flex justify-between items-end ">
        <div className="text-sm text-muted">Balance</div>
        <div className=" flex items-end gap-1 font-bold text-white tracking-tight">
          <span className="text-xl">{wallet.balance.toLocaleString()}</span>
          <span className="text-base">{symbol}</span>
        </div>
      </div>
    </Link>
  );
}
