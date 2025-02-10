import { Transaction } from '@/logic/Transaction.ts'

type BlockLike = Block

export class Block {
  index: number
  timestamp: number
  previousHash: string
  hash: string
  transactions: Transaction[]
  validators: string[]
  signature: string

  constructor(
    index: number,
    previousHash: string,
    transactions: Transaction[],
    validators: string[],
  ) {
    this.index = index
    this.timestamp = Date.now()
    this.previousHash = previousHash
    this.transactions = transactions
    this.validators = validators
  }

  static from(blockData: BlockLike): Block {
    return new Block(
      blockData.index,
      blockData.previousHash,
      blockData.transactions.map(
        (transactionData) =>
          new Transaction(transactionData.sender, transactionData.receiver, transactionData.amount),
      ),
      blockData.validators,
    )
  }
}
