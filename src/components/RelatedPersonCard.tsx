import { LoanTransaction } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Currency, RelatedPerson } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getUserLoansByRelatedPersonId } from '@/lib/queries/loans';
import { getTotalLoanAmountInMainCurrency } from '@/lib/utils';
import TransactionCard from './TransactionCard';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';
import { MdEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

type Props = {
  person: RelatedPerson;
  index: number;
  userMainCurrency: Currency;
  type?: 'avatar' | 'card';
};

export default async function RelatedPersonCard({
  person,
  userMainCurrency,
  type = 'avatar',
}: Props) {
  const fetchedLoans = await getUserLoansByRelatedPersonId(person.id);

  const personsLoans: LoanTransaction[] = fetchedLoans.flatMap(
    (item) => item.transactions
  );

  const loansGivenToPerson = personsLoans.filter(
    (loan) => loan.loan?.direction === 'TO_SOMEONE'
  );
  const loansTakenFromPerson = personsLoans.filter(
    (loan) => loan.loan?.direction === 'FROM_SOMEONE'
  );

  const totalLentAmount = await getTotalLoanAmountInMainCurrency(
    loansGivenToPerson,
    userMainCurrency
  );

  const totalBorrowedAmount = await getTotalLoanAmountInMainCurrency(
    loansTakenFromPerson,
    userMainCurrency
  );

  // Trigger component depending on type
  const TriggerContent =
    type === 'avatar' ? (
      <div className="flex flex-col items-center gap-1 cursor-pointer ">
        <Avatar className="size-14 shadow">
          <AvatarImage src={person.iconUrl} />
          <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
            {person.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground">
          {person.name.split(' ')[0]}
        </span>
      </div>
    ) : (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm hover:shadow-md cursor-pointer transition-all">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={person.iconUrl} />
            <AvatarFallback className="bg-muted font-semibold text-foreground">
              {person.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{person.name}</p>
            <p className="text-xs text-muted-foreground">
              {loansGivenToPerson.length} loans given |{' '}
              {loansTakenFromPerson.length} loans taken
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end text-sm">
          <span className="text-red-600 font-semibold whitespace-nowrap">
            -{totalLentAmount} {userMainCurrency}
          </span>
          <span className="text-green-600 font-semibold whitespace-nowrap">
            +{totalBorrowedAmount} {userMainCurrency}
          </span>
        </div>
      </div>
    );

  return (
    <Dialog>
      <DialogTrigger asChild>{TriggerContent}</DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Person Details</DialogTitle>
          <DialogDescription>
            Financial overview of your transactions with this person
          </DialogDescription>
        </DialogHeader>

        {/* person name and action buttons */}
        <div className="flex items-center justify-between px-2">
          <div className="text-xl font-bold flex items-center gap-3 my-2">
            {/* person icon and name */}
            <Avatar className="size-12">
              <AvatarImage src={person.iconUrl} />
              <AvatarFallback className="bg-muted font-semibold text-foreground">
                {person.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {person.name}
          </div>

          {/* action buttons */}
          <div className="flex gap-2">
            <Button variant="outline">
              <MdEdit />
              <span className="hidden sm:flex">Edit</span>
            </Button>
            <Button variant="destructive">
              {' '}
              <FaRegTrashAlt />
              <span className="hidden sm:flex">Delete</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/*  Loan Stats */}
          <div className="flex flex-wrap gap-4 w-full justify-center">
            <div className="p-4 rounded-lg border bg-gradient-to-br from-red-50 to-white shadow-sm flex-1 grow">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="size-4 text-red-600" />
                <p className="text-sm font-medium text-red-700">Money Lent</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-red-700">
                {totalLentAmount} {userMainCurrency}
              </p>
              <p className="text-xs text-muted-foreground">
                {loansGivenToPerson.length} transaction
                {loansGivenToPerson.length !== 1 && 's'}
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-white shadow-sm flex-1 grow">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownLeft className="size-4 text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  Money Borrowed
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-700">
                {totalBorrowedAmount} {userMainCurrency}
              </p>
              <p className="text-xs text-muted-foreground">
                {loansTakenFromPerson.length} transaction
                {loansTakenFromPerson.length !== 1 && 's'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Transactions */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Transactions
            </h3>
            <ScrollArea className="h-60 ">
              <div className="flex flex-col gap-2">
                {personsLoans.length > 0 ? (
                  personsLoans.map((loan) => (
                    <TransactionCard key={loan.id} transaction={loan} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No transactions found
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
