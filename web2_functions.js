const web2Functions = {};

const callApi = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return response;
}

const errorsManager = async (response) => {
  if (!response.status) throw new Error("El response no tiene status.");
  const resjson = response.json();
  if (response.status.toString()[0] != "2") throw resjson;
  return resjson;
}

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
      console.log(allMetadata)
      setAllNftsMetadata(allMetadata);
    }
  } catch (error) {
    console.error("Error al obtener la metadata de los NFTs.", error.message)
  }
}

export default web2Functions;