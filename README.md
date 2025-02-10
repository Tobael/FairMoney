# FairMoney 💸

This project is a distributed bill tracking program (similar to tricount, splitwise, ...). Instead of a classic client-server architecture Fairmoney uses P2P with the help of Blockchain. 

# Features 🧑‍🔧
- [ ] Creating a bill with multiple users and multiple transactions amongst those users.
- [ ] Editing transactions and adding users after initially creating a bill.
  - Challenges are: Due to the nature of a blockchain editing a transaction after it is already part of a block is difficult. Possibly there is a need of reversing the transaction by artificially creating an inverse transaction.
- [ ] Sharing the bill with other participants of the bill
  - Challenges are: Sharing the bill requires P2P communication and has to somehow give access rights to the shared user. There is the possibility to include a new private key in the shared url that fits a validator. However, this makes links only usable once. The other possibility would be, to use only one keypair.

# Technical concepts ⛓️
When creating a new bill, a genesis block with a new blockchain is created for this specific group. One block contains some transactional data, as well as a list of validators, eligible of creating new blocks. The genesis block does only contain a public key and a signature of the creator of the bill.
```mermaid
classDiagram
    class Blockchain {
        Block[] blocks
    }
    class Block {
        number index
        number timestamp
        string previousHash
        string hash
        Transaction[] transactions
        string[] validators
        string signature
    }
    class Transaction {
        string sender
        string receiver
        number amount
    }

    Blockchain --> Block
    Block --> Transaction
```

This blockchain operates using PoA (proof of authority). The benefit of choosing PoA over other forms of verification is, that they also work reliably for small scale groups and do not require any resources in the already limited browser environment.