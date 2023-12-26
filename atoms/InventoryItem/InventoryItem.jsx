import { useState } from "react";

const handleWheel = () => {
  window.document.activeElement.blur()
};

const InventoryItem = ({ nft }) => {
  const [price, setPrice] = useState("");

  function onChangePrice (value) {
    setPrice(value);
  }

  async function handleSubmit (event) {
    event.preventDefault();
    // await onSellNft(tokenId, collectionAddress, price); Please don't use this in this moment. This need update.
  }

  return (
    <div style={{ backgroundColor: "rgb(59, 109, 152)", padding: 10, display: "flex", flexDirection: "column", gap: 12, width: 600 }}>
      <h1>Nft typeId: {nft.typeId}</h1>
      <h2>Nft name: {nft.metadata.name}</h2>
      <img src={nft.metadata.image} alt={nft.metadata.name} style={{width: 300, height: "auto"}}/>
      <p>collectionAddress: {nft.metadata.contract.address}</p>
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