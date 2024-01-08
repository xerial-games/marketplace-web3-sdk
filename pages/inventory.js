import InventoryItem from "@/atoms/InventoryItem/InventoryItem";
import InventoryItemOnSecondaryMarket from "@/atoms/InventoryItemOnSecondaryMarket/InventoryItemOnSecondaryMarket";
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
  const [playerItemsOnSecondaryMarket, setPlayerItemsOnSecondaryMarket] = useState([]);
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
      loadPlayerItemsOnSecondaryMarket();
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

  async function loadPlayerItemsOnSecondaryMarket () {
    const items = await web2Functions.getPlayerItemsOnSecondaryMarket({ chain: "polygon", userAddress: userAddress });
    setPlayerItemsOnSecondaryMarket(items);
  }

  async function reloadPlayerItemsOnSecundaryMarketAndInventory() {
    loadPlayerItemsOnSecondaryMarket();
    loadInventory();
  }

  async function connectWallet() {
    try {
      const { loguedWith, player, sessionToken, tokens, wallets } = await loginWithMetamask({ projectId: project.id });
      const userAddress = wallets[0].address;
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
            return nft.tokenIds.map((tokenId) => {
              return (
                <InventoryItem nft={nft} key={nft.metadata.contract.address + tokenId} tokenId={tokenId}/>
              )
            })
          })}
        </div>
      </div>
    )
  }

  function SecondaryMarketItems () {
    if (!playerItemsOnSecondaryMarket || playerItemsOnSecondaryMarket.length === 0) return (
      <div className="inventory-items__inventoryWithoutItems">
        <p className="inventory-items__generalTextSemiBold inventory-items__textCenter">You don't have any assets yet</p>
        <p className="inventory-items__generalText inventory-items__textCenter">The assets will be displayed on this page</p>
      </div>
    )

    return (
      <div>
        <h1>Your items listed on secondary market</h1>
        <div className="inventory-items__itemsContainer" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {playerItemsOnSecondaryMarket?.map((nft) => {
            return (
              <InventoryItemOnSecondaryMarket
                nft={nft}
                key={nft.metadata.contract.address + nft.tokenId}
              />
            );
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={goToHome}>Go to home</button>
      <button onClick={connectWallet}>Connect</button>
      <button onClick={reloadPlayerItemsOnSecundaryMarketAndInventory}>Reload inventory and player market items</button>
      <p>User address: {userAddress}</p>
      <p>SessionToken: {sessionToken}</p>
      <Items/>
      <SecondaryMarketItems/>
    </div>
  )
}

export default Inventory;