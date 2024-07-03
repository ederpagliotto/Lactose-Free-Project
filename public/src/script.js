const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contractAddress = '0x9BDC4ef2dc8e442CEE144553686AaC3f5ae69614';
const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_manufacturer',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_details',
        type: 'string',
      },
    ],
    name: 'registerProduct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_productId',
        type: 'uint256',
      },
    ],
    name: 'verifyProduct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_productId',
        type: 'uint256',
      },
    ],
    name: 'getProduct',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'productCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'products',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'manufacturer',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'details',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isVerified',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function connectMetamask() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      document.getElementById(
        'walletAddress',
      ).innerText = `Connected: ${account}`;
      return account;
    } catch (error) {
      console.error('User denied account access', error);
      alert('Please connect to MetaMask.');
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask and try again.');
  }
}

async function registerProduct() {
  const productId = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;
  const manufacturer = document.getElementById('manufacturerName').value;
  const details = document.getElementById('productDetails').value;

  try {
    const account = await connectMetamask();
    if (account) {
      await contract.methods
        .registerProduct(productId, name, manufacturer, details)
        .send({ from: account });
      alert('Product registered successfully!');
    }
  } catch (error) {
    console.error(error);
    alert('There was an error registering the product.');
  }
}

async function verifyProduct() {
  const productId = document.getElementById('productId').value;

  try {
    const product = await contract.methods.getProduct(productId).call();
    document.getElementById('productName').innerText = `Name: ${product[1]}`;
    document.getElementById(
      'manufacturerName',
    ).innerText = `Manufacturer: ${product[2]}`;
    document.getElementById(
      'productDetailsText',
    ).innerText = `Details: ${product[3]}`;
    document.getElementById('productVerified').innerText = `Verified: ${
      product[4] ? 'Yes' : 'No'
    }`;

    alert('Product retrieved successfully!');
  } catch (error) {
    console.error(error);
    alert('There was an error retrieving the product.');
  }
}
