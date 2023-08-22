const provider = window.BinanceChain;

    if (provider) {
      startApp(provider);
    } else {
      console.log('Please install Binance Wallet!');
    }

    async function startApp(provider) {
      if (provider !== window.BinanceChain) {
        console.error('Do you have multiple wallets installed?');
        return;
      }

      const enableBSCButton = document.querySelector('.enableBSCButton');
      const sendBNBButton = document.querySelector('.sendBNBButton');
      const showAccount = document.querySelector('.showAccount');

      let accounts = [];

      // Send BNB to an address
      sendBNBButton.addEventListener('click', async () => {
        try {
          const transactionParameters = {
            from: accounts[0], // The user's active address.
            to: '0x9be00Ca9860D12244F2b56C2EdDB2F26e858EC92', // Replace with recipient address.
            value: '1000000000000', // Wei equivalent of 0.001 BNB.
            gasLimit: '0x5028', // Customizable by the user during confirmation.
            gasPrice: '0x3b9aca00', // Customizable by the user during confirmation.
          };

          const response = await provider.request({
            method: 'eth_sendTransaction', // Yes, BSC uses Ethereum-compatible RPC methods.
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
          console.log('Please connect to Binance Wallet.');
        } else if (newAccounts[0] !== currentAccount) {
          currentAccount = newAccounts[0];
          showAccount.innerHTML = currentAccount;
        }
      }

      let currentAccount = null;

      provider.on('accountsChanged', handleAccountsChanged);

      // Enable BSC button click event
      enableBSCButton.addEventListener('click', async () => {
        try {
          accounts = await provider.request({ method: 'eth_requestAccounts' });
          currentAccount = accounts[0];
          showAccount.innerHTML = currentAccount;
        } catch (err) {
          if (err.code === 4001) {
            console.log('Please connect to Binance Wallet.');
          } else {
            console.error(err);
          }
        }
      });
    }
