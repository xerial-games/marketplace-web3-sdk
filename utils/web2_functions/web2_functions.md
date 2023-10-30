### 1 - getGameStudioCollections:
Fetch collections from the Game Studio.
**Example:**
```json
{
    "studioAddress": "0xD3A7EF9D79214K78542d9A5AD5BE8395820617d36",
    "collections": [
        {
            "_id": "6532a2434bf23c6c7551a56f",
            "collectionName": "Armas",
            "collectionAddress": "0x4Ee540daA6ecA698B2dDd25373784594B8f82949",
            "collectionId": 52062,
            "studioAddress": "0xD3A7EF9D79214K78542d9A5AD5BE8395820617d36",
            "chain": "MATIC",
            "chainId": 80001
        },
        {
            "_id": "6532d22d4bf23c6c7551a575",
            "collectionName": "Armaduras",
            "collectionAddress": "0x69d15af4AbdEE837462A05c71Ba1466033dcE6d6",
            "collectionId": 52064,
            "studioAddress": "0xD3A7EF9D79214K78542d9A5AD5BE8395820617d36",
            "chain": "MATIC",
            "chainId": 80001
        },
        {
            "_id": "65367f08757284ab59920ff8",
            "collectionName": "Decoracion",
            "collectionAddress": "0xf561bD83E7f49Ef6bFD9704e258Ee34f5b83026b",
            "collectionId": 52172,
            "studioAddress": "0xD3A7EF9D79214K78542d9A5AD5BE8395820617d36",
            "chain": "MATIC",
            "chainId": 80001
        },
        {
            "_id": "6536879cacccab1ec875f7f8",
            "collectionName": "Armors",
            "collectionAddress": "0x1A911115D1b539e3CE4de2c211f52E98147079eE",
            "collectionId": 52206,
            "studioAddress": "0xD3A7EF9D79214K78542d9A5AD5BE8395820617d36",
            "chain": "MATIC",
            "chainId": 80001
        },
        {
            "_id": "65390b07d49e93c93b4188f8",
            "collectionName": "Collection local",
            "collectionAddress": "0x72aa352F1061C7bC203Ac09E281A9c3cd4a97f69",
            "collectionId": 52470,
            "studioAddress": "0xD3A7EF9D79214K78542d9A5AD5BE8395820617d36",
            "chain": "MATIC",
            "chainId": 80001
        }
    ]
}
```


### 2 - getNftMetadata:
Fetch metadata from the NFT.
**Example:**
```json
[
    {
        "collectionId": 52486,
        "nftId": "4",
        "metadata": {
            "name": "NFT 1",
            "description": "Desc",
            "image": "https://any-image.jpg",
            "imagePreview": "https://any-image.jpg",
            "imageThumbnail": "https://any-image.jpg",
            "backgroundColor": "#9d1b1b",
            "background_color": "#9d1b1b",
            "externalUrl": "https://www.google.com",
            "external_url": "https://www.google.com",
            "animationUrls": [],
            "attributes": [
                {
                    "type": "system",
                    "name": "tokenTypeId",
                    "value": "1",
                    "traitType": "Token Type ID",
                    "trait_type": "Token Type ID"
                },
                {
                    "type": "property",
                    "name": "maxSupply",
                    "value": "3",
                    "traitType": "Max Supply",
                    "trait_type": "Max Supply"
                },
                {
                    "type": "property",
                    "name": "mintNumber",
                    "value": "3",
                    "traitType": "Mint Number",
                    "trait_type": "Mint Number"
                }
            ],
            "contract": {
                "address": "0xc5008c17dc337500a59a7999818a07f2f98cf744",
                "name": "Armas 22",
                "symbol": "JJK",
                "image": "https://any-image.jpg",
                "imageUrl": "https://any-image.jpg",
                "image_url": "https://any-image.jpg",
                "description": "Desc",
                "externalLink": "https://www.google.com",
                "external_link": "https://www.google.com",
                "externalUrl": "https://www.google.com",
                "external_url": "https://www.google.com",
                "media": [],
                "type": "ERC_1155"
            },
            "fungible": false
        }
    },
    {
        "collectionId": 52486,
        "nftId": "2",
        "metadata": {
            "name": "NFT 1",
            "description": "Desc",
            "image": "https://any-image.jpg",
            "imagePreview": "https://any-image.jpg",
            "imageThumbnail": "https://any-image.jpg",
            "backgroundColor": "#9d1b1b",
            "background_color": "#9d1b1b",
            "externalUrl": "https://www.google.com",
            "external_url": "https://www.google.com",
            "animationUrls": [],
            "attributes": [
                {
                    "type": "system",
                    "name": "tokenTypeId",
                    "value": "1",
                    "traitType": "Token Type ID",
                    "trait_type": "Token Type ID"
                },
                {
                    "type": "property",
                    "name": "maxSupply",
                    "value": "3",
                    "traitType": "Max Supply",
                    "trait_type": "Max Supply"
                },
                {
                    "type": "property",
                    "name": "mintNumber",
                    "value": "1",
                    "traitType": "Mint Number",
                    "trait_type": "Mint Number"
                }
            ],
            "contract": {
                "address": "0xc5008c17dc337500a59a7999818a07f2f98cf744",
                "name": "Armas 22",
                "symbol": "JJK",
                "image": "https://any-image.jpg",
                "imageUrl": "https://any-image.jpg",
                "image_url": "https://any-image.jpg",
                "description": "Desc",
                "externalLink": "https://www.google.com",
                "external_link": "https://www.google.com",
                "externalUrl": "https://www.google.com",
                "external_url": "https://www.google.com",
                "media": [],
                "type": "ERC_1155"
            },
            "fungible": false
        }
    }
]
```

