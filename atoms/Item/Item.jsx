import web3Functions from "@/functions/web3/web3";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Item = ({ nft, sellerAddress, XerialWalletViewmodel, activeChain }) => {
  const [amount, setAmount] = useState("");
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
      if (!amount || amount <= 0) {
        console.error("Please Set a Valid Amount");
        return;
      }
      if (XerialWalletViewmodel.loguedWith === "google") {
        await XerialWalletViewmodel.purchaseNfts({
          tokenTypeId: nft.typeId,
          quantity: amount,
          collectionAddress: nft.metadata.contract.address,
        });
      } else {
        await web3Functions.purchaseNft({
          tokenTypeId: nft.typeId,
          collectionAddress: nft.metadata.contract.address,
          quantity: amount,
          chain: activeChain,
        });
      }
    } catch (error) {
      handlePurchaseError(error);
      console.error("Error to purchase NFTs. Reason: " + error.message);
    }
  }

  function onCloseErrorMessage () {
    setErrorMessage("");
  }

  return (
    <form className="atom-item__box" onSubmit={purchaseNfts}>
      <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
      <div className="atom-item__priceAndTypeIdContainer">
        <h1 className="atom-item__generalText global-style__textWithDots">Token typeId: {nft.typeId}</h1>
        <p className="atom-item__generalText atom-item__priceMagenta">Price: {nft.price} USDC</p>
      </div>
      <h2 className="atom-item__generalText global-style__textWithDots">Name: {nft.metadata.name}</h2>
      <p className="atom-item__generalText">Collection address: {nft.metadata.contract.address}</p>
      <p className="atom-item__generalText">Collection name: {nft.metadata.contract.name}</p>
      <p className="atom-item__generalText">Seller address: {sellerAddress}</p>
      <p className="atom-item__generalText">Owner: {sellerAddress}</p>
      <p className="atom-item__generalText">Original supply: {nft.supply}</p>
      <p className="atom-item__generalText">Available supply: {nft.supply - nft.mintedTokens}</p>
      <p className="atom-item__generalText">Minted NFTs: {nft.mintedTokens}</p>
      {nft.metadata.attributes.slice(0, 6).map((attribute, index) => {
        return (
          <div className="atom-item__attributeCardContainer" key={index}>
            <div className="atom-item__attributeText">Type: {attribute.type}</div>
            <div className="atom-item__attributeText">Name: {attribute.name}</div>
            <div className="atom-item__attributeText">Value: {attribute.value}</div>
          </div>
        );
      })}
      <div className="game-shop__inputContainer">
        <input
          className="game-shop__input"
          placeholder="Quantity"
          type="text"
          onChange={(event) => {
            setAmount(Math.floor(event.target.value).toString());
          }}
        />
        <button className="atom-item__button">Buy</button>
      </div>
      <ErrorMessage
        error={errorMessage}
        isOpen={errorMessage}
        onClose={onCloseErrorMessage}
      />
    </form>
  );
};

export default Item;
