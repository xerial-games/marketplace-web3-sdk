import InventoryItem from "@/atoms/InventoryItem/InventoryItem";
import InventoryItemOnSecondaryMarket from "@/atoms/InventoryItemOnSecondaryMarket/InventoryItemOnSecondaryMarket";
import { loadSession, loginWithMetamask, logout } from "@/functions/login";
import web2Functions from "@/functions/web2/web2";
import web3Functions from "@/functions/web3/web3";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
const projectDomain = process.env.NEXT_PUBLIC_PROJECT_DOMAIN;

const Inventory = () => {
  const [items, setItems] = useState(null);
  // studioAddress is the Game Studio Address
  const [collections, setCollections] = useState([]);
  const [project, setProject] = useState({});
  const [wallets, setWallets] = useState([]);
  const [sessionToken, setSessionToken] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [playerItemsOnSecondaryMarket, setPlayerItemsOnSecondaryMarket] = useState([]);
  const [loguedWith, setLoguedWith] = useState("");
  const router = useRouter();

  useEffect(() => {
    load();
    loadMetamaskSessionInUI();
  }, []);

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

  async function load() {
    const getProjectForDomainResponse = await web2Functions.getProjectForDomain({ projectDomain: projectDomain });
    setProject(getProjectForDomainResponse.project);
  }

  async function loadCollections() {
    const collectionsFromGameStudio = await web2Functions.getGameStudioCollections({ projectId: project.id });
    setCollections(collectionsFromGameStudio.collections);
  }

  async function loadInventory() {
    try {
      const inventory = await web2Functions.getInventory({
        address: userAddress,
        studioAddress: project.address,
        chain: "polygon",
      });

      setItems(inventory);
    } catch (error) {
      console.error("Error in loadInventory function. Reason: " +  error.message);
    }
  }

  async function loadPlayerItemsOnSecondaryMarket() {
    const items = await web2Functions.getPlayerItemsOnSecondaryMarket({
      chain: "polygon",
      userAddress: userAddress,
      studioAddress: project.address,
    });
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
      if (!userAddress) throw new Error("User Address Not Found");
      setWallets(wallets);
      setSessionToken(sessionToken);
      setUserAddress(userAddress);
      setLoguedWith(loguedWith);
    } catch (error) {
      console.error("Error: Login Failed");
      console.error("Error in connectWallet function. Reason: " +  error.message);
    }
  }

  async function loadMetamaskSessionInUI () {
    const response = await loadSession();
    if (!response) return;
    const { loguedWith, player, sessionToken, wallets } = response;
    const userAddress = wallets[0].address;
    setWallets(wallets);
    setSessionToken(sessionToken);
    setUserAddress(userAddress);
    setLoguedWith(loguedWith);
  }

  async function logoutAndClearUI () {
    try {
      await logout();
      setItems([]);
      setPlayerItemsOnSecondaryMarket([]);
      setWallets([]);
      setSessionToken("");
      setUserAddress("");
      setLoguedWith("");
    } catch (error) {
      console.error("Error in logoutAndClearUI function. Reason: " +  error.message);
    }
  }

  async function connectWithGoogle(credentialResponse) {
    try {
      const { loguedWith, player, sessionToken, tokens, wallets } = await web2Functions.loginWithGoogle({
        credential: credentialResponse.credential,
        clientId,
        projectId: project.id,
      });

      const userAddress = wallets[0].address;
      if (!userAddress) throw new Error("User Address Not Found");
      setWallets(wallets);
      setSessionToken(sessionToken);
      setUserAddress(userAddress);
    } catch (error) {
      console.error("Error: Login Failed");
      console.error("Error in connectWithGoogle function. Reason: " +  error.message);
    }
  }

  function goToHome() {
    router.push("/");
  }

  function Items() {
    if (!items || items.length === 0)
      return (
        <>
          <div className="inventory-items__titleContainer">
            <h1 className="inventory-items__title">Inventory</h1>
          </div>
          <div className="inventory-items__inventoryWithoutItems">
            <p className="inventory-items__generalTextSemiBold inventory-items__textCenter">You don't have any assets yet</p>
            <p className="inventory-items__generalText inventory-items__textCenter">The assets you purchase will be displayed on this page</p>
          </div>
        </>
      );

    return (
      <div>
        <div className="inventory-items__titleContainer">
          <h1 className="inventory-items__title">Inventory</h1>
        </div>
        <div className="inventory-items__itemsContainer" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {items.map((nft) => {
            return nft.tokenIds.map((tokenId) => {
              return <InventoryItem nft={nft} key={nft.metadata.contract.address + tokenId} tokenId={tokenId} />;
            });
          })}
        </div>
      </div>
    );
  }

  function SecondaryMarketItems() {
    if (!playerItemsOnSecondaryMarket || playerItemsOnSecondaryMarket.length === 0)
      return (
        <>
          <div className="inventory-items__titleContainer">
            <h1 className="inventory-items__title">Items Listed on Secondary Market</h1>
          </div>
          <div className="inventory-items__inventoryWithoutItems">
            <p className="inventory-items__generalTextSemiBold inventory-items__textCenter">You don't have any assets yet</p>
            <p className="inventory-items__generalText inventory-items__textCenter">The assets will be listed on this page</p>
          </div>
        </>
      );

    return (
      <div>
        <div className="inventory-items__titleContainer">
          <h1 className="inventory-items__title">Items Listed on Secondary Market</h1>
        </div>
        <div className="inventory-items__itemsContainer" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {playerItemsOnSecondaryMarket?.map((nft) => {
            return <InventoryItemOnSecondaryMarket nft={nft} key={nft.metadata.contract.address + nft.tokenId} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="inventory__container">
      <div className="inventory__buttons">
        <div className="home__buttonsContainer">
          <button className="inventory__button" onClick={goToHome}>
            Go to Home
          </button>
          {sessionToken && (
            <button className="inventory__button" onClick={reloadPlayerItemsOnSecundaryMarketAndInventory}>
              Reload Inventory and Player Market Items
            </button>
          )}
          {!loguedWith ? (
            <button className="inventory__button" onClick={connectWallet}>
              Connect with MetaMask
            </button>
          ) : (
            <button className="inventory__button" onClick={logoutAndClearUI}>
              logout
            </button>
          )}
          {/* <GoogleLogin
            theme="outline"
            width="335px"
            onSuccess={connectWithGoogle}
            onError={() => {
              console.error("Login Failed");
            }}
          /> */}
        </div>
      </div>
      {sessionToken ? (
        <div className="inventory__background">
          <div className="inventory__project-container">
            <p className="inventory__project-session">User Address: {userAddress}</p>
            <p className="inventory__project-session">Session Token: {sessionToken}</p>
          </div>
          <div className="inventory__items-container">
            <Items />
            <SecondaryMarketItems />
          </div>
        </div>
      ) : (
        <div className="inventory__noLoguedMessageContainer">
          <p className="inventory__project-session">You are not logged in. Please log in</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
