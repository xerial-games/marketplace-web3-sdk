import InventoryItem from "@/atoms/InventoryItem/InventoryItem";
import connectMetamaskWallet from "@/login_functions";
import web2Functions from "@/web2_functions";
import marketplaceFunctions from "@/web3_functions";
import { useEffect, useState } from "react";

const envStudioAddress = process.env.NEXT_PUBLIC_STUDIO_ADDRESS;
const Inventory = () => {
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [items, setItems] = useState(null);
  const [allMetadata, setAllMetadata] = useState([]);
  // studioAddress is Game Studio Address
  const [studioAddress, setStudioAddress] = useState(envStudioAddress);
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    loadCollections();
  }, [])
  useEffect(() => {
    if (studioAddress && publicKey) {
      loadInventory();
    }
  }, [studioAddress, publicKey]);

  useEffect(() => {
    if (items && collections) {
      loadAllMetadata();
    }
  }, [items, collections]);

  async function connectWallet() {
    try {
      const { publicKey, signature, sessionToken } = await connectMetamaskWallet("6532a2164bf23c6c7551a56c");
      setPublicKey(publicKey);
      setSignature(signature);
      setSessionToken(sessionToken);
    } catch (error) {
      console.error("Error: Login Failed.");
    }
  }

  async function loadCollections() {
    const collectionsFromGameStudio = await web2Functions.getGameStudioCollections(process.env.NEXT_PUBLIC_STUDIO_ADDRESS);
    setCollections(collectionsFromGameStudio.collections);
  }

  async function loadInventory () {
    try {
      const inventory = await web2Functions.getUserInventory(publicKey, studioAddress);
      setItems(inventory);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function loadAllMetadata() {
    const infoToGetMetadata = Object.keys(items)?.map((objectKey) => {
      return Object.entries(items[objectKey]).map((entries, index) => {
        // Index 0 = tokenId
        // Index 1 = 0 || 1. Lo tengo o no lo tengo...
        if (entries[1] === 1) {
          const collectionId = collections.find((collection) => collection.collectionAddress === objectKey)?.collectionId;
          if (!collectionId) throw new Error(`collectionId of ${objectKey} not Found.`)
          return { tokenId: entries[0], collectionId: collectionId }
        }
      })
    })
    .flat().filter(Boolean);
    const metadata = await Promise.all(
      infoToGetMetadata.map(async ({ tokenId, collectionId }) => {
        const metadataUwu = await web2Functions.getNftMetadata(tokenId, collectionId);
        return metadataUwu
      })
    );

    setAllMetadata(metadata);
  }

  async function onSellNft(tokenId, collectionAddress, price) {
    try {
      if (!price) {
        alert("Please set a price");
        return;
      }
      await marketplaceFunctions.sellNft(tokenId, collectionAddress, price);
      // await loadInventory();
      // const collections = await loadCollections(project.address);
      // const addressess = collections.map((collection) => collection.collectionAddress);
      // setCollections(collections);
      // const listedNfts = await loadListedNftsOnSecondaryMarket(addressess);
      // const newArrayToGetMetadata = listedNfts.map((item) => {
      //   const key = Object.keys(item)[0];
      //   const collectionFinded = collections.find((collection) => collection.collectionAddress === key);
      //   const tokensListed = item[key].tokensListedSecondaryMarket;

      //   return tokensListed.map((tokenId) => ({
      //     collectionId: collectionFinded.collectionId,
      //     tokenId,
      //   }));
      // })
      // .flat()
      // .filter(Boolean);
      
      // await loadMetadata(newArrayToGetMetadata, setAllNftsMetadata);
      // if (listedNfts.length > 0) setSecondaryMarketItems(listedNfts);
    } catch (error) {
      
    }
  }

  function Items () {
    if (!(items)) return (
      <div className="inventory-items__inventoryWithoutItems">
        <p className="inventory-items__generalTextSemiBold inventory-items__textCenter">You don't have any assets yet</p>
        <p className="inventory-items__generalText inventory-items__textCenter">The assets you purchase will be displayed on this page</p>
      </div>
    )

    return (
      <div className="inventory-items__itemsContainer" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {Object.keys(items)?.map((objectKey, index) => {
          return Object.entries(items[objectKey]).map((entries, index) => {
            // Index 0 = tokenId
            // Index 1 = 0 || 1. Lo tengo o no lo tengo...
            if (entries[1] === 1) {
              const metadata = allMetadata.find((mtdt) => {
                if (mtdt.nftId == entries[0] && mtdt.metadata.contract.address === objectKey.toLowerCase()) return true;
              });
              return <InventoryItem key={index} tokenId={parseInt(entries[0])} collectionAddress={objectKey} metadata={metadata} onSellNft={onSellNft}/>
            }
          })
        })}
      </div>
    )
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect</button>
      <p>User address: {publicKey}</p>
      <p>User signature: {signature}</p>
      <p>SessionToken: {sessionToken}</p>
      <Items/>
    </div>
  )
}

export default Inventory;