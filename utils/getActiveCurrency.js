import { defaultPolygonChainValue, defaultTelosChainValue } from "@/utils/defaultChainValues";

function getActiveCurrency(activeChain) {
  if (activeChain === defaultPolygonChainValue) return "MATIC";
  if (activeChain === defaultTelosChainValue) return "TLOS";
  else return "Error";
}

export default getActiveCurrency;
