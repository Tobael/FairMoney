export class Transaction {
  id: number
  purpose: string
  sender: string
  receiver: string
  amount: number

  constructor(id: number, purpose: string, sender: string, receiver: string, amount: number) {
    this.id = id
    this.purpose = purpose
    this.sender = sender
    this.receiver = receiver
    this.amount = amount
  }
}

export type TransformedTransaction = {
  sender: string
  transactions: [{ receiver: string[]; purpose: string; amount: number }]
}

export function toTransformedTransactions(transactions: Transaction[]): TransformedTransaction[] {
  const transformedMap: Map<string, TransformedTransaction> = new Map()
  const receiversSet: Set<string> = new Set()

  transactions.forEach(({ sender, receiver, purpose, amount }) => {
    if (!transformedMap.has(sender)) {
      transformedMap.set(sender, { sender, transactions: [] })
    }

    const senderEntry = transformedMap.get(sender)!
    const existingTransaction = senderEntry.transactions.find(
      (t) => t.purpose === purpose && t.amount === amount,
    )

    if (existingTransaction) {
      existingTransaction.receiver.push(receiver)
    } else {
      senderEntry.transactions.push({ receiver: [receiver], purpose, amount })
    }

    receiversSet.add(receiver)
  })

  receiversSet.forEach((receiver) => {
    if (!transformedMap.has(receiver)) {
      transformedMap.set(receiver, {
        sender: receiver,
        transactions: [{ receiver: [], purpose: '', amount: 0 }],
      })
    }
  })

  return Array.from(transformedMap.values())
}

export function fromTransformedTransactions(
  transformedTransactions: TransformedTransaction[],
): Transaction[] {
  let idCounter = 1
  const transactions: Transaction[] = []

  transformedTransactions.forEach(({ sender, transactions: trans }) => {
    trans.forEach(({ receiver, purpose, amount }) => {
      if (purpose === '' && amount === 0 && receiver.length === 0) {
        return
      }
      receiver.forEach((rec) => {
        transactions.push(new Transaction(idCounter++, purpose, sender, rec, amount))
      })
    })
  })

  return transactions
}
