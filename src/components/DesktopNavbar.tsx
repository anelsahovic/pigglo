import { User } from '@prisma/client';
import React from 'react';

type Props = {
  user: User | null;
};

export default function DesktopNavbar({ user }: Props) {
  return <div className="hidden sm:flex">{user?.name}</div>;
}
