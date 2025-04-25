# Aave Testnet Integration with TypeScript

This project demonstrates how to interact with USDC (ERC20 token) and Aave contracts on Ethereum testnets like Sepolia using web3.js and TypeScript.

## Features

- Connect to Ethereum testnet using Infura
- Manage wallet private keys securely using environment variables
- Check USDC token balance
- Interact with Aave's smart contracts for lending
- Combined approve and deposit in a single transaction using Aave's `approveAndDeposit` function

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- An Ethereum wallet with testnet ETH and USDC
- Infura API key

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/aave-usdc-demo.git
   cd aave-usdc-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your private key and Infura API key:
   ```
   PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
   INFURA_API_KEY=your_infura_project_id
   ```


## Getting Testnet Assets

1. Get testnet ETH from a faucet:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Holesky Faucet](https://faucet.holesky.ethpandaops.io/)

2. ### Getting Sepolia USDC
   1. You can get test USDC from various faucets or by swapping on Uniswap Sepolia
   2. Some options:
      - Use [Aave's faucet](https://app.aave.com/faucet/) if available
      - Swap ETH for USDC on [Uniswap Sepolia](https://app.uniswap.org/)

## Usage

Run the script to approve and deposit USDC to Aave:

```bash
npm start
```

## Contract Addresses

The script uses the following contract addresses on Sepolia testnet:

- USDC: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- Aave Pool: `0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951`


## TypeScript Configuration

This project uses TypeScript for type safety. The configuration is in the `tsconfig.json` file.

