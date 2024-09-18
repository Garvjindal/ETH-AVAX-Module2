import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BusRentalAbi from "../artifacts/contracts/BusRental.sol/BusRental.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [BusRental, setBusRental] = useState(undefined);
  const [rentalStatus, setRentalStatus] = useState(undefined);
  const [message, setMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const BusRentalABI = BusRentalAbi.abi;

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
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getBusRentalContract();
    } catch (error) {
      setMessage("Error connecting account: " + (error.message || error));
    }
  };

  const getBusRentalContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const BusRentalContract = new ethers.Contract(contractAddress, BusRentalABI, signer);
    setBusRental(BusRentalContract);
  };

  const getRentalStatus = async () => {
    try {
      if (BusRental && account) {
        const status = await BusRental.getRentalStatus(account);
        setRentalStatus(status);
      }
    } catch (error) {
      setMessage("Error fetching rental status: " + (error.message || error));
    }
  };

  const rentBus = async () => {
    setMessage("");
    if (BusRental) {
      try {
        let tx = await BusRental.rentBus(ethers.utils.parseEther("1.0"), { value: ethers.utils.parseEther("1.0") });
        await tx.wait();
        getRentalStatus();
        setMessage("Bus rented successfully!");
      } catch (error) {
        setMessage("Unable to rent Bus: " + (error.message || error));
      }
    }
  };

  const returnBus = async () => {
    setMessage("");
    if (BusRental) {
      try {
        let tx = await BusRental.returnBus();
        await tx.wait();
        getRentalStatus();
        setMessage("Bus returned successfully!");
      } catch (error) {
        setMessage("Unable to return Bus: " + (error.message || error));
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this rental system.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask Wallet</button>
      );
    }

    if (rentalStatus === undefined) {
      getRentalStatus();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p className="rental-status">Rental Status: {rentalStatus ? "Rented" : "Not Rented"}</p>
        <div className="button-container">
          <button onClick={rentBus}>Rent Bus (1 ETH)</button>
          <button onClick={returnBus}>Return Bus</button>
        </div>
        {message && <p><strong>{message}</strong></p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Bus Rental System</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: white;
          background-size: cover;
          color: olive green;
          font-family: "Times New Roman", serif;
          border: 10px solid black;
          border-radius: 20px;
          background-image: url("https://i.pinimg.com/736x/71/ec/35/71ec350a525410078c6de0517b8690bf.jpg");
          height: 850px;
          width: 1500px;
          opacity: 0.9;
          font-weight: 1000;
          padding: 20px;
        }

        header {
          padding: 10px;
        }

        h1 {
          font-family: "Arial", serif;
          font-size: 60px;
          margin-bottom: 20px;
        }

        p {
          font-size: 40px;
        }

        .rental-status {
          font-size: 50px; /* Increase font size for rental status */
          font-weight: bold; /* Make the text bold */
          color: white; /* Set font color to white */
        }

        .button-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 20px 30px;
          font-size: 24px;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        button:hover {
          background-color: #388e3c;
        }

        .message {
          margin-top: 20px;
          padding: 10px 20px;
          border-radius: 5px;
          background-color: rgba(255, 255, 255, 0.9);
          color: #333;
          font-weight: bold;
          max-width: 400px;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
