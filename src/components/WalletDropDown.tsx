'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MdMoreVert } from 'react-icons/md';
import ChangeWalletCurrencyDialog from './ChangeWalletCurrencyDialog';
import EditWalletDialog from './EditWalletDialog';
import { WalletClient } from '@/types';
import DeleteWalletDialog from './DeleteWalletDialog';

interface Props {
  wallet: WalletClient;
}

export default function WalletDropDown({ wallet }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MdMoreVert className="text-2xl cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0 m-0" asChild>
          <ChangeWalletCurrencyDialog wallet={wallet} />
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 m-0" asChild>
          <EditWalletDialog wallet={wallet} />
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 m-0" asChild>
          <DeleteWalletDialog wallet={wallet} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
