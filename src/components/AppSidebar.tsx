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
import { RelatedPerson, User } from '@prisma/client';
import { LuFileChartLine, LuWallet } from 'react-icons/lu';
import { FaChartBar } from 'react-icons/fa';
import { SidebarCopyright } from './SidebarCopyRight';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';
import { WalletClient } from '@/types';

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
};

interface Props extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
  wallets: WalletClient[];
  relatedPersons: RelatedPerson[];
}

export function AppSidebar({ user, relatedPersons, wallets, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarAppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.sidebarNav} />
        <SidebarButtons relatedPersons={relatedPersons} wallets={wallets} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />

        <SidebarCopyright />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
