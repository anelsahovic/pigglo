import { buttonVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import RelatedPersonCard from './RelatedPersonCard';
import { Currency, RelatedPerson } from '@prisma/client';
import clsx from 'clsx';

type Props = {
  persons: RelatedPerson[];
  userMainCurrency: Currency;
};

export default function AllRelatedPersonsDialog({
  persons,
  userMainCurrency,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger
        className={clsx(buttonVariants({ variant: 'link' }), 'cursor-pointer')}
      >
        See All
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Related Persons</DialogTitle>
          <DialogDescription>
            Showing all persons your finances are related with
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {persons.map((person, index) => (
            <RelatedPersonCard
              key={person.id}
              person={person}
              userMainCurrency={userMainCurrency}
              index={index}
              type="card"
            />
          ))}

          <>*pagination</>
        </div>
      </DialogContent>
    </Dialog>
  );
}
