export const FACTRA_CONTRACT_ADDRESS = "0x5392A51Bf8801Dff78CA14EBb6aFcA900973511B";


export const FACTRA_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "dueDate", "type": "uint256" }
    ],
    "name": "createInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "fundInvoice",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "markAsPaid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];
