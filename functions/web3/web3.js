import { ethers, BigNumber } from "ethers";
import marketplaceABI from "@/web3-abis/marketplaceAbi";
import collectionAbi from "@/web3-abis/collectionAbi";
import { defaultPolygonChainValue, defaultTelosChainValue } from "@/utils/defaultChainValues";
import telosGasLimit from "@/utils/telosGasLimit";
import getEthereumChainParam from "@/utils/getEthereumChainParam";
import { Decimal } from "decimal.js";
const ethereum = globalThis.ethereum;

const checkEthereumExistInUI = function () {
  if (!globalThis.ethereum) throw Error("There is no ethereum in window / MetaMask is not installed");
};

// Obtain the Marketplace address
function getMarketplaceAddress(chain) {
  if (chain === defaultPolygonChainValue) return process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
  if (chain === defaultTelosChainValue) return process.env.NEXT_PUBLIC_TELOS_MARKETPLACE_CONTRACT;
  throw new Error("Chain Isn't Valid")
}

// Check connection in Telos Network
async function checkTelosNetwork () {
  const ethereum = window.ethereum;
  if (!ethereum) throw new Error("Metamask Isn't Installed");
  try {

  await ethereum.enable();

  const chainId = await ethereum.request({
    method: "eth_chainId",
  });

  const chainIdHex = process.env.NEXT_PUBLIC_TELOS_CHAIN_ID_HEX;
  
  if (chainId === chainIdHex) {
    console.log(
      "User is on the Telos Network"
    );
  } else {
    console.log("User is not on the Telos Network");

    await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
    });
  }
  } catch (error) {
    console.error("Error verifying the Telos Network. Reason: " + error.message);
    if (error.code === 4902) {
      // Error 4902 indicates that the user attempted to switch to an Ethereum network
      // that is not configured in MetaMask.
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: getEthereumChainParam(defaultTelosChainValue),
        });
        console.log("The user has been asked to add the Telos Network");
      } catch (error) {
        console.error("Error to add Telos Network. Reason: " + error);
      }
    }
  }
} 

// Check connection in Polygon Network
async function checkPolygonNetwork() {
  const ethereum = window.ethereum;
  if (!ethereum) throw new Error("Metamask Isn't Installed");
  try {
    const chainIdHex = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID_HEX;

    await ethereum.enable();

    const chainId = await ethereum.request({
      method: "eth_chainId",
    });


    if (chainId === chainIdHex) {
      console.log("User is on the Polygon Network");
    } else {
      console.log("User is not on the Polygon Network");

      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    }
  } catch (error) {
    console.error("Error verifying the Telos Network. Reason: " + error.message);
    if (error.code === 4902) {
      // Error 4902 indicates that the user attempted to switch to an Ethereum network
      // that is not configured in MetaMask.
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: getEthereumChainParam(defaultPolygonChainValue),
        });
        console.log("The user has been asked to add the Polygon Network");
      } catch (error) {
        console.error("Error to add Polygon Network. Reason: " + error);
      }
    }
  }
}

// Making the MetaMask connection
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

