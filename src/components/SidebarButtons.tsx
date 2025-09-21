'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';
import { WalletClient } from '@/types';
import { RelatedPerson } from '@prisma/client';
import AddNewTransactionDialog from './AddNewTransactionDialog';
import AddNewWalletDialog from './AddNewWalletDialog';
import AddNewLoanDialog from './AddNewLoanDialog';
import AddNewRelatedPersonDialog from './AddNewRelatedPersonDialog';
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi';

interface Props {
  wallets: WalletClient[];
  relatedPersons: RelatedPerson[];
}

export function SidebarButtons({ relatedPersons, wallets }: Props) {
  const quickActionButtons = [
    <AddNewTransactionDialog
      key="New Income"
      quickAction
      relatedPersons={relatedPersons}
      wallets={wallets}
      defaultTransactionType="INCOME"
      quickActionLabel="Income"
      quickActionIcon={<GiReceiveMoney className="size-7 sm:size-6" />}
    />,
    <AddNewTransactionDialog
      key="New Expense"
      quickAction
      relatedPersons={relatedPersons}
      wallets={wallets}
      defaultTransactionType="EXPENSE"
      quickActionLabel="Expense"
      quickActionIcon={<GiPayMoney className="size-7 sm:size-6" />}
    />,

    <AddNewWalletDialog key="New Wallet" quickAction />,

    <AddNewLoanDialog
      key="Lend Money"
      quickAction
      loanType="lend"
      relatedPersons={relatedPersons}
      wallets={wallets}
    />,

    <AddNewLoanDialog
      key="Borrow Money"
      quickAction
      loanType="borrow"
      relatedPersons={relatedPersons}
      wallets={wallets}
    />,

    <AddNewRelatedPersonDialog key="New Person" quickAction />,
  ];

  return (
    <SidebarGroup>
      <Separator />
      <SidebarGroupLabel>Quick Action</SidebarGroupLabel>
      <SidebarMenu className="gap-3">
        {quickActionButtons.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>{item}</SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
