# PolkadotJS Interface

A modern, responsive interface for interacting with Substrate-based blockchains via PolkadotJS API.

## Overview

This project recreates the ChainState and Extrinsic interfaces from PolkadotJS Apps, designed to connect to a local Polkadot parachain running via Zombienet.

## Features

- **ChainState Interface**
  - Query blockchain state data
  - Select from all available storage queries
  - Provide parameters for queries
  - View formatted query results

- **Extrinsics Interface**
  - Submit transactions to the blockchain
  - Select from all available extrinsic functions
  - Input parameters for transaction calls
  - Monitor transaction status from submission to finalization

- **Wallet Integration**
  - Connect with PolkadotJS browser extension
  - Sign transactions with your accounts
  - Seamless account selection

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd final/polkadot-interface
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Connecting to Your Node

The interface is pre-configured to connect to a local node at `ws://127.0.0.1:9944`. If your node is running on a different address, you can update the connection endpoint in the settings.


Video : https://youtu.be/gu9Bw6-U5nc?si=6-UyXT4jKGGYmlaW
