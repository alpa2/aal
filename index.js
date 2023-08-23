const provider = window.ethereum;

if (provider) {
  startApp(provider);
} else {
  console.log('Please install MetaMask!');
}

async function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
    return;
  }

  const ethereumButton = document.querySelector('.enableEthereumButton');
  const sendEthButton = document.querySelector('.sendEthButton');
  const showAccount = document.querySelector('.showAccount');

  let accounts = [];

  // Send Ethereum to an address
  sendEthButton.addEventListener('click', async () => {
    try {
      const transactionParameters = {
        from: accounts[0], // The user's active address.
        to: '0x9be00Ca9860D12244F2b56C2EdDB2F26e858EC92', // Replace with recipient address.
        value: '1000000000000', // Wei equivalent of 0.1 Ether.
        gasLimit: '0x5028', // Customizable by the user during MetaMask confirmation.
        maxPriorityFeePerGas: '0x3b9aca00', // Customizable by the user during MetaMask confirmation.
        maxFeePerGas: '0x2540be400', // Customizable by the user during MetaMask confirmation.
      };

      const response = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Transaction response:', response);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  });

  // Handle user accounts and accountsChanged (per EIP-1193)
  async function handleAccountsChanged(newAccounts) {
    if (newAccounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (newAccounts[0] !== currentAccount) {
      currentAccount = newAccounts[0];
      showAccount.innerHTML = currentAccount;
    }
  }

  let currentAccount = null;

  ethereum.on('accountsChanged', handleAccountsChanged);

  // Enable Ethereum button click event
  ethereumButton.addEventListener('click', async () => {
    try {
      accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      showAccount.innerHTML = currentAccount;
    } catch (err) {
      if (err.code === 4001) {
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    }
  });
}
