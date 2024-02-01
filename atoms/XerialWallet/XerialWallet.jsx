import { defaultPolygonChainValue } from "@/utils/defaultChainValues";
import { useEffect, useState } from "react";

function trimmedAddress(address) {
  const initials = address.slice(0, 2);
  const finals = address.slice(-4);

  const trimmedAddress = `${initials}...${finals}`;

  return trimmedAddress;
}

const defaultInventoryTabValue = "inventory";
const defaultTokensTabValue = "tokens";
const defaultSecondaryMarketTabValue = "secondaryMarket";

function SuccessfullyModal({ title, description, buttonContent, onClickButton }) {
  return (
    <div className="atoms__xerial-wallet__principalContainer">
      <div className="atoms__xerial-wallet__modal__modalPrincipalContainer">
        <div className="atoms__xerial-wallet__modal__imageContainer">
          <img className="atoms__xerial-wallet__modal__image" src="/assets/xerialWalletAssets/illustration.png" alt="illustration" />
        </div>
        <div className="atoms__xerial-wallet__modal__textContainer">
          <div className="atoms__xerial-wallet__modal__whiteText">{title}</div>
          <div className="atoms__xerial-wallet__modal__greyText">{description}</div>
        </div>
        <button className="atoms__xerial-wallet__modal__buttonReturn" onClick={onClickButton}>
          {buttonContent}
        </button>
      </div>
    </div>
  );
}

