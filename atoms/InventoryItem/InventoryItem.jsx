import marketplaceFunctions from "@/web3_functions";
import { useEffect, useState } from "react";

const handleWheel = () => {
  window.document.activeElement.blur()
};

const InventoryItem = ({ tokenId, metadata, collectionAddress, onSellNft }) => {
  const [price, setPrice] = useState("");

  function onChangePrice (value) {
    setPrice(value);
  }

  async function handleSubmit (event) {
    event.preventDefault();
    await onSellNft(tokenId, collectionAddress, price);
  }

  return (
    <div style={{ backgroundColor: "rgb(59, 109, 152)", padding: 10, display: "flex", flexDirection: "column", gap: 12, width: 600 }}>
      <h1>Token Id: {tokenId}</h1>
      <h2>Token name: {!metadata || !metadata?.metadata ? "loading..." : metadata.metadata.name}</h2>
      {metadata && <img src={metadata.metadata.image} alt={metadata.metadata.name} style={{width: 300, height: "auto"}}/>}
      <p>collectionAddress: {collectionAddress}</p>
      <form className="inventory-items__form" onSubmit={handleSubmit}>
        <label className="inventory-items__itemLabelForInput">
          <span className="inventory-items__itemInputWithLabelTitle">Price</span>
          <input
            className="inventory-items__itemInputWithLabelInput"
            name="price"
            type="number" placeholder="N"
            defaultValue={""}
            onChange={(e) => onChangePrice(e.target.value)}
            onWheel={handleWheel}
          />
        </label>
        <button className="inventory-items__buttonSell" type="submit">
          Sell
        </button>
      </form>
    </div>
  )
}

export default InventoryItem;