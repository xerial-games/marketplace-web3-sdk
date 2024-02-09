import { callWalletApi } from "@/functions/callApi";
import { ethers } from "ethers";

const checkEthereumExistInUI = function () {
  if (!globalThis.ethereum) throw Error("There is no ethereum in window / MetaMask is not installed");
};

const connectToMetaMask = async function () {
  checkEthereumExistInUI();
  // Request access to the user's MetaMask accounts
  await globalThis.ethereum.request({ method: "eth_requestAccounts" });
  // Create a Web3Provider instance using MetaMask provider
  const provider = new ethers.providers.Web3Provider(globalThis.ethereum);
  // Get the signer object
  const signer = provider.getSigner();
  return { provider, signer };
};

const getApiCodeAndSignCodeWithMetamask = async function () {
  try {
    checkEthereumExistInUI();
    const ethereum = globalThis.ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const publicKey = accounts[0];
    const realAddress = ethers.utils.getAddress(publicKey);
    const res = await callWalletApi(
      `${process.env.NEXT_PUBLIC_WALLET_API_HOST}/nonce`,
      { address: realAddress },
      {
        method: "POST",
      }
    );
    const resjson = await res.json();
    if (!resjson.nonce) throw new Error("Nonce Not Found");

    // Request signature
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [resjson.nonce, publicKey],
    });

    return { publicKey: realAddress, signature: signature };
  } catch (error) {
    throw new Error("Error to sign or get API code");
  }
};

export { getApiCodeAndSignCodeWithMetamask, connectToMetaMask, checkEthereumExistInUI };
