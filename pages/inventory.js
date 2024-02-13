import InventoryItem from "@/atoms/InventoryItem/InventoryItem";
import InventoryItemOnSecondaryMarket from "@/atoms/InventoryItemOnSecondaryMarket/InventoryItemOnSecondaryMarket";
import { loadSession, loginWithMetamask, logout } from "@/functions/login";
import web2Functions from "@/functions/web2/web2";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
const projectDomain = process.env.NEXT_PUBLIC_PROJECT_DOMAIN;

const Inventory = () => {
  const [items, setItems] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [limit, setLimit] = useState(20);
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

  useEffect(() => {
    if (items && items.length > 0) {
      const formattedItems = items?.map((nft) => {
        return nft.tokenIds.map((tokenId) => {
          return { ...nft, tokenId };
        });
      }).flat() || [];

      const currentPurchases = formattedItems.slice(0, limit).map((nft) => {
        if (nft.tokenIds) {
          let { tokenIds, ...nftWithoutTokenIds } = nft;
          return nftWithoutTokenIds;
        }
        return nft;
      });
      setCurrentItems(currentPurchases.slice(0, limit));
    }
  }, [items]);

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
    try {
      const items = await web2Functions.getPlayerItemsOnSecondaryMarket({
        chain: "polygon",
        userAddress: userAddress,
        studioAddress: project.address,
      });
      setPlayerItemsOnSecondaryMarket(items);
    } catch (error) {
      console.error("error to load playerItemsOnSecondaryMarket")
    }
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

  function scrollToElement (id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function PageButtons ({ content, extraAction }) {
    const handlePaginationClick = (page) => {
      const indexOfLastPurchase = page * limit;
      const indexOfFirstPurchase = indexOfLastPurchase - limit;
      const currentPurchases = content.slice(indexOfFirstPurchase, indexOfLastPurchase).map((nft) => {
        let { tokenIds, ...nftWithoutTokenIds } = nft;
        return nftWithoutTokenIds;
      });

      setCurrentPage(page);
      setCurrentItems(currentPurchases);
    }

    const PageNumbers = () => {
      const pageNumbers = [];
      const totalPages = Math.ceil(content.length / limit);

      if (currentPage > 1) {
        pageNumbers.push(
          <button
            key={1}
            onClick={() => { handlePaginationClick(1); if (extraAction) {
              extraAction();
            } }}
            className={currentPage === 1 ? "inventory-items__page inventory-items__pageActive" : "inventory-items__page"}
          >
            {1}
          </button>
        );
        pageNumbers.push(
          <button
            key={"???"}
            className={"inventory-items__page"}
          >
            ...
          </button>
        );
      }

      for (let i = 1; i <= totalPages; i++) {
        if (i >= currentPage && i < currentPage + 9) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => { handlePaginationClick(i); if (extraAction) {
                extraAction();
              } }}
              className={currentPage === i ? "inventory-items__page inventory-items__pageActive" : "inventory-items__page"}
            >
              {i}
            </button>
          );
        }
      }

      return pageNumbers;
    };

    return (
      <div className="inventory-items__pageNumberContainer">
        <PageNumbers limit={20}/>
      </div>
    )
  }

  function goToHome() {
    router.push("/");
  }

  function Items() {
    if (!currentItems || currentItems.length === 0)
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
          <h1 className="inventory-items__title" id="inventory">Inventory</h1>
        </div>
        <div className="inventory-items__itemsContainer" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {currentItems.map((nft) => {
            return <InventoryItem nft={nft} key={nft.metadata.contract.address + nft.tokenId} tokenId={nft.tokenId} />;
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
            <PageButtons
              content={
                items
                  ?.map((nft) => {
                    return nft.tokenIds.map((tokenId) => {
                      return { ...nft, tokenId };
                    });
                  })
                  .flat() || []
              }
              extraAction={() => scrollToElement("inventory")}
            />
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
