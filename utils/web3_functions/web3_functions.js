import { ethers, BigNumber } from "ethers";
import usdcAbi from "@/web3_abis/usdc_abi";
import marketplaceABI from "@/web3_abis/marketplace_abi";
import collectionAbi from "@/web3_abis/collection_abi";
const usdcAddress = process.env.NEXT_PUBLIC_POLYGON_USDC_CONTRACT;
const marketplaceContractAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
const ethereum = globalThis.ethereum;
const checkEthereumExistInUI = function () {
  if (!globalThis.ethereum) throw Error("There is no ethereum in window / MetaMask is not installed");
}

async function connectToMetaMask() {
  // Check if MetaMask is installed
  if (typeof ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  // Request access to the user's MetaMask accounts
  await ethereum.request({ method: 'eth_requestAccounts' });
  // Create a Web3Provider instance using MetaMask provider
  const provider = new ethers.providers.Web3Provider(ethereum);
  // Get the signer object
  const signer = provider.getSigner();
  return { provider, signer };
}

const web3Functions = {};

// web3Functions.changeTokenPrices = async (tokenId, newPrice, collectionAddress) => {
//   try {
//     const { provider, signer } = await connectToMetaMask();
//     const marketplaceContractAddress = process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT;
//     if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
//     const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);

//     // Esto es el collection contract
//     const collection = new ethers.Contract(collectionAddress, venlyABI, provider);
//       let listingInput = [{
//         erc1155: collectionAddress, // address del marketplace contract
//         tokenId,
//         newPrice: ethers.utils.parseUnits(newPrice, 6) // pasaje a 6 cifras
//       }];

//       // Permiso al marketplace de tomar tus NFTs de X contrato.
//       const res = await collection.isApprovedForAll(await signer.getAddress(), marketplaceContractAddress) 
//       if (res === true) {
//         let tx = await marketplace.connect(signer).changeTokenPrices(listingInput);
//         await tx.wait();
//       } 
//       else {
//         const res = await collection.connect(signer).setApprovalForAll(marketplace.address, true);
//         const resApproval = await res.wait();
//         // console.log(resApproval);
//         let tx = await marketplace.connect(signer).changeTokenPrices(listingInput);
//         await tx.wait();
//       }
//     } catch (error) {
//       console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
//       console.error(error.message);
//     }
// }

// web3Functions.delistNft = async (tokenId, collectionAddress) => {
//   try {
//     const { provider, signer } = await connectToMetaMask();
//     if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
//     const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
//     let delistInput = [{
//       erc1155: collectionAddress, // address del marketplace contract
//       tokenId, // Id del token dentro del contrato por ahora van el 6 y el 4
//     }];

//     let tx = await marketplace.connect(signer).delist(delistInput);
//     let fullRes = await tx.wait();
//     // console.log(fullRes);
//     alert("Token removed from the market.")
//   } catch (error) {
//     console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
//     console.error(error.message);
//   }
// }

web3Functions.purchaseNfts = async function ({ tokenTypeId, amount, collectionAddress }) {
  try {
    if (!tokenTypeId || !collectionAddress || !amount) throw new Error("All params are required.");
    const { provider, signer } = await connectToMetaMask();
    const usdc = new ethers.Contract(usdcAddress, usdcAbi, provider);
    const collection = new ethers.Contract(collectionAddress, collectionAbi, provider);

    // Querying how much USDC the market can access from my wallet
    const tx = await usdc.allowance(await signer.getAddress(), collectionAddress);
    if (!(Number(tx.toString()) > 0)) {
      // USDC permission
      const maxNumber = BigNumber.from(2).pow(256).sub(1);  
      const tx = await usdc.connect(signer).approve(collectionAddress, maxNumber);
      const resTx = await tx.wait();
    }

    const purchaseTransaction = await collection.connect(signer).primaryPurchase(amount, tokenTypeId);
    const purchaseTransactionWaited = await purchaseTransaction.wait();
    console.log(purchaseTransactionWaited);
  } catch (error) {
    throw new Error(error.message);
  }
}

// web3Functions.sellNft = async (tokenId, collectionAddress, price) => {
//   try {
//     const { provider, signer } = await connectToMetaMask();
//     if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
//     const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
//     // Esto es la collection contract. Utiliza el ABI de Venly.
//     const collectionContract = new ethers.Contract(collectionAddress, venlyABI, provider);
//       let listingInput = [{
//         erc1155: collectionAddress, // address de la collection contract
//         tokenId, // Id del token dentro de la collection
//         askPrice: ethers.utils.parseUnits(price, 6) // 1 USDC = 1000000
//       }];

      

//       // Chequea si esta activo el permiso al marketplace de tomar tus NFTs de X contrato. Retorna un booleano
//       const res = await collectionContract.isApprovedForAll(await signer.getAddress(), marketplaceContractAddress) 
//       if (res === true) {
//         let tx = await marketplace.connect(signer).list(listingInput);
//         await tx.wait();
//       }
//       else {
//         // Solicitud para darle permisos al marketplace de tomar tus NFTs
//         const res = await collectionContract.connect(signer).setApprovalForAll(marketplace.address, true);
//         const resApproval = await res.wait();
//         // console.log(resApproval);

//         // Lista el NFT y lo toma de tu inventario.
//         let tx = await marketplace.connect(signer).list(listingInput);
//         await tx.wait();
//       }
//     } catch (error) {
//       console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
//       console.error(error.message);
//       // console.error(error.reason)
//     }
// }

// revisar.
// web3Functions.signMessageWithLoginAttemptIdWithMetamask = async function (loginAttemptId) {
//   checkEthereumExistInUI();
//   const accounts = await ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const publicKey = accounts[0];
//   const message = `Bienvenido a Xerial! Firma este mensaje para iniciar sesion. \n \n Login attempt ID: ${loginAttemptId}`;

//   // Request signature
//   const signature = await ethereum.request({
//     method: "personal_sign",
//     params: [message, publicKey],
//   });
//   const realAddress = ethers.utils.getAddress(publicKey);

//   return { publicKey: realAddress, signature: signature }
// }

export default web3Functions;