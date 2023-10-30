import InventoryItem from "@/atoms/InventoryItem/InventoryItem";
import connectMetamaskWallet from "@/utils/login_functions";
import web2Functions from "@/utils/web2_functions/web2_functions";
import web3Functions from "@/utils/web3_functions/web3_functions";
import { useEffect, useState } from "react";
const envStudioAddress = process.env.NEXT_PUBLIC_STUDIO_ADDRESS;
const handleWheel = () => {
  window.document.activeElement.blur()
};

const Inventory = () => {
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [items, setItems] = useState(null);
  const [allMetadata, setAllMetadata] = useState([]);
  const [secondaryMarketMetadata, setSecondaryMarketMetadata] = useState([]);
  const [secondaryMarketItemsOfUser, setSecondaryMarketItemsOfUser] = useState([]);
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
      loadItemsOnSecondaryMarket();
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

  async function loadItemsOnSecondaryMarket () {
    const collectionAddresses = collections.map((collection) => collection.collectionAddress);
    const listedNfts = await web3Functions.loadListedNftsOnSecondaryMarket(collectionAddresses);
    const newArrayToGetMetadata = listedNfts.map((item) => {
      const key = Object.keys(item)[0];
      const collectionFinded = collections.find((collection) => collection.collectionAddress === key);
      const tokensListed = item[key].tokensListedSecondaryMarket;

      return tokensListed.map((tokenId) => ({
        collectionId: collectionFinded.collectionId,
        tokenId,
      }));
    })
    .flat()
    .filter(Boolean);

    await loadSecondaryMarketMetadata(newArrayToGetMetadata);
    setSecondaryMarketItemsOfUser(listedNfts);
  }

  async function loadSecondaryMarketMetadata(arrayToGetMetadata) {
    if (arrayToGetMetadata && arrayToGetMetadata.length > 0) {
      const allMetadata = await Promise.all(
        arrayToGetMetadata.map(async (data) => web2Functions.getNftMetadata(data.tokenId, data.collectionId))
      );
      setSecondaryMarketMetadata(allMetadata);
    }
  }

  async function onSellNft(tokenId, collectionAddress, price) {
    try {
      if (!price) {
        alert("Please set a price");
        return;
      }
      await web3Functions.sellNft(tokenId, collectionAddress, price);
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
      <div>
        <h1>Your Inventory</h1>
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
      </div>
    )
  }

  function ItemsInSecondaryMarket({ tokenId, collectionAddress }) {
    const [metadata, setMetadata] = useState(null);
    const [price, setPrice] = useState(null);
    const [active, setActive] = useState(false);
    if (!tokenId || !collectionAddress || !collections) return;

    useEffect(() => {
      if (secondaryMarketMetadata && secondaryMarketMetadata.length > 0) {
        const nftMetadata = secondaryMarketMetadata.find((data) =>
          data.nftId === tokenId.toString() && data.metadata.contract.address === collectionAddress.toLowerCase()
        );
        if (nftMetadata) setMetadata(nftMetadata);
      }
    }, [secondaryMarketMetadata]);

    useEffect(() => {
      web3Functions.listings(tokenId, collectionAddress).then((res) => {
        if (res.owner === publicKey) setActive(true);
      });
    }, [active]);

    if (!active) return;

    async function onSubmit (event) {
      event.preventDefault();
      try {
        if (!price) {
          alert("Please set a price");
          return;
        }
        await web3Functions.changeTokenPrices(tokenId, price, collectionAddress);
        // Here <= All functions to reload inventory data.
      } catch (error) {
        
      }
    }

    function onChangePrice (value) {
      setPrice(value);
    }

    return (
      <div className="inventory-items__itemContainer">
        <div className="inventory-items__itemBoxListedNfts">
          <h2 className="inventory-items__itemTitle">{metadata?.metadata?.name || "loading..."}</h2>
          <img className="inventory-items__itemImage" src={metadata?.metadata?.image || "/assets/inventoryAssets/grey-img-template.svg"}/>
          <div className="inventory-items__horizontalLine"></div>
          <form className="inventory-items__form" onSubmit={onSubmit}>
            <label className="inventory-items__itemLabelForInput">
              <span className="inventory-items__itemInputWithLabelTitle">Price</span>
              <input
                className="inventory-items__itemInputWithLabelInput"
                name="price"
                type="number" placeholder="N"
                defaultValue={""}
                onChange={(e) => onChangePrice(e.target.value)}
                onWheel={handleWheel}
              />
            </label>
            <button className="inventory-items__buttonSell inventory-items__buttonSell--mini" type="submit">
              Update price
            </button>
            <button className="inventory-items__buttonSell inventory-items__buttonSell--mini" type="button"
              onClick={async () => {
                try {
                  await web3Functions.delistNft(
                    tokenId,
                    collectionAddress
                  );
                  // Here <= All functions to reload inventory data.
                } catch (error) {
                  console.error("Error delisting NFT");
                }
              }}
            >
              Delist
            </button>
          </form>
        </div>
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
      <section className="inventory-items__secondaryMarketSection">
        {secondaryMarketItemsOfUser && <h1>Your items in Secondary Market</h1>}
        {secondaryMarketItemsOfUser?.map((collectionWithTokenIds) => {
          return Object.keys(collectionWithTokenIds)?.map((objectKey, index) => {
            return Object.entries(collectionWithTokenIds[objectKey]).map((marketInfo) => {
              return marketInfo[1].map((tokenId, index) => {
                return (
                  <ItemsInSecondaryMarket
                    key={index}
                    collectionAddress={objectKey}
                    tokenId={tokenId}
                  />
                );
              });
            });
          });
        })}
      </section>
    </div>
  )
}

export default Inventory;