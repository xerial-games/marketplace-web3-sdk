import web3Functions from "@/functions/web3/web3";
import { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

const SecondaryMarketItem = ({ nft, sellerAddress, XerialWalletViewmodel, activeChain }) => {
  const [errorMessage, setErrorMessage] = useState("");

  function handlePurchaseError(error) {
    const ownerCallDelistRegex =
      /execution reverted: Err: Owner, please call delist/;
    const balanceErrorRegex = /transfer amount exceeds balance/;
    const ownerCallDelistMatchResponse =
      error.message.match(ownerCallDelistRegex);
    const balanceMatchResponse = error.message.match(balanceErrorRegex);
    if (ownerCallDelistMatchResponse) {
      const specificMessage = ownerCallDelistMatchResponse[0];
      console.error(specificMessage);
      setErrorMessage(capitalizeFirstLetter(specificMessage));
    }
  
    if (balanceMatchResponse) {
      const specificMessage = balanceMatchResponse[0];
      console.error(specificMessage);
      setErrorMessage(capitalizeFirstLetter(specificMessage));
    }
  }

  async function purchaseNfts(event) {
    event.preventDefault();
    try {
      if (XerialWalletViewmodel.loguedWith === "google") {
        await XerialWalletViewmodel.secondaryPurchase({
          marketItemId: nft.marketItemId.toString(),
        });
      } else
        await web3Functions.secondaryMarketPurchase({
          marketplaceNftId: nft.marketItemId.toString(),
          chain: activeChain,
        });
    } catch (error) {
      handlePurchaseError(error);
      console.error("Error to purchase NFTs in Secondary Market. Reason: " + error.message);
    }
  }

  function onCloseErrorMessage () {
    setErrorMessage("");
  }

  return (
    <>
      <form
        className="atom-item__box"
        onSubmit={async (event) => {
          event.preventDefault();
        }}
      >
        <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
        <h1 className="atom-item__generalText global-style__textWithDots">Token Id: {nft.tokenId}</h1>
        <h2 className="atom-item__generalText global-style__textWithDots">Name: {nft.metadata.name}</h2>
        <p className="atom-item__generalText">Collection address: {nft.metadata.contract.address}</p>
        <p className="atom-item__generalText">Collection name: {nft.metadata.contract.name}</p>
        <p className="atom-item__generalText">Seller address: {nft.seller}</p>
        <p className="atom-item__generalText">Owner: {nft.seller}</p>
        <p className="atom-item__generalText">Available supply: 1</p>
        <p className="atom-item__generalText atom-item__priceMagenta">Price: {nft.price} USDC</p>
        {nft.metadata.attributes.slice(0, 6).map((attribute, index) => {
          return (
            <div className="atom-item__attributeCardContainer" key={index}>
              <div className="atom-item__attributeText">Type: {attribute.type}</div>
              <div className="atom-item__attributeText">Name: {attribute.name}</div>
              <div className="atom-item__attributeText">Value: {attribute.value}</div>
            </div>
          );
        })}
        <button className="atom-item__button" onClick={purchaseNfts}>
          Buy
        </button>
      </form>
      <ErrorMessage error={errorMessage} isOpen={errorMessage} onClose={onCloseErrorMessage} />
    </>
  );
};

export default SecondaryMarketItem;
