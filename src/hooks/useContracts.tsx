import React,{ createContext, useContext, useEffect, useState } from 'react';
// @ts-ignore
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Authereum from 'authereum';
import { ethers } from 'ethers';
// @ts-ignore
import Fortmatic from 'fortmatic';
import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';
import oldMadladABI from '../constants/abi/OldMadCredits.json';
import newMadladABI from '../constants/abi/NewMadCredits.json';

export const MOST_EXPENSIVE_PACK = 4;
const ITEMS_PER_COLLECTION_PAGE = 12;
const ITEMS_PER_CATALOG_PAGE = 12;

const etherProvider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_TESTNET !== 'false'
    ? process.env.REACT_APP_RPC_TEST
    : process.env.REACT_APP_RPC_MAIN,
);

const DESIRED_CHAIN_ID =
  process.env.REACT_APP_TESTNET !== 'false'
    ? process.env.REACT_APP_CHAIN_ID_T
    : process.env.REACT_APP_CHAIN_ID_M;

const SAMURAI_ADR =
  process.env.REACT_APP_TESTNET !== 'false'
    ? process.env.REACT_APP_SAMURAI_T
    : process.env.REACT_APP_SAMURAI_M;

const SAMURAI_ADR_OLD =
  process.env.REACT_APP_TESTNET !== 'false'
    ? process.env.REACT_APP_SAMURAI_T_OLD
    : process.env.REACT_APP_SAMURAI_M_OLD;

var samurai = new ethers.Contract(
  SAMURAI_ADR || '',
  newMadladABI,
  etherProvider,
);

var samurai_old = new ethers.Contract(
  SAMURAI_ADR_OLD || '',
  oldMadladABI,
  etherProvider,
);
let numCatalogPages = 0;
let currentIndexUsedForCatalog: number = 0;

let numCollPages = 0;

const infuraID = 'aba29a61188746ca957d888619627e5c';

const walletLink = new WalletLink({
  appName: 'coinbase',
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(
  `https://mainnet.infura.io/v3/${infuraID}`,
  1,
);

const getProviderOptions = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: 'https://polygon.bridge.walletconnect.org',
        infuraId: infuraID,
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: 'pk_live_5A7C91B2FC585A17', // required
      },
    },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
        description: 'Connect to Coinbase Wallet (not Coinbase App)',
      },
      package: walletLinkProvider,
      connector: async (provider: any, options: any) => {
        await provider.enable();
        return provider;
      },
    },
  };
  return providerOptions;
};
// @ts-ignore
const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions: getProviderOptions(),
});

export const ContractDataContext = createContext<any>({
});

export const useContracts = () => useContext(ContractDataContext);
/**
 * A hook that initializes contracts
 *
 * @returns The initialized contracts + useful data
 */
export const ContractDataProvider = ({ children }: any) => {

  const [user, setUser] = useState('');
  const [affiliateBalance, setAffiliateBalance] = useState(0);
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();
  const [inFetchBalance, setInFetchBalance] = useState(false);
  const [packs] = useState<Pack[]>([]);
  const [collection, setCollection] = useState<number[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [approving] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [successfullyPurchased, setSuccessfullyPurchased] = useState(0);
  const [catalog, setCatalog] = useState<number[]>([]);
  const [idsToOwners, setIdsToOwners] = useState<NumbersToStrings>({});
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const tryFetchingWeb3Provider = async () => {
    const provider = new ethers.providers.Web3Provider(
      await web3Modal.connect(),
      'any',
    );
    return provider;
  };

  // need BNB balance instead
  const fetchBalance = async () => {
    if (inFetchBalance) return;
    setInFetchBalance(true);
    if (user && user.length === 42) {
      setConnecting(false);
    }
    setInFetchBalance(false);
  };

  // call totalSupply() to get the current number of NFT's for madlad contract
  const fetchCatalog = async (page = 1, pageSize = ITEMS_PER_CATALOG_PAGE) => {
    let currentIndex;
    // console.log('fetching');

    if (!currentIndexUsedForCatalog) {
      currentIndex = await samurai.totalSupply().catch(() => {}); // dealing with burnt tokens properly could be difficult

      currentIndexUsedForCatalog = currentIndex;
    } else {
      currentIndex = currentIndexUsedForCatalog;
    }

    const arr = [];
    for (let i = 1; i <= pageSize; i += 1) {
      const el = currentIndex - (i + (page - 1) * pageSize);
      if (el >= 0) arr.push(el);
    }

    const queries = arr.map((e) => samurai.ownerOf(e).catch(() => {}));
    const owners = await Promise.all(queries);

    let idsToOwnrs: NumbersToStrings = {};
    for (let i = 0; i < arr.length; i += 1) {
      const id = arr[i];
      const owner = owners[i];

      idsToOwnrs = { ...idsToOwnrs, [id]: owner };
    }

    setCatalog(arr);
    setIdsToOwners({ ...idsToOwners, ...idsToOwnrs });

    numCatalogPages = Math.ceil(
      parseFloat(currentIndex.toString()) / ITEMS_PER_CATALOG_PAGE,
    );
  };

  useEffect(() => {
    setTimeout(() => fetchBalance(), 100);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => fetchBalance(), 1000);
    }, 10000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const connectWallet = async () => {
    web3Modal.clearCachedProvider();
    const provider = await tryFetchingWeb3Provider();
    
    

    // Prompt user for account connections
    if (provider && !signer) {
      setConnecting(true);
      const s = provider.getSigner();
      const chainId = await s.getChainId();
      console.log(chainId);

      if (chainId.toString() !== (DESIRED_CHAIN_ID || '56')) {
        setIsWrongNetwork(true);
        setConnecting(false);
        setConnected(false);
        return;
      }

      samurai = new ethers.Contract(
        SAMURAI_ADR || '',
        newMadladABI,
        s,
      );
      
      samurai_old = new ethers.Contract(
        SAMURAI_ADR_OLD || '',
        oldMadladABI,
        s,
      );

      setSigner(s);

      const u = await s.getAddress().catch(() => {});
      setUser(u || '');
      setConnected(true);
      // affiliate available balance
      // TODO: refactor with ethers
      setAffiliateBalance(
        0
      );
      setWeb3Provider(provider);
    }
  };

  const disconnect = () => {
    setSigner(undefined);
    setConnected(false);
    setUser('');
    };

  const purchasePack = async (type: number) => {
    setSuccessfullyPurchased(0);
    if (signer && packs[type]) {
      setPurchasing(true);
      const samSigner = samurai.connect(signer);
      await samSigner
        .purchasePack(type)
        .then((res: ethers.ContractTransaction) => {
          res.wait(1).then(() => {
            setPurchasing(false);
            setSuccessfullyPurchased(packs[type].numCards);
          });
        })
        .catch(() => {
          setPurchasing(false);
          setSuccessfullyPurchased(0);
        });
    } else {
    }
  };

  return (
    <ContractDataContext.Provider
      value={{
        samurai,
        samurai_old,
        SAMURAI_ADR,
        connectWallet,
        disconnect,
        tryFetchingWeb3Provider,

        web3Provider,
        signer,
        user,
        affiliateBalance,
        connected,

        packs,

        purchasePack,

        connecting,
        approving,
        purchasing,

        collection,
        catalog,
        fetchCatalog,
        successfullyPurchased,

        numCatalogPages,
        numCollPages,

        isWrongNetwork,
      }}
    >
      {children}
    </ContractDataContext.Provider>
  );
};

interface Pack {
  cost: number;
  numCards: number;
  onSale: boolean;
}

interface NumbersToStrings {
  [id: number]: string;
}