function ErrorModal({ title, description, buttonContent, onClickButton }) {
  return (
    <div className="atoms__xerial-wallet__principalContainer">
      <div className="atoms__xerial-wallet__modal__modalPrincipalContainer">
        <div className="atoms__xerial-wallet__modal__imageContainer">
          <img className="atoms__xerial-wallet__modal__image" src="/assets/xerialWalletAssets/error-illustration.png" alt="error illustration" />
        </div>
        <div className="atoms__xerial-wallet__modal__textContainer">
          <div className="atoms__xerial-wallet__modal__whiteText">{title}</div>
          <div className="atoms__xerial-wallet__modal__greyText">{description}</div>
        </div>
        <button className="atoms__xerial-wallet__modal__buttonReturn" onClick={onClickButton}>
          {buttonContent}
        </button>
      </div>
    </div>
  );
}
const XerialWallet = ({ XerialWalletViewmodel }) => {
  const [walletTab, setWalletTab] = useState(defaultInventoryTabValue);
  const [chains, setChains] = useState(["Mumbai"]);
  const [chainsActive, setChainsActive] = useState(false);
  const [optionsActive, setOptionsActive] = useState(false);
  const [player, setPlayer] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [maticBalance, setMaticBalance] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [depositActive, setDepositActive] = useState(false);
  const [selectedNft, setSelectedNft] = useState({});
  const [addressToSendNft, setAddressToSendNft] = useState("");
  const [sendNftActive, setSendNftActive] = useState(false);
  const [listNftActive, setListNftActive] = useState(false);
  const [nftPrice, setNftPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [loguedWith, setLoguedWith] = useState("");
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [listedNft, setListedNft] = useState(false);
  const [delistedNft, setDelistedNft] = useState(false);
  const [transferedNft, setTransferedNft] = useState(false);
  const [errorMessageModal, setErrorMessageModal] = useState(false);
  const [loadingSecondaryMarketNfts, setLoadingSecondaryMarketNfts] = useState(false);
  const [playerItemslistedNftsOnSecondaryMarket, setPlayerItemsListedOnSecondaryMarket] = useState([]);
  const [activeChain, setActiveChain] = useState(defaultPolygonChainValue);

  useEffect(() => {
    setChainsActive(false);
    setOptionsActive(false);
    XerialWalletViewmodel.observer.observe(() => {
      setPlayer(XerialWalletViewmodel.player || {});
      setWallets(XerialWalletViewmodel.wallets || []);
      setInventory(XerialWalletViewmodel.inventory || []);
      setMaticBalance(XerialWalletViewmodel.matic || null);
      setUsdcBalance(XerialWalletViewmodel.usdc || null);
      setLoading(XerialWalletViewmodel.loading || false);
      setLoadingMessage(XerialWalletViewmodel.loadingMessage || "");
      setLoadingNfts(XerialWalletViewmodel.loadingNfts || false);
      setLoguedWith(XerialWalletViewmodel.loguedWith || "");
      setLoadingBalance(XerialWalletViewmodel.loadingBalance || false);
      setListedNft(XerialWalletViewmodel.listedNft || false);
      setDelistedNft(XerialWalletViewmodel.delistedNft || false);
      setTransferedNft(XerialWalletViewmodel.transferedNft || false);
      setErrorMessageModal(XerialWalletViewmodel.errorMessageModal || "");
      setLoadingSecondaryMarketNfts(XerialWalletViewmodel.loadingSecondaryMarketNfts || false);
      setPlayerItemsListedOnSecondaryMarket(XerialWalletViewmodel.newPlayerItemsOnSecondaryMarket || []);
    });
    XerialWalletViewmodel.observer.notifyAll();
  }, []);

  useEffect(() => {
    if (loguedWith) {
      reloadAllContent();
    }
  }, [loguedWith]);

  async function refreshBalance() {
    await Promise.all([XerialWalletViewmodel.loadMaticBalance(), XerialWalletViewmodel.loadUsdcBalance()]);
  }

  async function reloadAllContent() {
    refreshBalance();
    XerialWalletViewmodel.loadInventory();
    XerialWalletViewmodel.loadPlayerItemsOnSecondaryMarket({ chain: "polygon" });
  }

  async function onCloseListedNftModal() {
    setSelectedNft({});
    setListNftActive(false);
    setSendNftActive(false);
    setWalletTab(defaultInventoryTabValue);
    XerialWalletViewmodel.setListedNft(false);
    await reloadAllContent();
  }

  async function onCloseDelistedNftModal() {
    setSelectedNft({});
    setListNftActive(false);
    setSendNftActive(false);
    setWalletTab(defaultInventoryTabValue);
    XerialWalletViewmodel.setDelistedNft(false);
    await reloadAllContent();
  }

  async function onCloseTransferedNftModal() {
    setSelectedNft({});
    setListNftActive(false);
    setSendNftActive(false);
    setWalletTab(defaultInventoryTabValue);
    XerialWalletViewmodel.setTransferedNft(false);
    await reloadAllContent();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  function onChangeAddressToSendNft(event) {
    setAddressToSendNft(event.target.value.trim());
  }

  function onChangeNftPrice(event) {
    if (!event.target.value) return;
    const price = Number(event.target.value.trim());
    setNftPrice(price);
  }

  const handleWheel = () => {
    window.document.activeElement.blur();
  };

  if (!player || JSON.stringify(player) === "{}") return;

  // if (!modalActive) return (
  //   <div className="atoms__xerial-wallet__principalContainer">

  //   </div>
  // )

  if (loguedWith !== "google") return;

  if (loading)
    return (
      <div className="atoms__xerial-wallet__principalContainer">
        <div className="atoms__xerial-wallet__loader__principalContainer">
          <div></div>
          <img className="atoms__xerial-wallet__loader__loaderImage" src="/assets/xerialWalletAssets/loader.svg" alt="loader" />
          <div className="atoms__xerial-wallet__loader__loaderMessageContainer">
            <div className="atoms__xerial-wallet__loader__loaderMessageGradient">Please wait</div>
            <div className="atoms__xerial-wallet__loader__loaderMessage">{loadingMessage}</div>
          </div>
        </div>
      </div>
    );

  if (listedNft)
    return (
      <SuccessfullyModal
        title="Asset published successfully"
        description="Your item is now on the secondary market. It's available for other community members to purchase"
        buttonContent="return"
        onClickButton={onCloseListedNftModal}
      />
    );

  if (delistedNft) return <SuccessfullyModal title="Asset successfully delisted" description="You can find it in collectibles" buttonContent="return" onClickButton={onCloseDelistedNftModal} />;

  if (transferedNft)
    return (
      <SuccessfullyModal
        title="Asset transfered successfully"
        description="Congratulations! Your item has been successfully transferred and is no longer in your inventory."
        buttonContent="return"
        onClickButton={onCloseTransferedNftModal}
      />
    );

  if (errorMessageModal) return <ErrorModal title="Error" description={errorMessageModal} buttonContent="return" onClickButton={() => XerialWalletViewmodel.setErrorMessageModal("")} />;

  return (
    <div className="atoms__xerial-wallet__principalContainer">
      <div className="atoms__xerial-wallet__topSideContainer">
        <div>
          <div className="atoms__xerial-wallet__selectedChain atoms__xerial-wallet__item1" onClick={() => setChainsActive(!chainsActive)}>
            <span>M</span>
            <img src="/assets/xerialWalletAssets/down-arrow.svg" alt="icon" />
          </div>
          {chainsActive && (
            <div className="atoms__xerial-wallet__chainsList">
              {chains.map((chain, index) => (
                <div className="atoms__xerial-wallet__chainInSelect" key={index} onClick={() => setChainsActive(false)}>
                  {chain}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="atoms__xerial-wallet__username atoms__xerial-wallet__item2">{player.username.slice(0, 10) + "..."}</div>
        <div className="atoms__xerial-wallet__positionRelative">
          <div className="atoms__xerial-wallet__item3" onClick={() => setOptionsActive(!optionsActive)}>
            <img className="atoms__xerial-wallet__optionsIcon" src="/assets/xerialWalletAssets/options-icon.svg" alt="icon" />
          </div>
          {optionsActive && (
            <div className="atoms__xerial-wallet__optionsContainer">
              <div
                className="atoms__xerial-wallet__logoutButton"
                onClick={() => {
                  setWalletTab(defaultSecondaryMarketTabValue);
                  setOptionsActive(false);
                }}
              >
                Listed items
              </div>
              <div className="atoms__xerial-wallet__logoutButton" onClick={() => XerialWalletViewmodel.logout()}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      {depositActive && (
        <div>
          <div className="atoms__xerial-wallet__depositSection__topSideContainer">
            <button className="atoms__xerial-wallet__depositSection__cancelButton atoms__xerial-wallet__depositSection__opacityOff">Cancel</button>
            <span className="atoms__xerial-wallet__depositSection__generalText">Your address</span>
            <button className="atoms__xerial-wallet__depositSection__cancelButton" onClick={() => setDepositActive(false)}>
              Cancel
            </button>
          </div>
          <div className="atoms__xerial-wallet__depositSection__userAddress">{XerialWalletViewmodel.getUserAddress({ chain: activeChain })}</div>
          <button className="atoms__xerial-wallet__depositSection__button" onClick={() => copyText(XerialWalletViewmodel.getUserAddress({ chain: activeChain }))}>
            Copy Address
          </button>
        </div>
      )}
      {!depositActive && (!selectedNft || JSON.stringify(selectedNft) === "{}") && (
        <>
          <div>
            <div className="atoms__xerial-wallet__balanceAndAddressContainer">
              <div className="atoms__xerial-wallet__balance">{usdcBalance ? usdcBalance.toFixed(2) : "0.0"} USDC</div>
              <div className="atoms__xerial-wallet__address">{wallets.length > 0 && trimmedAddress(XerialWalletViewmodel.getUserAddress({ chain: activeChain }))}</div>
            </div>
          </div>

          <div className="atoms__xerial-wallet__txButtons">
            <div className="atoms__xerial-wallet__txButton">
              <img src="/assets/xerialWalletAssets/transfer-icon.svg" alt="icon" />
              <span>Buy</span>
            </div>
            <div className="atoms__xerial-wallet__txButton" onClick={() => setDepositActive(true)}>
              <img src="/assets/xerialWalletAssets/receive-icon.svg" alt="icon" />
              <span>Deposit</span>
            </div>
          </div>

          <div>
            <div className="atoms__xerial-wallet__colsAndTokenButtons">
              <div
                className={walletTab !== defaultInventoryTabValue ? "atoms__xerial-wallet__colButton" : "atoms__xerial-wallet__colButton atoms__xerial-wallet__colButton--selected"}
                onClick={() => setWalletTab(defaultInventoryTabValue)}
              >
                Collectibles
              </div>
              <div
                className={walletTab !== defaultTokensTabValue ? "atoms__xerial-wallet__tokenButton" : "atoms__xerial-wallet__tokenButton atoms__xerial-wallet__tokenButton--selected"}
                onClick={() => setWalletTab(defaultTokensTabValue)}
              >
                Tokens
              </div>
            </div>
            {/* {walletTab === defaultInventoryTabValue && inventory.length === 0 && (
              <div className="atoms__xerial-wallet__inventory__nftImages">
                <span className="atoms__xerial-wallet__inventory__inventoryIncoming">Inventory incoming...</span>
              </div>
            )} */}
            {walletTab === defaultInventoryTabValue && !loadingNfts && (
              <div className="atoms__xerial-wallet__inventory__nftImages">
                {inventory?.map((nft) =>
                  nft.tokenIds.map((tokenId) => {
                    const { tokenIds, ...data } = nft;
                    const currentNft = { ...data, tokenId };
                    return (
                      <div key={nft.metadata.contract.address + tokenId} className="atoms__xerial-wallet__inventory__nftImageContainer">
                        <img className="atoms__xerial-wallet__inventory__nftImage" src={nft.metadata.image} alt={nft.metadata.name} onClick={() => setSelectedNft(currentNft)} />
                      </div>
                    );
                  })
                )}
              </div>
            )}
            {walletTab === defaultInventoryTabValue && loadingNfts && (
              <div className="atoms__xerial-wallet__loader__miniLoaderContainer">
                <img className="atoms__xerial-wallet__loader__loaderImage" src="/assets/xerialWalletAssets/loader.svg" alt="loader" />
                <div className="atoms__xerial-wallet__loader__loaderMessageContainer">
                  <div className="atoms__xerial-wallet__loader__loaderMessageGradient">Please wait</div>
                  <div className="atoms__xerial-wallet__loader__loaderMessage">Loading inventory</div>
                </div>
              </div>
            )}
            {walletTab === defaultTokensTabValue && !loadingBalance && (
              <div>
                <div className="atoms__xerial-wallet__tokens__tokenContainer">
                  <div className="atoms__xerial-wallet__tokens__polygonTextAndIconContainer">
                    <img className="atoms__xerial-wallet__tokens__polygonIcon" src="/assets/xerialWalletAssets/polygon-without-bg.svg" alt="polygon icon" />
                    <span>polygon</span>
                  </div>
                  <div className="atoms__xerial-wallet__tokens__tokenValue">{maticBalance ? maticBalance.toFixed(4) : "0.0"} MATIC</div>
                </div>
                <div className="atoms__xerial-wallet__tokens__tokenContainer">
                  <div className="atoms__xerial-wallet__tokens__polygonTextAndIconContainer">
                    <img className="atoms__xerial-wallet__tokens__polygonIcon" src="/assets/xerialWalletAssets/polygon-without-bg.svg" alt="polygon icon" />
                    <span>polygon</span>
                  </div>
                  <div className="atoms__xerial-wallet__tokens__tokenValue">{usdcBalance ? usdcBalance.toFixed(2) : "0.0"} USDC</div>
                </div>
                <div>
                  <button className="atoms__xerial-wallet__selectedNft__buttonRefresh" onClick={refreshBalance}>
                    Reload
                  </button>
                </div>
              </div>
            )}
            {walletTab === defaultTokensTabValue && loadingBalance && (
              <div className="atoms__xerial-wallet__loader__miniLoaderContainer">
                <img className="atoms__xerial-wallet__loader__loaderImage" src="/assets/xerialWalletAssets/loader.svg" alt="loader" />
                <div className="atoms__xerial-wallet__loader__loaderMessageContainer">
                  <div className="atoms__xerial-wallet__loader__loaderMessageGradient">Please wait</div>
                  <div className="atoms__xerial-wallet__loader__loaderMessage">Loading tokens balances</div>
                </div>
              </div>
            )}
            {/* actualizando. */}
            {walletTab === defaultSecondaryMarketTabValue && !loadingSecondaryMarketNfts && (
              <div className="atoms__xerial-wallet__inventory__nftImages">
                {playerItemslistedNftsOnSecondaryMarket?.map((nft) => {
                  return (
                    <div key={nft.metadata.contract.address + nft.tokenId} className="atoms__xerial-wallet__inventory__nftImageContainer">
                      <img className="atoms__xerial-wallet__inventory__nftImage" src={nft.metadata.image} alt={nft.metadata.name} onClick={() => setSelectedNft(nft)} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {selectedNft && JSON.stringify(selectedNft) != "{}" && (
        <div>
          <div className="atoms__xerial-wallet__selectedNft__topSideContainer">
            <button
              onClick={() => {
                setListNftActive(false);
                setSendNftActive(false);
                setSelectedNft({});
              }}
              className="atoms__xerial-wallet__selectedNft__btn-go-back"
            >
              <img src="/assets/xerialWalletAssets/go-back-icon.svg" alt="go-back icon" />
            </button>
            <h2 className="atoms__xerial-wallet__selectedNft__generalText">{selectedNft.metadata.name}</h2>
            <button className="atoms__xerial-wallet__selectedNft__btn-go-back atoms__xerial-wallet__depositSection__opacityOff">
              <img src="/assets/xerialWalletAssets/go-back-icon.svg" alt="go-back icon" />
            </button>
          </div>
          <img className="atoms__xerial-wallet__selectedNft__image" src={selectedNft.metadata.image} alt={selectedNft.metadata.name} />
          {!sendNftActive && !listNftActive && walletTab === defaultInventoryTabValue && (
            <div className="atoms__xerial-wallet__selectedNft__buttons">
              <button className="atoms__xerial-wallet__selectedNft__button" onClick={() => setSendNftActive(true)}>
                Send
              </button>
              <button className="atoms__xerial-wallet__selectedNft__button" onClick={() => setListNftActive(true)}>
                List
              </button>
            </div>
          )}
          {!sendNftActive && !listNftActive && walletTab === defaultSecondaryMarketTabValue && (
            <div className="atoms__xerial-wallet__selectedNft__buttons">
              <button className="atoms__xerial-wallet__selectedNft__button" onClick={() => XerialWalletViewmodel.delist({ marketItemId: selectedNft.marketItemId })}>
                Delist
              </button>
            </div>
          )}
          {sendNftActive && (
            <>
              <label className="atoms__xerial-wallet__selectedNft__transferInputLabel">
                <textarea cols={2} type="text" onChange={onChangeAddressToSendNft} defaultValue={addressToSendNft} placeholder="Address to send NFT" />
                <img src="/assets/xerialWalletAssets/polygon.svg" alt="polygon icon" />
              </label>
              <div className="atoms__xerial-wallet__selectedNft__buttons">
                <button className="atoms__xerial-wallet__selectedNft__button" onClick={() => setSendNftActive(false)}>
                  Cancel
                </button>
                <button
                  className="atoms__xerial-wallet__selectedNft__button"
                  onClick={() => {
                    if (!addressToSendNft) return;
                    XerialWalletViewmodel.transferNft({
                      collectionAddress: selectedNft.metadata.contract.address,
                      tokenId: selectedNft.tokenId,
                      to: addressToSendNft,
                    });
                    setAddressToSendNft("");
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {listNftActive && (
            <>
              <div className="atoms__xerial-wallet__selectedNft__inputToSellNftContainer">
                <input className="atoms__xerial-wallet__selectedNft__inputToSellNft" type="number" onWheel={handleWheel} onChange={onChangeNftPrice} defaultValue={nftPrice} placeholder="Price" />
                <button
                  className="atoms__xerial-wallet__selectedNft__button"
                  onClick={async () => {
                    if (!nftPrice) console.error("Please set a price.");
                    await XerialWalletViewmodel.listNft({
                      collectionAddress: selectedNft.metadata.contract.address,
                      tokenId: selectedNft.tokenId,
                      price: nftPrice,
                    });
                  }}
                >
                  Sell
                </button>
              </div>
              <div className="atoms__xerial-wallet__selectedNft__nftCollectionNameContainer">
                <div className="atoms__xerial-wallet__selectedNft__nftCollectionName--title">Collection</div>
                <div className="atoms__xerial-wallet__selectedNft__nftCollectionName">{selectedNft.metadata.contract.name}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default XerialWallet;
