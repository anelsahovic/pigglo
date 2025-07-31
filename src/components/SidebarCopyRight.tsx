'use client';

import { Separator } from '@/components/ui/separator';
import { FaRegCopyright } from 'react-icons/fa6';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

export function SidebarCopyright() {
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <SidebarGroup className="p-0 mt-auto">
      <Separator className="mb-2" />
      <SidebarMenu>
        <SidebarMenuItem className="justify-center">
          <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground">
            <FaRegCopyright className="text-xs" />
            <span>Copyright {new Date().getFullYear()}</span>
            <a
              href="https://www.anelsahovic.com"
              className="hover:text-primary"
            >
              @anelsahovic
            </a>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
