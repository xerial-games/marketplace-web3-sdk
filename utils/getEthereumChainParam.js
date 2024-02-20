import { defaultPolygonChainValue, defaultTelosChainValue } from "./defaultChainValues";

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

const ethereumChainParams = {
  polygonTest: [
    {
      chainId: null,
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

function getEthereumChainParam(chain, chainIdHex) {
  let ethereumChainParam;
  if (chain === defaultPolygonChainValue && environment === "production") ethereumChainParam = ethereumChainParams.polygon;
  if (chain === defaultPolygonChainValue && environment === "staging") ethereumChainParam = ethereumChainParams.polygonTest;
  if (chain === defaultTelosChainValue && environment === "production") ethereumChainParam = ethereumChainParams.telos;
  if (chain === defaultTelosChainValue && environment === "staging") ethereumChainParam = ethereumChainParams.telosTest;
  if (!ethereumChainParam) throw new Error("ethereumChainParam Is Invalid");
  ethereumChainParam[0].chainId = chainIdHex;
  return ethereumChainParam;
}

export default getEthereumChainParam;
