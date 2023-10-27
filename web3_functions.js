const ethers = require("ethers");
import usdcAbi from "./web3_abis/usdc_abi";
import marketplaceABI from "./web3_abis/marketplace_abi";
import venlyABI from "./web3_abis/venly_abi";

const usdcAddress = process.env.NEXT_PUBLIC_MARKETPLACE_USDC_CONTRACT;
const marketplaceContractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
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

async function sellNft(tokenId, collectionAddress, price) {
  try {
    const { provider, signer } = await connectToMetaMask();
    if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
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
      // console.error(error.reason)
    }
}

async function delistNft(tokenId, collectionAddress) {
  try {
    const { provider, signer } = await connectToMetaMask();
    if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
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
    if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);

    // Esto es el collection contract
    const collection = new ethers.Contract(collectionAddress, venlyABI, provider);
      let listingInput = [{
        erc1155: collectionAddress, // address del marketplace contract
        tokenId,
        newPrice: ethers.utils.parseUnits(newPrice, 6) // pasaje a 6 cifras
      }];

      // Permiso al marketplace de tomar tus NFTs de X contrato.
      const res = await collection.isApprovedForAll(await signer.getAddress(), marketplaceContractAddress) 
      if (res === true) {
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
    if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);

    const res = await marketplace.listings(contractAddress, tokenId);
    if (res.owner) return res;
    } catch (error) {
      console.log("%cMensaje de error en listing.", "color: red; font-size: 30px; font-weight: 500")
      console.error(error.message);
  }
}

async function getListedNfts (collectionAddresses) {
  try {
    const { provider, signer } = await connectToMetaMask();
    if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
    const nftsArray = await Promise.all(collectionAddresses.map(async (collectionAddress) => {
      const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
      const tokensListedSecundaryMarketWithBigNumbers = await marketplace.getListedTokens(collectionAddress);
      const tokensListedPrimaryMarketWithBigNumbers = await marketplace.getListedTokensOnPrimary(collectionAddress);

      const tokensListedPrimaryMarket = tokensListedPrimaryMarketWithBigNumbers.map((tokenId) => tokenId.toString());
      const tokensListedSecundaryMarket = tokensListedSecundaryMarketWithBigNumbers.map((tokenId) => tokenId.toString()).filter((item) => !tokensListedPrimaryMarket.includes(item));
      
      return { [collectionAddress]: { tokensListedPrimaryMarket, tokensListedSecundaryMarket } };
    }));
    return nftsArray;
  } catch (error) {
    throw new Error("Error al solicitar los NFTs listados.");
  }
}

async function getNftPrice(tokenId, collectionAddress) {
  const { provider, signer } = await connectToMetaMask();
  if (!marketplaceContractAddress) throw new Error("Marketplace contract address not found.");
  const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
  const price = await marketplace.listings(collectionAddress, tokenId);
  return Number(price.price.toString()) / Math.pow(10, 6); // Formatea el precio quitandole 6 decimales.
}

// marketCategory expected values: primary || secondary
async function purchaseNft(tokenId, collectionAddress, marketCategory) {
  try {
    if (!tokenId || !collectionAddress || !marketCategory) throw new Error("Faltan parámetros.");
    const { provider, signer } = await connectToMetaMask();
    const usdc = new ethers.Contract(usdcAddress, usdcAbi, provider);
    const marketplaceContractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
    if (!marketplaceContractAddress) throw new Error("Fallando.");
    const marketplace = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
    // Consulta de cuanto USDC puede tocar el market de mi billetera
    const tx = await usdc.allowance(await signer.getAddress(), marketplaceContractAddress);
    
    // Si el USDC habilitado para el market es menor a 0 se solicita aquí el permiso de gestionar un monto mayor.
    if (!(Number(tx.toString()) > 0)) { 
      const maxNumber = BigNumber.from(2).pow(256).sub(1);  
      const tx = await usdc.connect(signer).approve(marketplaceContractAddress, maxNumber); // Permisos USDC
      const resTx = await tx.wait();
    }
    
    // El purchase puede recibir una lista de NFTs a comprar.
    const itemsToPurchase = [
      {
        erc1155: collectionAddress,
        tokenId
      },
      // {
      //   erc1155: collectionAddress,
      //   tokenId: 4,
      // },
    ];
    let tx2;
    if (marketCategory === "secondary") tx2 = await marketplace.connect(signer).purchaseSecondary(itemsToPurchase)
    else if (marketCategory === "primary") tx2 = await marketplace.connect(signer).purchasePrimary(itemsToPurchase);
    const txRes = await tx2.wait();
  } catch (error) {
    if (error.reason) {
      throw new Error(error.reason);
    }
    throw new Error(error.message);
  }
}

const signMessageWithLoginAttemptIdWithMetamask = async function (loginAttemptId) {
  checkEthereumExistInUI();
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  const publicKey = accounts[0];
  const message = `Bienvenido a Xerial! Firma este mensaje para iniciar sesion. \n \n Login attempt ID: ${loginAttemptId}`;

  // Request signature
  const signature = await ethereum.request({
    method: "personal_sign",
    params: [message, publicKey],
  });
  const realAddress = ethers.utils.getAddress(publicKey);

  return { publicKey: realAddress, signature: signature }
}

const marketplaceFunctions = {
  sellNft,
  delistNft,
  changeTokenPrices,
  listings,
  getListedNfts,
  getNftPrice,
  purchaseNft,
  signMessageWithLoginAttemptIdWithMetamask
}

export default marketplaceFunctions;