import React from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ShowWalletPage({ params }: Props) {
  const { id } = await params;
  return <div>{id}</div>;
}
