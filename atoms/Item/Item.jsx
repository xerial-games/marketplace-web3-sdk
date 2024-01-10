import web3Functions from "@/utils/web3_functions/web3_functions";
import { useEffect, useState } from "react";

const Item = ({ nft, XerialWalletViewmodel }) => {
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
          console.error("Please set a valid amount.");
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
      <h1 className="global-style__textWithDots">Token typeId: {nft.typeId}</h1>
      <h2 className="global-style__textWithDots">Token name: {nft.metadata.name}</h2>
      <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
      <p className="atom-item__generalText">collectionAddress: {nft.metadata.contract.address}</p>
      <p className="atom-item__generalText">supply: {nft.supply - nft.mintedTokens}</p>
      <p className="atom-item__generalText">price: {nft.price}</p>
      <input
        type="text"
        onChange={(event) => {
          setAmount(Math.floor(event.target.value).toString());
        }}
      />
      <button className="atom-item__button">Buy</button>
    </form>
  )
}

export default Item;