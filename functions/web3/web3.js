import { ethers, BigNumber } from "ethers";
import usdcAbi from "@/web3-abis/usdcAbi";
import marketplaceABI from "@/web3-abis/marketplaceAbi";
import collectionAbi from "@/web3-abis/collectionAbi";
import { defaultPolygonChainValue, defaultTelosChainValue } from "@/utils/defaultChainValues";
import telosGasLimit from "@/utils/telosGasLimit";
import getAddEthereumChainParam from "@/utils/addEthereumChainParams";
const usdcAddress = process.env.NEXT_PUBLIC_POLYGON_USDC_CONTRACT;
const ethereum = globalThis.ethereum;
const checkEthereumExistInUI = function () {
  if (!globalThis.ethereum) throw Error("There is no ethereum in window / MetaMask is not installed");
};

function getUsdcAddress (chain) {
  if (chain === defaultPolygonChainValue) return process.env.NEXT_PUBLIC_POLYGON_USDC_CONTRACT;
  if (chain === defaultTelosChainValue) return process.env.NEXT_PUBLIC_TELOS_USDC_CONTRACT;
  throw new Error("Chain Isn't Valid")
}

function getMarketplaceAddress(chain) {
  if (chain === defaultPolygonChainValue) return process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
  if (chain === defaultTelosChainValue) return process.env.NEXT_PUBLIC_TELOS_MARKETPLACE_CONTRACT;
  throw new Error("Chain Isn't Valid")
}

function formatBigNumberToString(bigNumberToFormat) {
  return BigNumber.from(bigNumberToFormat).toString()
}

function formatToBigNumber(contentToFormat) {
  return BigNumber.from(contentToFormat);
}

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
    const chainIdHex = process.env.NEXT_PUBLIC_TELOS_CHAIN_ID_HEX;
    console.error("Error verifying the Telos Network. Reason: ", error.message);
    if (error.code === 4902) {
      // Error 4902 indicates that the user attempted to switch to an Ethereum network
      // that is not configured in MetaMask.
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: getAddEthereumChainParam(defaultTelosChainValue, chainIdHex),
        });
        console.log("The user has been asked to add the Telos Network");
      } catch (error) {
        console.error("Error to add Telos tesnet network. Reason: ", error);
      }
    }
  }
} 

async function checkMumbaiNetwork() {
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
    const chainIdHex = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID_HEX;
    console.error("Error verifying the Telos Network. Reason: ", error.message);
    if (error.code === 4902) {
      // Error 4902 indicates that the user attempted to switch to an Ethereum network
      // that is not configured in MetaMask.
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: getAddEthereumChainParam(defaultPolygonChainValue, chainIdHex),
        });
        console.log("The user has been asked to add the Mumbai network");
      } catch (error) {
        console.error("Error to add Mumbai network. Reason: ", error);
      }
    }
  }
}

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
    for (const nft of nfts) {
      const { tokenTypeId, quantity, collectionAddress } = nft;
      if (!tokenTypeId || !quantity || !collectionAddress) {
        throw new Error("Each object in the array must have the properties tokenTypeId, quantity and collectionAddress");
      }
    }

    if (chain === defaultPolygonChainValue) {
      await checkMumbaiNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();

    const usdcAddress = getUsdcAddress(chain);
    const marketplaceAddress = getMarketplaceAddress(chain);
    if (!marketplaceAddress) throw new Error("Marketplace Address Not Found");
    if (!usdcAddress) throw new Error("USDC Address Not Found");
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

    const purchaseTransaction = await marketplace.connect(signer).primaryPurchase(nfts);
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Allow to buy a single type of NFTs
web3Functions.purchaseNft = async function ({ tokenTypeId, quantity, collectionAddress, chain }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkMumbaiNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();
    else throw new Error("Invalid Chain");
    const usdcAddress = getUsdcAddress(chain);
    const marketplaceAddress = getMarketplaceAddress(chain);
    if (!marketplaceAddress) throw new Error("Marketplace Address Not Found");
    if (!usdcAddress) throw new Error("USDC address is invalid");
    if (!tokenTypeId || !collectionAddress || !quantity) throw new Error("All Parameters Are Required");
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

    const purchaseTransaction = await marketplace.connect(signer).primaryPurchase([{ tokenTypeId, quantity, collectionAddress }]);
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    throw new Error(error.message);
  }
};

web3Functions.secondaryMarketPurchase = async function ({ marketplaceNftId, chain }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkMumbaiNetwork();
    } else if (chain === defaultTelosChainValue)
      await checkTelosNetwork();
    const marketplaceAddress = getMarketplaceAddress(chain);
    const usdcAddress = getUsdcAddress(chain);
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
    let purchaseTransaction;
    if (chain === defaultPolygonChainValue) purchaseTransaction = await marketplace.connect(signer).secondaryPurchase(marketplaceNftId);
    else purchaseTransaction = await marketplace.connect(signer).secondaryPurchase(marketplaceNftId, { gasLimit: telosGasLimit });
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    console.error("Error to purchase NFT in Secondary Market. Reason: " +  error.message);
    throw new Error(error.message);
  }
};

web3Functions.sellNftOnSecondaryMarket = async function ({ collectionAddress, tokenId, price, chain }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkMumbaiNetwork();
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

web3Functions.delistNftOnSecondaryMarket = async function ({ marketplaceNftId, chain }) {
  try {
    if (chain === defaultPolygonChainValue) {
      await checkMumbaiNetwork();
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
