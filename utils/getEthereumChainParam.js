import { defaultPolygonChainValue, defaultTelosChainValue } from "./defaultChainValues";

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

const ethereumChainParams = {
  polygonTest: [
    {
      chainId: "0x13881",
      chainName: "Polygon Test",
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
      chainId: "0x89",
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
      chainId: "0x29",
      chainName: "Telos Test",
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
      chainId: "0x28",
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

function getEthereumChainParam(chain) {
  if (chain === defaultPolygonChainValue && environment === "production") return ethereumChainParams.polygon;
  if (chain === defaultPolygonChainValue && environment === "staging") return ethereumChainParams.polygonTest;
  if (chain === defaultTelosChainValue && environment === "production") return ethereumChainParams.telos;
  if (chain === defaultTelosChainValue && environment === "staging") return ethereumChainParams.telosTest;
  throw new Error("Error in getEthereumChainParam function. Reason: ethereumChainParam Is Invalid");
}

export default getEthereumChainParam;