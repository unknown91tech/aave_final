// Web3.js USDC Approval and Aave Deposit on Testnet - Fixed Implementation
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import dotenv from 'dotenv';

dotenv.config();

const ERC20_ABI: AbiItem[] = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const AAVE_POOL_ABI: AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "onBehalfOf",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "referralCode",
        "type": "uint16"
      }
    ],
    "name": "supply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const USDC_ADDRESS = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC on Sepolia
const AAVE_POOL_ADDRESS = '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951'; // Aave V3 Pool on Sepolia

// Check if required environment variables are set
if (!process.env.INFURA_API_KEY) {
  throw new Error('INFURA_API_KEY environment variable is not set');
}

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is not set');
}

// Connect to Infura 
const infuraUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// Set up wallet
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const walletAddress = account.address;

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = walletAddress;

// Instantiate contracts
const usdcContract = new web3.eth.Contract(ERC20_ABI as any, USDC_ADDRESS);
const aavePoolContract = new web3.eth.Contract(AAVE_POOL_ABI as any, AAVE_POOL_ADDRESS);

// Main function
async function approveAndDeposit(): Promise<void> {
  try {
    console.log('Starting approval and deposit process...');
    console.log(`Using wallet address: ${walletAddress}`);
    
    // Get token decimals
    const decimals = await usdcContract.methods.decimals().call();
    console.log(`USDC decimals: ${decimals}`);
    
    // We'll use the exact decimals from the contract
    const amount = web3.utils.toBN(10).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals))).toString();
    console.log(`Amount in wei: ${amount}`);
    
    // 1. First check USDC balance
    const balance = await usdcContract.methods.balanceOf(walletAddress).call();
    console.log(`USDC Balance: ${web3.utils.fromWei(balance, 'mwei')} USDC`);
    
    if (Number(balance) < Number(amount)) {
      console.error('Insufficient USDC balance for the deposit');
      return;
    }
    
    // 2. Approve USDC to be spent by Aave Pool contract
    console.log(`Approving ${web3.utils.fromWei(amount, 'mwei')} USDC to be spent by Aave...`);
    console.log(`Aave Pool Address: ${AAVE_POOL_ADDRESS}`);
    
    try {
      const approveGasEstimate = await usdcContract.methods.approve(AAVE_POOL_ADDRESS, amount).estimateGas({
        from: walletAddress
      });
      
      console.log(`Approve gas estimate: ${approveGasEstimate}`);
      
      const approveTx = await usdcContract.methods.approve(AAVE_POOL_ADDRESS, amount).send({
        from: walletAddress,
        gas: Math.round(approveGasEstimate * 1.2), 
      });
      
      console.log('Approval transaction successful!');
      console.log('Transaction hash:', approveTx.transactionHash);
    } catch (error) {
      console.error('Error during approval:', error);
      return;
    }
    
    // 3. Deposit to Aave using 'supply' function (the correct function name in Aave V3)
    console.log(`Depositing ${web3.utils.fromWei(amount, 'mwei')} USDC to Aave...`);
    const d = await aavePoolContract.methods.approveAndDeposit;
      console.log("do as it says: ",d);
    try {
      // For the supply function, the onBehalfOf is our wallet address and referral code is 0
      const depositGasEstimate = await aavePoolContract.methods.supply(
        USDC_ADDRESS,
        amount,
        walletAddress,
        0
      ).estimateGas({
        from: walletAddress
      });
      
      console.log(`Deposit gas estimate: ${depositGasEstimate}`);
      
      const depositTx = await aavePoolContract.methods.supply(
        USDC_ADDRESS,
        amount,
        walletAddress,
        0
      ).send({
        from: walletAddress,
        gas: Math.round(depositGasEstimate * 1.2), 
      });
      
      console.log('Deposit transaction successful!');
      console.log('Transaction hash:', depositTx.transactionHash);
    } catch (error) {
      console.error('Error during deposit:', error);
      return;
    }
    
    console.log('Process completed successfully!');
  } catch (error) {
    console.error('Error during process:', error);
  }
}

// Run the function
approveAndDeposit();

