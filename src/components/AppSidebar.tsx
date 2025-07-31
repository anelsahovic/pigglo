'use client';

import * as React from 'react';

import { NavMain } from '@/components/SidebarNav';
import { SidebarButtons } from '@/components/SidebarButtons';
import { SidebarUser } from '@/components/SidebarUser';
import { SidebarAppLogo } from '@/components/SidebarAppLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { User } from '@prisma/client';
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import { LuFileChartLine, LuWallet } from 'react-icons/lu';
import { CgArrowsExchange } from 'react-icons/cg';
import { TbMoneybag } from 'react-icons/tb';
import { FaChartBar, FaUserPlus } from 'react-icons/fa';
import { SidebarCopyright } from './SidebarCopyRight';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';

const data = {
  sidebarNav: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: FaChartBar,
    },
    {
      title: 'Wallets',
      url: '/wallets',
      icon: LuWallet,
    },
    {
      title: 'Transactions',
      url: '/transactions',
      icon: LuFileChartLine,
    },
    {
      title: 'Loans',
      url: '/loans',
      icon: LiaMoneyCheckAltSolid,
    },
  ],
  buttons: [
    {
      name: 'Income',
      icon: GiReceiveMoney,
    },
    {
      name: 'Expense',
      icon: GiPayMoney,
    },
    {
      name: 'Wallet',
      icon: LuWallet,
    },
    {
      name: 'Transaction',
      icon: CgArrowsExchange,
    },
    {
      name: 'Loan',
      icon: TbMoneybag,
    },
    {
      name: 'Person',
      icon: FaUserPlus,
    },
  ],
};

interface Props extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
}

export function AppSidebar({ user, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarAppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.sidebarNav} />
        <SidebarButtons buttons={data.buttons} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />

        <SidebarCopyright />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
