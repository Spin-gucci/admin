'use client'

import { useState } from 'react'
import { updateTransactionStatus } from '@/lib/actions/transactions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TransactionActionsProps {
  transactionId: string
}

export function TransactionActions({ transactionId }: TransactionActionsProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [notes, setNotes] = useState('')
  const router = useRouter()

  const handleApprove = async () => {
    setIsApproving(true)
    const result = await updateTransactionStatus(transactionId, 'completed', notes)
    if (result.error) {
      alert(result.error)
    }
    setIsApproving(false)
    router.refresh()
  }

  const handleReject = async () => {
    setIsRejecting(true)
    const result = await updateTransactionStatus(transactionId, 'rejected', notes)
    if (result.error) {
      alert(result.error)
    }
    setIsRejecting(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="bg-transparent">
            <CheckCircle className="size-4 mr-1" />
            {'Approve'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Approve Transaction'}</DialogTitle>
            <DialogDescription>
              {'This will complete the transaction and update the user balance.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approve-notes">{'Notes (Optional)'}</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? 'Processing...' : 'Approve Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <XCircle className="size-4 mr-1" />
            {'Reject'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Reject Transaction'}</DialogTitle>
            <DialogDescription>
              {'This transaction will be marked as rejected.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-notes">{'Reason (Optional)'}</Label>
              <Textarea
                id="reject-notes"
                placeholder="Reason for rejection..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
              {isRejecting ? 'Processing...' : 'Reject Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
