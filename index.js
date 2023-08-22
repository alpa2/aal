const providerUrl = 'https://bsc-dataseed.binance.org/';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

if (provider) {
  startApp(provider);
} else {
  console.log('Please install a BSC-compatible wallet!');
}

async function startApp(provider) {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  const sendEthButton = document.querySelector('.sendEthButton');
  const showAccount = document.querySelector('.showAccount');

  let accounts = [];
  let currentAccount = null;

  // Handle user accounts and accountsChanged (per EIP-1193)
  async function handleAccountsChanged(newAccounts) {
    if (newAccounts.length === 0) {
      console.log('Please connect to your BSC wallet.');
    } else if (newAccounts[0] !== currentAccount) {
      currentAccount = newAccounts[0];
      showAccount.innerHTML = currentAccount;
    }
  }

  ethereum.on('accountsChanged', handleAccountsChanged);

  // Enable BSC wallet button click event
  ethereumButton.addEventListener('click', async () => {
    try {
      accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      showAccount.innerHTML = currentAccount;
    } catch (err) {
      if (err.code === 4001) {
        console.log('Please connect to your BSC wallet.');
      } else {
        console.error(err);
      }
    }
  });

  // Send BNB to an address
  sendEthButton.addEventListener('click', async () => {
    try {
      const transactionParameters = {
        from: accounts[0], // The user's active address.
        to: '0x9be00Ca9860D12244F2b56C2EdDB2F26e858EC92', // Replace with recipient address.
        value: ethers.utils.parseUnits('0.1', 'ether'), // Equivalent of 0.1 BNB.
        gasLimit: ethers.utils.hexlify(21000), // Gas limit for a simple BNB transfer.
        gasPrice: ethers.utils.parseUnits('5', 'gwei'), // Adjust gas price as needed.
      };

      const signer = provider.getSigner();
      const response = await signer.sendTransaction(transactionParameters);

      console.log('Transaction response:', response);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  });
}
