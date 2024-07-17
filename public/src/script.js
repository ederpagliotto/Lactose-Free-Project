const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contractAddress = '0xcd8670735738135175670db95baeaa99f2859e30';
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
    name: 'getProductById',
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
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    name: 'getProductByName',
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
// Connecting to metamask
async function connectMetamask() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      const compactAddress = `${account.substring(0, 6)}...${account.substring(
        account.length - 5,
      )}`;
      document.getElementById(
        'walletAddress',
      ).innerHTML = `<strong>Wallet Address: </strong>${compactAddress}`;
      return account;
    } catch (error) {
      console.error('Denied account access', error);
      alert('Please connect to MetaMask.');
    }
  } else {
    alert(
      'MetaMask is not installed. Please install MetaMask on browser and try again.',
    );
  }
}
// Uploading file to IPFS using Pinata
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
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ODJiMWU4Ni04YTcyLTRkODAtYTBiZi05NzQxM2FmODVlN2MiLCJlbWFpbCI6ImVkZXJwYWdsaW90dG9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjdhYTk4MWE5YTI0NzUzY2JmMDJiIiwic2NvcGVkS2V5U2VjcmV0IjoiYWViZDdkOWQ3OTFjMzk0YjNkM2NiODVhNDQ0OGU3NDIwYmEyNDZiYWYwMTNhMjFmMWEyMjNhZjM0ZDYwNDc5YiIsImV4cCI6MTc1MTgwODU4OH0.rzu84iqpuL2aiZcqiwVjTMoFWKaMFmjitldjiATA2JE'}`, // My pinata JWT
      },
    },
  );

  return res.data.IpfsHash;
}
// Registering product
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
      const product = await contract.methods.getProductById(productId).call();
      if (product[1] !== '') {
        alert('Product ID already exists. Please insert a different ID.');
        return;
      }
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
// Verifying product
async function verifyProduct() {
  const productId = document.getElementById('productId').value;
  const productName = document.getElementById('productName').value;

  try {
    let product;
    let productExists = false;
    if (productId) {
      product = await contract.methods.getProductById(productId).call();
      productExists = product[1] !== ''; // Checking if product's name is not empty
    } else if (productName) {
      product = await contract.methods.getProductByName(productName).call();
      productExists = product[1] !== ''; // Chack if product's name is not empty
    } else {
      alert('Please enter a Product ID or Product Name.');
      return;
    }
    const retrievedDiv = document.querySelector('.retrieved');
    if (productExists) {
      retrievedDiv.setAttribute('id', 'productRetrieved');
      document.getElementById('detailsTitle').innerText = `Product Details`;

      document.getElementById(
        'productNameText',
      ).innerHTML = `<strong>Name:</strong> ${product[1]}`;
      document.getElementById(
        'manufacturerName',
      ).innerHTML = `<strong>Manufacturer:</strong> ${product[2]}`;
      document.getElementById(
        'productDetailsText',
      ).innerHTML = `<strong>Details:</strong> ${product[3]}`;

      const verifiedText = product[5]
        ? '<strong style="color: green;">Yes</strong>'
        : '<strong style="color: red;">No</strong>';
      document.getElementById(
        'productVerified',
      ).innerHTML = `<strong>Verified:</strong> ${verifiedText}`;

      const fileContainer = document.getElementById('fileContainer');
      fileContainer.innerHTML = '';

      if (product[4].length > 0) {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = '<strong>Additional Documents:</strong> ';
        fileContainer.appendChild(paragraph);

        product[4].forEach((hash, index) => {
          const fileLink = document.createElement('a');
          fileLink.href = `https://gateway.pinata.cloud/ipfs/${hash}`;
          fileLink.target = '_blank';
          fileLink.innerText = `Document #${index + 1}`;
          fileLink.classList.add('document-link');
          fileContainer.appendChild(fileLink);
          fileContainer.appendChild(document.createElement('br'));
        });
      }

      alert('Product retrieved successfully!');
    } else {
      document.getElementById('detailsTitle').innerText = '';
      document.getElementById('productNameText').innerText = '';
      document.getElementById('manufacturerName').innerText = '';
      document.getElementById('productDetailsText').innerText = '';
      document.getElementById('productVerified').innerText = '';
      document.getElementById('fileContainer').innerHTML = '';

      alert('Product not found.');
    }
  } catch (error) {
    console.error(error);
    alert('There was an error retrieving the product.');
  }
}
// Confirming verification
async function confirmVerification() {
  const productId = document.getElementById('productId').value;
  const productName = document.getElementById('productName').value;

  if (!productId && !productName) {
    alert('Please enter a Product ID or Product Name.');
    return;
  }

  try {
    const account = await connectMetamask();
    if (account) {
      let product;
      let productExists = false;
      if (productId) {
        product = await contract.methods.getProductById(productId).call();
        productExists = product[1] !== '';
      } else if (productName) {
        product = await contract.methods.getProductByName(productName).call();
        productExists = product[1] !== '';
      }

      if (productExists) {
        if (product[5]) {
          // Check if the product is already verified
          alert(
            'Product is already verified. Cannot change verification status.',
          );
          return;
        }

        if (productId) {
          await contract.methods
            .verifyProduct(productId)
            .send({ from: account });
        } else if (productName) {
          await contract.methods
            .verifyProduct(product[0])
            .send({ from: account });
        }
        alert('Product verified successfully!');
        verifyProduct(); // Update the product details display
      } else {
        alert('Product not found. Cannot verify an unregistered product.');
      }
    }
  } catch (error) {
    console.error(error);
    alert('There was an error verifying the product.');
  }
}
