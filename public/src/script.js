const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contractAddress = '0xd35c645f266844bd03658b47a4c7c7193ec3ae43';
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
      {
        internalType: 'string[]',
        name: '_documentHashes',
        type: 'string[]',
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
        internalType: 'string[]',
        name: '',
        type: 'string[]',
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

async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      maxBodyLength: 'Infinity', // Deixe isso do jeito que está
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer ${''}`, // my pinata jwt
      },
    },
  );

  return res.data.IpfsHash;
}

async function registerProduct() {
  const productId = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;
  const manufacturer = document.getElementById('manufacturerName').value;
  const details = document.getElementById('productDetails').value;
  const files = document.getElementById('productFiles').files;

  const documentHashes = [];
  for (let i = 0; i < files.length; i++) {
    const hash = await uploadToIPFS(files[i]);
    documentHashes.push(hash);
  }

  try {
    const account = await connectMetamask();
    if (account) {
      await contract.methods
        .registerProduct(productId, name, manufacturer, details, documentHashes)
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
      product[5] ? 'Yes' : 'No'
    }`;

    const fileContainer = document.getElementById('fileContainer');
    fileContainer.innerHTML = '';
    product[4].forEach((hash) => {
      const fileLink = document.createElement('a');
      fileLink.href = `https://gateway.pinata.cloud/ipfs/${hash}`;
      fileLink.target = '_blank';
      fileLink.innerText = `View File: ${hash}`;
      fileContainer.appendChild(fileLink);
    });

    alert('Product retrieved successfully!');
  } catch (error) {
    console.error(error);
    alert('There was an error retrieving the product.');
  }
}
