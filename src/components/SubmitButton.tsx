'use client';

import { Button } from '@/components/ui/button';
import { LuLoaderCircle } from 'react-icons/lu';

type Props = {
  label?: string;
  pending: boolean;
};

export default function SubmitButton({
  label = 'Submit',
  pending = false,
}: Props) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2"
    >
      {pending && (
        <span className="animate-spin">
          <LuLoaderCircle />
        </span>
      )}
      <span>{pending ? `${label}ing...` : label}</span>
    </Button>
  );
}
