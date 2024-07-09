import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atmContract, setAtmContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContractInstance = new ethers.Contract(contractAddress, atmABI, signer);

    setAtmContract(atmContractInstance);
  };

  const getBalance = async () => {
    if (atmContract) {
      const balance = await atmContract.get_balance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async () => {
    if (atmContract) {
      const tx = await atmContract.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atmContract) {
      const tx = await atmContract.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="atm-container">
        <p className="account-info">Your Account: {account}</p>
        <p className="balance-info">Your Balance: {balance} ETH</p>
        <button className="atm-button" onClick={deposit}>Deposit 1 ETH</button>
        <button className="atm-button" onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
        }

        header {
          margin-bottom: 20px;
        }

        .atm-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border: 2px solid #ccc;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .account-info, .balance-info {
          font-size: 1.2em;
          margin-bottom: 10px;
        }

        .atm-button {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          background-color: #0070f3;
          color: #fff;
          font-size: 1em;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .atm-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </main>
  );
}
