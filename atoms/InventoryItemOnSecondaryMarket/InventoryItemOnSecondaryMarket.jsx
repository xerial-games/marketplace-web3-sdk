import web3Functions from "@/utils/web3_functions/web3_functions";

const InventoryItemOnSecondaryMarket = ({ nft }) => {
  async function onDelistNft () {
    await web3Functions.delistNftOnSecondaryMarket({ marketplaceNftId: nft.marketItemId });
  }

  return (
    <div style={{ backgroundColor: "rgb(59, 109, 152)", padding: 10, display: "flex", flexDirection: "column", gap: 12, width: 600 }}>
      <h1>Nft typeId: {nft.typeId}</h1>
      <h2>Nft name: {nft.metadata.name}</h2>
      <img src={nft.metadata.image} alt={nft.metadata.name} style={{width: 300, height: "auto"}}/>
      <p>collectionAddress: {nft.metadata.contract.address}</p>
			<button className="inventory-items__buttonSell" type="submit" onClick={onDelistNft}>
				Delist
			</button>
    </div>
  )
}

export default InventoryItemOnSecondaryMarket;