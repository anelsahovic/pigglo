'use client';
import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaChartBar,
  FaWallet,
  FaUser,
  FaUserPlus,
  FaPlusCircle,
} from 'react-icons/fa';
import { CgArrowsExchange } from 'react-icons/cg';
import { LuWallet } from 'react-icons/lu';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import clsx from 'clsx';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { TbLogout2, TbMoneybag, TbUserEdit } from 'react-icons/tb';
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button, buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '@prisma/client';
import Image from 'next/image';

const mobileNavItems = [
  { href: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
  { href: '/wallets', icon: <FaWallet />, label: 'Wallets' },
  {
    href: '/transactions',
    icon: <FaArrowRightArrowLeft />,
    label: 'Transactions',
  },
];

type Props = {
  user: User | null;
};

export default function MobileNavbar({ user }: Props) {
  const pathname = usePathname();

  if (pathname === '/') return;
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t shadow-lg h-16 flex items-center justify-around px-6">
      {mobileNavItems.slice(0, 2).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-label={item.label}
          className={clsx(
            'text-muted-foreground hover:text-primary transition-colors text-[22px]',
            pathname === item.href && 'text-primary'
          )}
        >
          {item.icon}
        </Link>
      ))}

      {/* Center FAB */}
      <div className="z-50 ">
        <Drawer>
          <DrawerTrigger className="outline-none">
            <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-full p-3 shadow-lg border border-border">
              <FaPlusCircle className="text-xl" />
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New</DrawerTitle>
              <DrawerDescription>Choose an action</DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-3 gap-4 px-6 py-4 text-center">
              <ActionItem
                icon={<GiReceiveMoney className="size-7" />}
                label="Income"
              />
              <ActionItem
                icon={<GiPayMoney className="size-7" />}
                label="Expense"
              />
              <ActionItem
                icon={<LuWallet className="size-7" />}
                label="Wallet"
              />
              <ActionItem
                icon={<CgArrowsExchange className="size-7" />}
                label="Transaction"
              />
              <ActionItem
                icon={<TbMoneybag className="size-7" />}
                label="Loan"
              />
              <ActionItem
                icon={<FaUserPlus className="size-7" />}
                label="Person"
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {mobileNavItems.slice(2, 3).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-label={item.label}
          className={clsx(
            'text-muted-foreground hover:text-primary transition-colors text-[22px]',
            pathname === item.href && 'text-primary'
          )}
        >
          {item.icon}
        </Link>
      ))}

      <Sheet>
        <SheetTrigger>
          <FaUser className="text-muted-foreground hover:text-primary transition-colors text-[22px]" />
        </SheetTrigger>

        <SheetContent
          className="w-full  z-50  pt-4 pb-8 px-6 space-y-8 shadow-xl  md:hidden
               [&>button:last-child]:hidden"
        >
          {/* Custom Close Button */}
          <SheetClose asChild>
            <button
              aria-label="Close"
              className="absolute top-4 left-4 z-50 p-2 text-muted-foreground hover:text-primary transition-colors  "
            >
              <IoClose className="text-3xl" />
            </button>
          </SheetClose>

          {/* Header */}
          <div className="text-center space-y-1">
            <SheetTitle className="text-2xl font-semibold">
              <div className="relative h-10">
                <Image
                  src="/logo.png"
                  alt="Pigglo"
                  fill
                  className="object-contain"
                />
              </div>
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Manage your balance
            </SheetDescription>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-xl font-bold capitalize">{user?.name}</h2>
            <Avatar className="size-24 shadow-lg ring-2 ring-primary/20">
              <AvatarImage src={user?.profileImage ?? ''} />
              <AvatarFallback className="bg-primary uppercase font-semibold text-3xl">
                {user?.name?.[0] ??
                  user?.username?.[0] ??
                  user?.email?.[0] ??
                  ''}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-base text-neutral-700 font-semibold">
              @{user?.username ?? 'User'}
            </h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>

          {/*Edit, Navigation Links, Logout */}
          <div className="flex h-full w-full flex-col justify-between items-center gap-2">
            {/* edit profile */}
            <Drawer>
              <DrawerTrigger
                className={clsx(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  'w-full '
                )}
              >
                <TbUserEdit />
                Edit Profile
              </DrawerTrigger>
              <DrawerContent className="p-2">
                <DrawerHeader>
                  <DrawerClose className="absolute left-4 top-4 text-primary font-semibold">
                    Done
                  </DrawerClose>
                  <DrawerTitle>Edit Profile</DrawerTitle>
                  <DrawerDescription>Edit your profile.</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col w-full justify-center items-center gap-4 p-2 px-8">
                  <div className="flex flex-col w-full justify-center items-start gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" />
                  </div>
                  <div className="flex flex-col w-full justify-center items-start gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" />
                  </div>
                  <div className="flex flex-col w-full justify-center items-start gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                  </div>
                  <div className="flex flex-col w-full justify-center items-start gap-2">
                    <Label htmlFor="img">Image Url</Label>
                    <Input id="img" type="text" />
                  </div>

                  <Button>Save</Button>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Navigation Links */}
            <div className="flex flex-col w-full gap-2">
              <SheetClose asChild>
                <Link
                  href="/dashboard"
                  className="block w-full rounded-xl p-3 text-center text-base font-medium bg-muted hover:bg-muted/80 transition"
                >
                  Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/wallets"
                  className="block w-full rounded-xl p-3 text-center text-base font-medium bg-muted hover:bg-muted/80 transition"
                >
                  Wallets
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/loans"
                  className="block w-full rounded-xl p-3 text-center text-base font-medium bg-muted hover:bg-muted/80 transition"
                >
                  Loans
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/transactions"
                  className="block w-full rounded-xl p-3 text-center text-base font-medium bg-muted hover:bg-muted/80 transition"
                >
                  Transactions
                </Link>
              </SheetClose>
            </div>

            <LogoutLink
              className={clsx(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full '
              )}
            >
              <TbLogout2 />
              Logout
            </LogoutLink>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

function ActionItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
      {icon}
      <span>{label}</span>
    </button>
  );
}
