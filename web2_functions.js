import { callApi, errorsManager } from "./call_api_functions";

const web2Functions = {};

web2Functions.getNftMetadata = async (tokenId, collectionId) => {
  if (collectionId) {
    const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/get_nft_metadata`, {
      collectionId,
      nftId: tokenId
    });
    return await errorsManager(response);
  }
  return null;
}

web2Functions.getGameStudioCollections = async (studioAddress) => {
  const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/get_venly_collections_from_project`, { studioAddress });
  
  return await errorsManager(response);
}

// Function to get secundary and primary market all metadata.
web2Functions.loadAllMetadata = async (items, collections, setAllNftsMetadata) => {
  try {
    let allInfo = [];
    const data = items?.map((collection) => {
      const collectionAddr = Object.keys(collection)[0];
      const { tokensListedPrimaryMarket, tokensListedSecundaryMarket } = collection[collectionAddr];
      const info = tokensListedPrimaryMarket?.map((tokenId, index) => {
        return { tokenId, collectionId: collections.find((collection) => collection.collectionAddress === collectionAddr)?.collectionId };
      });
      const infoSec = tokensListedSecundaryMarket?.map((tokenId, index) => {
        return { tokenId, collectionId: collections.find((collection) => collection.collectionAddress === collectionAddr)?.collectionId };
      });
      allInfo.push(info);
      allInfo.push(infoSec);
    });
    allInfo = allInfo.flat();
    if (allInfo.length > 0) {
      const allMetadata = await Promise.all(allInfo.map(async (data) => {
        return await web2Functions.getNftMetadata(data.tokenId, data.collectionId);
      }));
      setAllNftsMetadata(allMetadata);
    }
  } catch (error) {
    console.error("Error al obtener la metadata de los NFTs.", error.message)
  }
}

web2Functions.getUserInventory = async (address, studioAddress) => {
  try {
    const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/user_inventory`, {
      studioAddress,
      user: address,
    });
    const resjson = await errorsManager(response);
    return resjson;
  } catch (error) {
    throw new Error("Error: getUserInventory Failed.")
  }
}

export default web2Functions;