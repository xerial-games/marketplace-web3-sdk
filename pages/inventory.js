import InventoryItem from "@/atoms/InventoryItem/InventoryItem";
import loginWithMetamask from "@/utils/login_functions";
import web2Functions from "@/utils/web2_functions/web2_functions";
import web3Functions from "@/utils/web3_functions/web3_functions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const handleWheel = () => {
  window.document.activeElement.blur()
};

const Inventory = () => {
  const [items, setItems] = useState(null);
  // studioAddress is the Game Studio Address
  const [collections, setCollections] = useState([]);
  const [project, setProject] = useState({});
  const [hostname, setHostname] = useState("");
  const [wallets, setWallets] = useState([]);
  const [sessionToken, setSessionToken] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  useEffect(() => {
    if (hostname) {
      load();
    }
  }, [hostname]);


  useEffect(() => {
    if (project && JSON.stringify(project) != "{}") {
      loadCollections();
    }
  }, [project]);

  useEffect(() => {
    if (sessionToken) {
      loadInventory();
    }
  }, [sessionToken]);

  async function load () {
    const getProjectForDomainResponse = await web2Functions.getProjectForDomain({ projectDomain: hostname });
    setProject(getProjectForDomainResponse.project);
  }

  async function loadCollections() {
    const collectionsFromGameStudio = await web2Functions.getGameStudioCollections({ projectId: project.id });
    setCollections(collectionsFromGameStudio.collections);
  }

  async function loadInventory () {
    try {
      const inventory = await web2Functions.getInventory({
        address: userAddress,
        studioAddress: project.address,
        chain: "polygon",
      });

      setItems(inventory);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function connectWallet() {
    try {
      const { loguedWith, player, sessionToken, tokens, wallets } = await loginWithMetamask();
      const userAddress = wallets.find((wallet) => wallet.chain === "ethereum").address;
      if (!userAddress) throw new Error("Ethereum userAddress not found");
      setWallets(wallets);
      setSessionToken(sessionToken);
      setUserAddress(userAddress);
    } catch (error) {
      console.error("Error: Login Failed.");
    }
  }

  function goToHome () {
    router.push("/");
  }

  async function onSellNft(tokenId, collectionAddress, price) {
    try {
      // if (!price) {
      //   alert("Please set a price");
      //   return;
      // }
      // await web3Functions.sellNft(tokenId, collectionAddress, price);
    } catch (error) {
      
    }
  }

  function Items () {
    if (!items || items.length === 0) return (
      <div className="inventory-items__inventoryWithoutItems">
        <p className="inventory-items__generalTextSemiBold inventory-items__textCenter">You don't have any assets yet</p>
        <p className="inventory-items__generalText inventory-items__textCenter">The assets you purchase will be displayed on this page</p>
      </div>
    )

    return (
      <div>
        <h1>Your Inventory</h1>
        <div className="inventory-items__itemsContainer" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {items.map((nft) => {
            return (
              <InventoryItem nft={nft} key={nft.metadata.contract.address + nft.metadata.image}/>
            )
          })}
        </div>
      </div>
    )
  }

  function ItemsInSecondaryMarket({ nft }) {
    const [price, setPrice] = useState(null);
    return;
    // if (!tokenId || !collectionAddress || !collections) return;

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
      <button onClick={goToHome}>Go to home</button>
      <button onClick={connectWallet}>Connect</button>
      <p>User address: {userAddress}</p>
      <p>SessionToken: {sessionToken}</p>
      <Items/>
      <section className="inventory-items__secondaryMarketSection">
        {/* {secondaryMarketItemsOfUser && <h1>Your items in Secondary Market</h1>}
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
        })} */}
      </section>
    </div>
  )
}

export default Inventory;