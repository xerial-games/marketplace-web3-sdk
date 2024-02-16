import web3Functions from "@/functions/web3/web3";
import { useState } from "react";

const handleWheel = () => {
  window.document.activeElement.blur();
};

function validateNumberWithDecimals(number) {
  // The regular expression allows up to 6 decimals, including the optional decimal point
  const regex = /^\d+(\.\d{0,6})?$/;
  return regex.test(number);
}

const InventoryItem = ({ nft, tokenId, activeChain }) => {
  const [price, setPrice] = useState("");

  function onChangePrice(value) {
    if (!isNaN(value) && parseFloat(value) >= 0) {
      if (!validateNumberWithDecimals(value)) {
        console.error("You can't exced 6 decimals");
        setPrice(0);
      } else {
        setPrice(value);
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!price) {
      alert("Please set a valid price");
    } else await web3Functions.sellNftOnSecondaryMarket({ collectionAddress: nft.metadata.contract.address, tokenId, price, chain: activeChain });
  }

  return (
    <div className="inventory-items__container">
      <div className="inventory-items__projectContainer">
        <img src={nft.metadata.image} alt={nft.metadata.name} className="inventory-items__image" />
        <p className="atom-item__generalText">TokenId: {tokenId}</p>
        <h2 className="atom-item__generalText global-style__textWithDots">Name: {nft.metadata.name}</h2>
        <p className="atom-item__generalText">Collection address: {nft.metadata.contract.address}</p>
        <p className="atom-item__generalText">Collection name: {nft.metadata.contract.name}</p>
      </div>
      <form className="game-shop__inputContainer" onSubmit={handleSubmit}>
        <label className="inventory-items__itemLabelForInput">
          <input className="game-shop__input" name="price" type="text" placeholder="Price" defaultValue={""} onChange={(e) => onChangePrice(e.target.value)} onWheel={handleWheel} />
        </label>
        <button className="atom-item__button">Sell</button>
      </form>
    </div>
  );
};

export default InventoryItem;
