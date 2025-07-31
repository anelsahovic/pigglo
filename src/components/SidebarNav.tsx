'use client';

import { ChevronRight } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { IconType } from 'react-icons/lib';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: IconType;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <Separator />
      <SidebarGroupLabel>Direct Links</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url}>
              <SidebarMenuButton
                tooltip={item.title}
                className={cn(
                  'cursor-pointer ',
                  item.url === pathname ? 'text-primary font-bold' : ''
                )}
              >
                {<item.icon />}
                <span>{item.title}</span>
                <ChevronRight
                  className={cn(
                    item.url === pathname ? 'rotate-180' : '',
                    'ml-auto transition duration-300'
                  )}
                />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
