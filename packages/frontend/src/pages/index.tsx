import type { NextPage } from 'next';
import { FormEvent, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import contract from '@wave-portal/backend/artifacts/contracts/WavePortal.sol/WavePortal.json';
import { formatAddress } from '../helpers/formatAddress';

declare var window: Window & typeof globalThis & {
  ethereum: any;
}

interface IWave {
  id: BigNumber;
  date: BigNumber;
  message: string;
  owner: string;
}

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState([]);
  const [waves, setWaves] = useState<IWave[]>([]);
  const [message, setMessage] = useState("")

  const CONTRACT_ADDRESS = String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleConnectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please, Install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        let blockchainWaves = await wavePortalContract.getWaves();
        console.log(blockchainWaves);
        setWaves(blockchainWaves);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

        wavePortalContract.getWaves()
          .then((blockchainWaves: any) => {
            setWaves(blockchainWaves);
          })
          .catch((err: unknown) => console.log(err));

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [CONTRACT_ADDRESS]);

  return (
    <div>
      <header className="mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="#">
                <span className="sr-only">👋 WAVE PORTAL</span>
                <p className='text-4xl'>
                  👋<span className="hidden md:inline-block" >WAVE PORTAL</span>
                </p>
              </a>
            </div>
            <div className="md:flex items-center justify-end md:flex-1 lg:w-0">
            {!currentAccount.length && (
              <button
                onClick={handleConnectWallet}
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Connect to metamask
              </button>
            )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex items-center w-full flex-col gap-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          👋 Hey there!
        </h1>

        <h2 className="text-base font-medium tracking-tight text-gray-900">
          Wave at me at Ethereum blockchain! Connect your wallet,
          write your message, and then wave
        </h2>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex mt-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              placeholder="Message"
              onChange={e => setMessage(e.target.value)}
            />
            <button
              className="flex-no-shrink w-60 p-2 rounded text-white border-teal bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              type="submit"
              disabled={message.length === 0}
            >
              Send message
            </button>
          </div>
        </form>

        {waves.map(wave => (
          <ul key={wave.id.toString()} className="flex justify-center align-middle">
            <li className="list-disc text-indigo-600">
              <div className="flex flex-col text-black">
                <p>{wave.message}</p>
                <span className="text-gray-700">{formatAddress(wave.owner)}</span>
              </div>
            </li>
          </ul>
        ))}
      </main>
    </div>
  )
}

export default Home
