# FairMoney

Easily share your expenses with your friends, colleagues or any other group of your choice.

# Blockchain setup
Every group has a set of transactions saved in a blockchain. The genesis Block contains the first transactions made when creating the group. Proof of authority is required and shared with and edit link, not shared with a view link.

```mermaid
flowchart
    GenesisBlock["Alice --> Bob: 10€
    Bob --> Michael: 5€
    PreviousHash: 0"]
```

```mermaid
classDiagram
    Blockchain --> Block
    Block --> Transaction

    Blockchain : Vec~Block~ blocks
    Blockchain : Vec~Transaction~ pending_transactions
    Block : u64 index
    Block : u64 timestamp
    Block : String previous_hash
    Block : String hash
    Block : Vec~Transaction~ transactions
    Block : String validator
    Block : String signature
    Block : calculate_hash() String
    Block : String signature
    Transaction : String sender
    Transaction : String receiver
    Transaction : f64 amount
```