'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { IconType } from 'react-icons/lib';
import { Separator } from './ui/separator';

export function SidebarButtons({
  buttons,
}: {
  buttons: {
    name: string;
    icon: IconType;
  }[];
}) {
  return (
    <SidebarGroup>
      <Separator />
      <SidebarGroupLabel>Add New</SidebarGroupLabel>
      <SidebarMenu>
        {buttons.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton tooltip={'Add ' + item.name} asChild>
              <button className="cursor-pointer">
                <item.icon />
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem></SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
