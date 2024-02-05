import { ethers, BigNumber } from "ethers";
import usdcAbi from "@/web3_abis/usdc_abi";
import marketplaceABI from "@/web3_abis/marketplace_abi";
import collectionAbi from "@/web3_abis/collection_abi";
const usdcAddress = process.env.NEXT_PUBLIC_POLYGON_USDC_CONTRACT;
const marketplaceContractAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
const ethereum = globalThis.ethereum;
const checkEthereumExistInUI = function () {
  if (!globalThis.ethereum) throw Error("There is no ethereum in window / MetaMask is not installed");
};

async function connectToMetaMask() {
  // Check if MetaMask is installed
  if (typeof ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }

  // Request access to the user's MetaMask accounts
  await ethereum.request({ method: "eth_requestAccounts" });
  // Create a Web3Provider instance using MetaMask provider
  const provider = new ethers.providers.Web3Provider(ethereum);
  // Get the signer object
  const signer = provider.getSigner();
  return { provider, signer };
}

const web3Functions = {};

web3Functions.purchaseNfts = async function ({ tokenTypeId, amount, collectionAddress }) {
  try {
    const usdcAddress = process.env.NEXT_PUBLIC_POLYGON_USDC_CONTRACT;
    const marketplaceAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
    if (!marketplaceAddress) throw new Error("Marketplace Address Not Found");
    if (!usdcAddress) throw new Error("USDC Address Not Found");
    if (!tokenTypeId || !collectionAddress || !amount) throw new Error("All Parameters Are Required");
    const { provider, signer } = await connectToMetaMask();
    const usdc = new ethers.Contract(usdcAddress, usdcAbi, provider);
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    // Querying how much USDC the market can access from my wallet
    const tx = await usdc.allowance(await signer.getAddress(), marketplaceAddress);
    if (!(Number(tx.toString()) > 0)) {
      // USDC permission
      const maxNumber = BigNumber.from(2).pow(256).sub(1);
      const tx = await usdc.connect(signer).approve(marketplaceAddress, maxNumber);
      const resTx = await tx.wait();
    }

    const purchaseTransaction = await marketplace.connect(signer).primaryPurchase(collectionAddress, tokenTypeId, amount);
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    throw new Error(error.message);
  }
};

web3Functions.secondaryMarketPurchase = async function ({ marketplaceNftId }) {
  try {
    const marketplaceAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
    const { provider, signer } = await connectToMetaMask();
    const usdc = new ethers.Contract(usdcAddress, usdcAbi, provider);
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    // Querying how much USDC the market can access from my wallet
    const tx = await usdc.allowance(await signer.getAddress(), marketplaceAddress);
    if (!(Number(tx.toString()) > 0)) {
      // USDC permission
      const maxNumber = BigNumber.from(2).pow(256).sub(1);
      const tx = await usdc.connect(signer).approve(marketplaceAddress, maxNumber);
      const resTx = await tx.wait();
    }

    const purchaseTransaction = await marketplace.connect(signer).secondaryPurchase(marketplaceNftId);
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    console.error("Error to purchase NFT in Secondary Market. Reason: ", error.message);
    throw new Error(error.message);
  }
};

web3Functions.sellNftOnSecondaryMarket = async function ({ collectionAddress, tokenId, price }) {
  try {
    const marketplaceAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
    const { provider, signer } = await connectToMetaMask();
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);
    const collectionContract = new ethers.Contract(collectionAddress, collectionAbi, provider);
    const isApprovedForAllResponse = await collectionContract.isApprovedForAll(await signer.getAddress(), marketplaceAddress);
    if (!isApprovedForAllResponse) {
      const approvalForAllTransaction = await collectionContract.connect(signer).setApprovalForAll(marketplaceAddress, true);
      const approvalForAllTransactionWaited = await approvalForAllTransaction.wait();
    }
    const formattedPrice = ethers.utils.parseUnits(price, 6);
    const createMarketItemTransaction = await marketplace.connect(signer).createMarketItem(collectionAddress, tokenId, formattedPrice);
    const createMarketItemTransactionWaited = await createMarketItemTransaction.wait();
    console.log(createMarketItemTransactionWaited);
  } catch (error) {
    console.error("Error to publish your NFT in Secondary Market. Reason: ", error.message);
    throw new Error(error.message);
  }
};

web3Functions.delistNftOnSecondaryMarket = async function ({ marketplaceNftId }) {
  try {
    const marketplaceAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
    const { provider, signer } = await connectToMetaMask();
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    const cancelMarketItemTransaction = await marketplace.connect(signer).cancelMarketItem(marketplaceNftId);
    const cancelMarketItemTransactionWaited = await cancelMarketItemTransaction.wait();
    console.log(cancelMarketItemTransactionWaited);
  } catch (error) {
    console.error("Error to cancel NFT in Secondary Market. Reason: ", error.message);
    throw new Error(error.message);
  }
};

export default web3Functions;
