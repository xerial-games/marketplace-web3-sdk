import web3Functions from "@/utils/web3_functions/web3_functions";
import { useEffect, useState } from "react";

const SecondaryMarketItem = ({ nft, sellerAddress, XerialWalletViewmodel }) => {
  return (
    <form
      className="atom-item__box"
      onSubmit={async (event) => {
        event.preventDefault();
      }}
    >
      <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
      <h1 className="atom-item__generalText global-style__textWithDots">Token Id: {nft.tokenId}</h1>
      <h2 className="atom-item__generalText global-style__textWithDots">Token name: {nft.metadata.name}</h2>
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
      <button
        className="atom-item__button"
        onClick={async () => {
          if (XerialWalletViewmodel.loguedWith === "google") {
            await XerialWalletViewmodel.secondaryPurchase({
              marketItemId: nft.marketItemId.toString(),
            });
          } else
            await web3Functions.secondaryMarketPurchase({
              marketplaceNftId: nft.marketItemId.toString(),
            });
        }}
      >
        Buy
      </button>
    </form>
  );
};

export default SecondaryMarketItem;
