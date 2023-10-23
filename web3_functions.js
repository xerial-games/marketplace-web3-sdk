const ethers = require("ethers");
import usdcAbi from "./web3_abis/usdc_abi";
import marketplaceABI from "./web3_abis/marketplace_abi";
import venlyABI from "./web3_abis/venly_abi";

const usdcAddress = process.env.NEXT_PUBLIC_MARKETPLACE_USDC_CONTRACT;
const marketplaceContractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
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

async function sellNft(tokenId, collectionAddress, price) {
  try {
    const { provider, signer } = await connectToMetaMask();
    if (!marketplaceContractAddress) throw new Error("Fallando.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);

    // Esto es la collection contract. Utiliza el ABI de Venly.
    const collectionContract = new ethers.Contract(collectionAddress, venlyABI, provider);
      let listingInput = [{
        erc1155: collectionAddress, // address de la collection contract
        tokenId, // Id del token dentro de la collection
        askPrice: ethers.utils.parseUnits(price, 6) // 1 USDC = 1000000
      }];

      // Chequea si esta activo el permiso al marketplace de tomar tus NFTs de X contrato. Retorna un booleano
      const res = await collectionContract.isApprovedForAll(await signer.getAddress(), marketplaceContractAddress) 
      if (res === true) {
        let tx = await marketplace.connect(signer).list(listingInput);
        await tx.wait();
      }
      else {
        // Solicitud para darle permisos al marketplace de tomar tus NFTs
        const res = await collectionContract.connect(signer).setApprovalForAll(marketplace.address, true);
        const resApproval = await res.wait();
        // console.log(resApproval);
        
        // Lista el NFT y lo toma de tu inventario.
        let tx = await marketplace.connect(signer).list(listingInput);
        await tx.wait();
      }
    } catch (error) {
      console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
      console.error(error.message);
    }
}

async function delistNft(tokenId, collectionAddress) {
  try {
    const { provider, signer } = await connectToMetaMask();
    if (!marketplaceContractAddress) throw new Error("Fallando.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
    let delistInput = [{
      erc1155: collectionAddress, // address del marketplace contract
      tokenId, // Id del token dentro del contrato por ahora van el 6 y el 4
    }];

    let tx = await marketplace.connect(signer).delist(delistInput);
    let fullRes = await tx.wait();
    // console.log(fullRes);
    alert("Token eliminado del market")
  } catch (error) {
    console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
    console.error(error.message);
  }
}

async function changeTokenPrices(tokenId, newPrice, collectionAddress) {
  try {
    const { provider, signer } = await connectToMetaMask();
    const marketplaceContractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
    if (!marketplaceContractAddress) throw new Error("Fallando.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);

    // Esto es la collection contract != Venly. Utilizando el ABI de Venly.
    const collection = new ethers.Contract(collectionAddress, venlyABI, provider);
      let listingInput = [{
        erc1155: collectionAddress, // address del marketplace contract
        tokenId, // Id del token dentro del contrato por ahora van el 6 y el 4
        newPrice: ethers.utils.parseUnits(newPrice, 6) // pasaje a 6 cifras
      }];

      // Permiso al marketplace de tomar tus NFTs de X contrato.
      const res = await collection.isApprovedForAll(await signer.getAddress(), marketplaceContractAddress) 
      if (res === true) {
        // const res = await collection.connect(signer).setApprovalForAll(marketplace.address, true);
        // console.log(res, "permisos del market para tomar tus NFTs")
        let tx = await marketplace.connect(signer).changeTokenPrices(listingInput);
        await tx.wait();
      } 
      else {
        const res = await collection.connect(signer).setApprovalForAll(marketplace.address, true);
        const resApproval = await res.wait();
        // console.log(resApproval);
        let tx = await marketplace.connect(signer).changeTokenPrices(listingInput);
        await tx.wait();
      }
    } catch (error) {
      console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
      console.error(error.message);
    }
}

async function listings (tokenId, contractAddress) {
  try {
    const { provider, signer } = await connectToMetaMask();
    const marketplaceContractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
    if (!marketplaceContractAddress) throw new Error("Fallando.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);

    const res = await marketplace.listings(contractAddress, tokenId);
    console.log(res)
    if (res.owner) return res;
    } catch (error) {
      console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
      console.error(error.message);
  }
}

const marketplaceFunctions = {
  sellNft,
  delistNft,
  changeTokenPrices,
  listings
}

export default marketplaceFunctions;