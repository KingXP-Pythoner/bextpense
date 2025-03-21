'use client'
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/shared/ui/button';
import { Trash } from 'lucide-react';
import { DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogClose } from '@/components/shared/ui/dialog';
import { TTransaction } from '@/lib/types/transaction';
import { toast } from 'sonner';
import React from 'react';
import { useAction } from 'next-safe-action/hooks';
import { deleteTransactionAction } from '@/actions/delete-transaction';
import dayjs from 'dayjs';
import { formatCurrency, toSentenceCase } from '@/lib/utils/format';

type Props = {
  transaction: TTransaction;
}

export const DeleteTransactionDialog = ({ transaction }: Props) => {
  const [open, setOpen] = React.useState(false);
  
  const { executeAsync: deleteTransaction, status } = useAction(deleteTransactionAction, {
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      setOpen(false);
    },
    onError: (error) => {
      const errorMessage = error?.error?.serverError || 'Unknown error';
      toast.error(`Failed to delete transaction: ${errorMessage}`);
    },
  });

  const handleDelete = async () => {
    await deleteTransaction({ id: transaction.id });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant='destructive' size='icon' onClick={() => setOpen(true)}>
        <Trash className="h-4 w-4" /> 
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='font-medium text-lg'>Delete transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 p-4 border rounded-md bg-muted/30">
          <p className="font-medium">{transaction.title}</p>
          {transaction.description && (
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          )}
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="text-muted-foreground">Amount:</span>
              <p className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p>{toSentenceCase(transaction.type)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p>{toSentenceCase(transaction.category)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>
              <p>{dayjs(transaction.transactionDate).format('DD/MM/YYYY')}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type='button' variant='outline'>Cancel</Button>
          </DialogClose>
          <Button 
            type='button' 
            variant='destructive'
            onClick={handleDelete}
            disabled={status === 'executing'}
          >
            {status === 'executing' ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>       
  )
} 