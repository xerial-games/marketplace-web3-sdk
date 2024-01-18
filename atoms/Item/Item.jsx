import web3Functions from "@/utils/web3_functions/web3_functions";
import { useEffect, useState } from "react";

const Item = ({ nft, sellerAddress, XerialWalletViewmodel }) => {
  const [amount, setAmount] = useState("");
  const [loguedWith, setLoguedWith] = useState("");

  useEffect(() => {
    XerialWalletViewmodel.observer.observe(() => {
      setLoguedWith(XerialWalletViewmodel.loguedWith || "");
    }, []);
  }, []);

  return (
    <form
      className="atom-item__box"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!amount || amount <= 0) {
          console.error("Please Set a Valid Amount");
          return;
        }
        if (loguedWith === "google") {
          await XerialWalletViewmodel.purchaseNfts({
            tokenTypeId: nft.typeId,
            quantity: amount,
            collectionAddress: nft.metadata.contract.address,
          });
        } else {
          await web3Functions.purchaseNfts({
            tokenTypeId: nft.typeId,
            collectionAddress: nft.metadata.contract.address,
            amount: amount,
          });
        }
      }}
    >
      <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
      <h1 className="atom-item__generalText global-style__textWithDots">Token typeId: {nft.typeId}</h1>
      <h2 className="atom-item__generalText global-style__textWithDots">Token name: {nft.metadata.name}</h2>
      <p className="atom-item__generalText">Collection address: {nft.metadata.contract.address}</p>
      <p className="atom-item__generalText">Collection name: {nft.metadata.contract.name}</p>
      <p className="atom-item__generalText">Seller address: {sellerAddress}</p>
      <p className="atom-item__generalText">Owner: {sellerAddress}</p>
      <p className="atom-item__generalText">Original supply: {nft.supply}</p>
      <p className="atom-item__generalText">Available supply: {nft.supply - nft.mintedTokens}</p>
      <p className="atom-item__generalText">Minted NFTs: {nft.mintedTokens}</p>
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
      <div className="game-shop__inputContainer">
        <input
          className="game-shop__input"
          type="text"
          onChange={(event) => {
            setAmount(Math.floor(event.target.value).toString());
          }}
        />
        <button className="atom-item__button">Buy</button>
      </div>
    </form>
  );
};

export default Item;
