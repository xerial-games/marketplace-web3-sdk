import web3Functions from "@/utils/web3_functions/web3_functions";

const InventoryItemOnSecondaryMarket = ({ nft }) => {
  async function onDelistNft() {
    await web3Functions.delistNftOnSecondaryMarket({ marketplaceNftId: nft.marketItemId });
  }

  return (
    <div className="inventory-items__container">
      <div className="inventory-items__projectContainer">
        <img src={nft.metadata.image} alt={nft.metadata.name} className="inventory-items__image" />
        <h1>Nft marketItemId: {nft.marketItemId}</h1>
        <h2>Nft name: {nft.metadata.name}</h2>
        <p>collectionAddress: {nft.metadata.contract.address}</p>
        <p>collectionName: {nft.metadata.contract.name}</p>
        <p className="atom-item__generalText atom-item__priceMagenta">Price: {nft.price} USDC</p>
      </div>
      <button className="inventory-items__buttonSell" type="submit" onClick={onDelistNft}>
        Delist
      </button>
    </div>
  );
};

export default InventoryItemOnSecondaryMarket;
