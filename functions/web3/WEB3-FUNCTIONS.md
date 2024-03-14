### 1 - purchaseNfts:

Allows the player to buy NFTs on the Primary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| tokenTypeId       | The typeId of the NFT.                           |
| amount            | The amount the player wants to purchase.         |
| collectionAddress | The collection address of the NFT.               |
| chain             | The blockchain where the NFT is being purchased. |
| price             | The price of the NFT.                            |

### 1 - purchaseNft:

Allows the player to buy NFTs on the Primary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| tokenTypeId       | The typeId of the NFT.                           |
| amount            | The amount the player wants to purchase.         |
| chain             | The blockchain where the NFT is being purchased. |
| collectionAddress | The collection address of the NFT.               |
| price             | The price of the NFT.                            |

### 2 - secondaryMarketPurchase:

Allows the player to buy NFTs on the Secondary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| marketplaceNftId  | The marketplaceNftId of the NFT to be purchased. |
| chain             | The blockchain where the NFT is being purchased. |
| price             | The price of the NFT to be purchased.            |

### 3 - sellNftOnSecondaryMarket:

Allows the player to list NFT on the Secondary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| collectionAddress | The collection address of the NFT.               |
| tokenId           | The tokenId of the NFT to be listed.             |
| price             | The price of the NFT to be listed.               |

### 4 - delistNftOnSecondaryMarket:

Allows the player to delist NFT on the Secondary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| tokenTypeId       | The typeId of the NFT.                           |
| amount            | The amount the player wants to purchase.         |
| collectionAddress | The collection address of the NFT.               |