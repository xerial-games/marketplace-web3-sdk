import { defaultPolygonChainValue, defaultTelosChainValue } from "./defaultChainValues";

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

const addEthereumChainParams = {
  polygonTest: [
    {
      chainId: null,
      chainName: "Mumbai Testnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
  ],
  polygon: [
    {
      chainId: null,
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
  ],
  telosTest: [
    {
      chainId: null,
      chainName: "Telos testnet",
      nativeCurrency: {
        name: "TLOS",
        symbol: "TLOS",
        decimals: 18,
      },
      rpcUrls: ["https://testnet.telos.net/evm"],
      blockExplorerUrls: ["https://testnet.teloscan.io/"],
    },
  ],
  telos: [
    {
      chainId: null,
      chainName: "Telos Mainnet",
      nativeCurrency: {
        name: "TLOS",
        symbol: "TLOS",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.telos.net/evm"],
      blockExplorerUrls: ["https://www.teloscan.io/"],
    },
  ],
};

function getAddEthereumChainParam(chain, chainIdHex) {
  let addEthereumChainParam;
  if (chain === defaultPolygonChainValue && environment === "production") addEthereumChainParam = addEthereumChainParams.polygon;
  if (chain === defaultPolygonChainValue && environment === "staging") addEthereumChainParam = addEthereumChainParams.polygonTest;
  if (chain === defaultTelosChainValue && environment === "production") addEthereumChainParam = addEthereumChainParams.telos;
  if (chain === defaultTelosChainValue && environment === "staging") addEthereumChainParam = addEthereumChainParams.telosTest;
  if (!addEthereumChainParam) throw new Error("addEthereumChainParam Is Invalid");
  addEthereumChainParam[0].chainId = chainIdHex;
  return addEthereumChainParam;
}

export default getAddEthereumChainParam;