// Allow to buy multiple types of NFTs
web3Functions.purchaseNfts = async function (nfts, chain) {
  try {
    let nftsParsed = [];
    for (const nft of nfts) {
      const { tokenTypeId, quantity, collectionAddress, price } = nft;
      if (!tokenTypeId || !quantity || !collectionAddress || !price) {
        throw new Error("Each object in the array must have the properties tokenTypeId, quantity, collectionAddress and price");
      }
      const bigNumberQuantity = BigNumber.from(quantity);
      const bigNumberTokenTypeId = BigNumber.from(tokenTypeId);
      nftsParsed.push({ tokenTypeId: bigNumberTokenTypeId, quantity: bigNumberQuantity, collectionAddress });
    }

    if (chain === defaultPolygonChainValue) {
      await checkPolygonNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();

    let fullPrice = new Decimal(0);
    nfts.forEach((nft) => {
      const priceDecimal = new Decimal(nft.price);
      const quantityDecimal = new Decimal(nft.quantity);
      const result = priceDecimal.mul(quantityDecimal);
      fullPrice = fullPrice.add(result);
    });
    const parsedPrice = ethers.utils.parseEther(String(fullPrice));

    const marketplaceAddress = getMarketplaceAddress(chain);
    if (!marketplaceAddress) throw new Error("Marketplace Address Not Found");
    const { provider, signer } = await connectToMetaMask();
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    const purchaseTransaction = await marketplace.connect(signer).primaryPurchase(nftsParsed, { value: parsedPrice });
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Allow to buy a single type of NFTs
web3Functions.purchaseNft = async function ({ tokenTypeId, quantity, collectionAddress, chain, price }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkPolygonNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();
    else throw new Error("Invalid Chain");
    
    const bigNumberQuantity = BigNumber.from(quantity);
    const bigNumberTokenTypeId = BigNumber.from(tokenTypeId);
    const priceDecimal = new Decimal(price);
    const quantityDecimal = new Decimal(quantity);
    const result = priceDecimal.mul(quantityDecimal);
    const parsedPrice = ethers.utils.parseEther(String(result));
    const marketplaceAddress = getMarketplaceAddress(chain);
    if (!marketplaceAddress) throw new Error("Marketplace Address Not Found");
    if (!tokenTypeId || !collectionAddress || !quantity || !price) throw new Error("All Parameters Are Required");
    const { provider, signer } = await connectToMetaMask();
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    const purchaseTransaction = await marketplace.connect(signer).primaryPurchase([{ tokenTypeId: bigNumberTokenTypeId, quantity: bigNumberQuantity, collectionAddress }], { value: parsedPrice });
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Allow  the player to buy NFTs on the Secondary Market
web3Functions.secondaryMarketPurchase = async function ({ marketplaceNftId, chain, price }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkPolygonNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();
    const marketplaceAddress = getMarketplaceAddress(chain);
    const { provider, signer } = await connectToMetaMask();
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);
    let purchaseTransaction;
    if (chain === defaultPolygonChainValue) purchaseTransaction = await marketplace.connect(signer).secondaryPurchase(marketplaceNftId, { value: ethers.utils.parseEther(String(price)) });
    else purchaseTransaction = await marketplace.connect(signer).secondaryPurchase(marketplaceNftId, { gasLimit: telosGasLimit, value: ethers.utils.parseEther(String(price)) });
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    console.error("Error to purchase NFT in Secondary Market. Reason: " +  error.message);
    throw new Error(error.message);
  }
};

// Allows the player to list NFT on the Secondary Market
web3Functions.sellNftOnSecondaryMarket = async function ({ collectionAddress, tokenId, price, chain }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkPolygonNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();
    const marketplaceAddress = getMarketplaceAddress(chain);
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
    console.error("Error to publish your NFT in Secondary Market. Reason: " +  error.message);
    throw new Error(error.message);
  }
};

// Allows the player to delist NFT on the Secondary Market
web3Functions.delistNftOnSecondaryMarket = async function ({ marketplaceNftId, chain }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkPolygonNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();
    const marketplaceAddress = getMarketplaceAddress(chain);
    const { provider, signer } = await connectToMetaMask();
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);

    let cancelMarketItemTransaction;
    if (chain === defaultTelosChainValue) cancelMarketItemTransaction = await marketplace.connect(signer).cancelMarketItem(marketplaceNftId, { gasLimit: telosGasLimit });
    else cancelMarketItemTransaction = await marketplace.connect(signer).cancelMarketItem(marketplaceNftId);
    const cancelMarketItemTransactionWaited = await cancelMarketItemTransaction.wait();
    console.log(cancelMarketItemTransactionWaited);
  } catch (error) {
    console.error("Error to cancel NFT in Secondary Market. Reason: " +  error.message);
    throw new Error(error.message);
  }
};

export default web3Functions;
