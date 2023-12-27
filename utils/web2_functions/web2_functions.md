### 1 - getGameStudioCollections:
Obtain the collections from the Game Studio.

| Param     | Description                                             |
|-----------|---------------------------------------------------------|
| projectId | The project ID associated with your project.            |

**Response structure:**
```json
{
  "projectId": "6564b4f3fa203b9Klsa2Ju7d0",
  "project": {
    "address": "0x7d78B5a8b04151E0741875c2d6e3Cb6A82098Ac5",
    "network": "polygon",
    "name": "ProyectM",
    "description": "Desc",
    "category": "MMORPG",
    "tokenName": "",
    "tokenLogo": "",
    "logo": "https:///your_project_image.jpg",
    "trailer": "http://www.google.com",
    "downloadLink": "http://www.google.com",
    "userBanner": "https://your_banner.jpg",
    "domain": "your.domain.example",
    "symbol": "NEZ",
    "socialMedias": {
      "_id": "658c2ae20c24dd5e00161a1a"
    },
    "id": "6564b4f3fa203b9Klsa2Ju7d0"
  },
  "collections": [
    {
      "address": "0x8a63860fF851bb1391a295dF717a3bD210eB2170",
      "name": "Desc",
      "symbol": "123",
      "description": "LL",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
      "externalUrl": "http://external-url.com",
      "chain": "polygon",
      "txHash": "0x11bb4d5fadbb9f6ab1b0d1be1bb50c52a5ac997c495e8e29131629e21774e06a",
      "project": "6564b4f3fa203b9Klsa2Ju7d0",
      "id": "6585de73487f1429cb10bcb9"
    },
    {
      "address": "0x11FF517B5e01fd22148F085FcA04F707d5b6e4DC",
      "name": "DS",
      "symbol": "23",
      "description": "Description",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/2940477b2bead3482008d9be12f37a6b0c4f2372d47104a322be3e7e59f31e18-tanjiro.jpg",
      "externalUrl": "http://external-url.com",
      "chain": "polygon",
      "txHash": "0x83a2d2ec69755693cc98766cd3ac1c9a697beec45aa8496a2bddba3d27ee7f7c",
      "project": "6564b4f3fa203b9Klsa2Ju7d0",
      "id": "6585deb8487f1429cb10bcdc"
    }
  ]
}
```


### 2 - getInventory:

Obtain the user's inventory.

| Param          | Description                                 |
|----------------|---------------------------------------------|
| address        | The address of the user.                    |
| studioAddress  | The address of the Game Studio to get NFTs. |
| chain          | Can be "polygon" or "telos".                |

**Response structure:**
```json
[
  {
    "collection": {
      "id": "6585de73487f1429cb10bcb9",
      "txHash": "0x11bb4d5fadbb9f6ab1b0d1be1bb50c52a5ac997c495e8e29131629e21774e06a"
    },
    "quantity": 1,
    "metadata": {
      "name": "Tanjiro",
      "description": "Desc",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
      "externalUrl": "https://www.google.com",
      "animationUrls": [],
      "attributes": [
        {
          "type": "boost",
          "name": "magical damage",
          "value": "2000"
        }
      ],
      "contract": {
        "address": "0x8a63860fF851bb1391a295dF717a3bD210eB2170",
        "name": "Desc",
        "symbol": "123",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
        "description": "LL",
        "externalUrl": "https://xerial.io/"
      },
      "maxSupply": "3",
      "edition": 1
    },
    "tokens": [
      {
        "0": {
          "type": "BigNumber",
          "hex": "0x01"
        },
        "1": "https://purple-jealous-spoonbill-384.mypinata.cloud/ipfs/QmS2ErVJV7tp9YFGmSVahEjEzP5uzpub6MTRawnXpJDYJc",
        "tokenId": 1,
        "metadataURI": "https://purple-jealous-spoonbill-384.mypinata.cloud/ipfs/QmS2ErVJV7tp9YFGmSVahEjEzP5uzpub6MTRawnXpJDYJc"
      }
    ]
  }
]
```

### 3 - getListedNfts:

Obtain the NFTs listed in the primary market.

| Param       | Description                                           |
|-------------|-------------------------------------------------------|
| projectId   | The project ID associated with your project.          |
| chain       | Can be "polygon" or "telos". 													|

**Response structure:**
```json
[
  {
    "id": "6585de99487f1429cb10bcc8",
    "typeId": 1,
    "supply": 3,
    "price": 1,
    "inSale": true,
    "metadata": {
      "name": "Tanjiro",
      "description": "NFT description",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
      "externalUrl": "https://www.google.com",
      "animationUrls": [],
      "attributes": [
        {
          "type": "boost",
          "name": "magical damage",
          "value": "222"
        }
      ],
      "contract": {
        "address": "0x8a63860fF851bb1391a295dF717a3bD210eB2170",
        "name": "NFT description",
        "symbol": "NZH",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
        "description": "Contract description",
        "externalUrl": "https://www.youtube.com/"
      },
      "maxSupply": "3",
      "edition": 1
    },
    "mintedTokens": 1
  },
  {
    "id": "6585dedd487f1429cb10bcf1",
    "typeId": 1,
    "supply": 23,
    "price": 1,
    "inSale": true,
    "metadata": {
      "name": "First NFT",
      "description": "Description",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/450ebc6038f65cb00973c284b893eec10c09cde7a1fd05edce21fa06493c9412-nezuko.jpg",
      "externalUrl": "https://www.youtube.com/",
      "animationUrls": [],
      "attributes": [
        {
          "type": "property",
          "name": "armor",
          "value": "200"
        }
      ],
      "contract": {
        "address": "0x11FF517B5e01fd22148F085FcA04F707d5b6e4DC",
        "name": "DS",
        "symbol": "23",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/2940477b2bead3482008d9be12f37a6b0c4f2372d47104a322be3e7e59f31e18-tanjiro.jpg",
        "description": "Contract description.",
        "externalUrl": "https://www.youtube.com/"
      },
      "maxSupply": "23",
      "edition": 1
    },
    "mintedTokens": 0
  }
]

```

### 4 - getProjectForDomain:

Obtain information about your project using the configured project domain in the Dashboard.

| Param           | Description                                           |
|-----------------|-------------------------------------------------------|
| projectDomain   | The project domain associated with your project.  		|

**Response stucture:**

```json
{
  "project": {
    "id": "6564b4f3fa203b318f65da05",
    "address": "0x7d78B5a8b04151E0741875c2d6e3Cb6A8207jK8a",
    "name": "Special project",
    "description": "Project description",
    "category": "MMORPG",
    "tokenName": "",
    "tokenLogo": "",
    "userBanner": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/46935ee6d252d9510a71cd7452dadcb06aa6ad73433f4c3e642c541c138a436e-game%20banner.jpg",
    "logo": "https://xerial-main-bucket.s3.amazonaws.com/450ebc6038f65cb00973c284b893eec10c09cde7a1fd05edce21fa06493c9412-nezuko.jpg",
    "trailer": "http://www.google.com",
    "downloadLink": "http://www.google.com",
    "socialMedias": {
      "twitter": "https://twitter.com/xerial",
      "instagram": "https://instagram.com/xerial",
      "discord": "https://discord.gg/r9s9cz",
      "linkedin": "https://linkedin.com/in/xerial",
      "_id": "658c3cc10c24dd5e00161a34"
    },
    "symbol": "SPJ",
    "domain": "xerial.io"
  }
}
```