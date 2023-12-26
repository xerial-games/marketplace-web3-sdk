import web3Functions from "@/utils/web3_functions/web3_functions";
import { useState } from "react";

const Item = ({ nft }) => {
  const [amount, setAmount] = useState("");
  
  return (
    <form
      className="atom-item__box"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!amount || amount <= 0) {
          console.error("Please set a valid amount.");
          return;
        }
        await web3Functions.purchaseNfts({
          tokenTypeId: nft.typeId,
          collectionAddress: nft.metadata.contract.address,
          amount: amount,
        });
      }}
    >
      <h1 className="global-style__textWithDots">Token typeId: {nft.typeId}</h1>
      <h2 className="global-style__textWithDots">Token name: {nft.metadata.name}</h2>
      <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
      <p className="atom-item__generalText">collectionAddress: {nft.metadata.contract.address}</p>
      <p className="atom-item__generalText">price: {nft.supply}</p>
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