### 3 - getUserInventory:
Fetch the user's inventory.
**Example:**
```json
{
    <!-- collectionAddress -->
    "0x4Ee540daA6ecA698B2dDd25373784594B8f82949": {
        "2": 1,
        "3": 1,
        "5": 0,
        "6": 0,
        "8": 1,
        "9": 1,
        "10": 0,
        "35": 1,
        <!-- collection name -->
        "name": "Armas"
    },
    <!-- collectionAddress -->
    "0x69d15af4AbdEE837462A05c71Ba1466033dcE6d6": {
        <!-- A: tokenId & B: "1" signifies that the user has the item, and "0" indicates they do not. -->
        "2": 1,
        "3": 1,
        "name": "Armaduras"
    },
    <!-- collectionAddress -->
    "0x1A911115D1b539e3CE4de2c211f52E98147079eE": {
        "2": 1,
        "3": 1,
        "name": "Armors"
    }
}
```

### 4 - loadAllMetadata:
Fetch all metadata for NFTs from collections and set the result using setAllNftsMetadata.
**Example:**

```json
[
    {
        "collectionId": 52062,
        "nftId": "6",
        "metadata": {
            "name": "23",
            "description": "23",
            "image": "https://any-image.jpg",
            "imagePreview": "https://any-image.jpg",
            "imageThumbnail": "https://any-image.jpg",
            "backgroundColor": "#794e4e",
            "background_color": "#794e4e",
            "animationUrl": "https://any-image.jpg",
            "animation_url": "https://any-image.jpg",
            "externalUrl": "https://www.google.com",
            "external_url": "https://www.google.com",
            "animationUrls": [
                {
                    "type": "video",
                    "value": "https://any-image.jpg"
                },
                {
                    "type": "audio",
                    "value": "https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_10MG.wav"
                }
            ],
            "attributes": [
                {
                    "type": "stat",
                    "name": "Armadura",
                    "value": "22",
                    "displayType": "number",
                    "display_type": "number",
                    "traitType": "Armadura",
                    "trait_type": "Armadura"
                },
                {
                    "type": "system",
                    "name": "tokenTypeId",
                    "value": "4",
                    "traitType": "Token Type ID",
                    "trait_type": "Token Type ID"
                },
                {
                    "type": "property",
                    "name": "maxSupply",
                    "value": "2",
                    "traitType": "Max Supply",
                    "trait_type": "Max Supply"
                },
                {
                    "type": "property",
                    "name": "mintNumber",
                    "value": "2",
                    "traitType": "Mint Number",
                    "trait_type": "Mint Number"
                }
            ],
            "contract": {
                "address": "0x4ee540daa6eca698b2ddd25373784594b8f82949",
                "name": "Armas",
                "symbol": "LOS",
                "image": "https://any-image.jpg",
                "imageUrl": "https://any-image.jpg",
                "image_url": "https://any-image.jpg",
                "description": "Desc",
                "externalLink": "https://www.google.com",
                "external_link": "https://www.google.com",
                "externalUrl": "https://www.google.com",
                "external_url": "https://www.google.com",
                "media": [],
                "type": "ERC_1155"
            },
            "fungible": false
        }
    },
    {
        "collectionId": 52062,
        "nftId": "2",
        "metadata": {
            "name": "AK47",
            "description": "Desc",
            "image": "https://any-image.jpg",
            "imagePreview": "https://any-image.jpg",
            "imageThumbnail": "https://any-image.jpg",
            "backgroundColor": "#d90202",
            "background_color": "#d90202",
            "animationUrl": "https://any-image.jpg",
            "animation_url": "https://any-image.jpg",
            "externalUrl": "https://www.google.com",
            "external_url": "https://www.google.com",
            "animationUrls": [
                {
                    "type": "video",
                    "value": "https://any-image.jpg"
                },
                {
                    "type": "audio",
                    "value": "https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_10MG.wav"
                }
            ],
            "attributes": [
                {
                    "type": "property",
                    "name": "munition",
                    "value": "100",
                    "traitType": "munition",
                    "trait_type": "munition"
                },
                {
                    "type": "property",
                    "name": "Damage",
                    "value": "100",
                    "traitType": "Damage",
                    "trait_type": "Damage"
                },
                {
                    "type": "property",
                    "name": "Speed",
                    "value": "fast",
                    "traitType": "Speed",
                    "trait_type": "Speed"
                },
                {
                    "type": "boost",
                    "name": "Extra Damage",
                    "value": "100% in 1v1",
                    "displayType": "boost_number",
                    "display_type": "boost_number",
                    "traitType": "Extra Damage",
                    "trait_type": "Extra Damage"
                },
                {
                    "type": "system",
                    "name": "tokenTypeId",
                    "value": "1",
                    "traitType": "Token Type ID",
                    "trait_type": "Token Type ID"
                },
                {
                    "type": "property",
                    "name": "maxSupply",
                    "value": "2",
                    "traitType": "Max Supply",
                    "trait_type": "Max Supply"
                },
                {
                    "type": "property",
                    "name": "mintNumber",
                    "value": "1",
                    "traitType": "Mint Number",
                    "trait_type": "Mint Number"
                }
            ],
            "contract": {
                "address": "0x4ee540daa6eca698b2ddd25373784594b8f82949",
                "name": "Armas",
                "symbol": "LOS",
                "image": "https://any-image.jpg",
                "imageUrl": "https://any-image.jpg",
                "image_url": "https://any-image.jpg",
                "description": "Desc",
                "externalLink": "https://www.google.com",
                "external_link": "https://www.google.com",
                "externalUrl": "https://www.google.com",
                "external_url": "https://www.google.com",
                "media": [],
                "type": "ERC_1155"
            },
            "fungible": false
        }
    },
]
```