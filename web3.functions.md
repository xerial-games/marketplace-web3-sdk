1 - listings retorna información de un tokenId particular.

2 - getListedNfts retorna un JSON con este estilo:

[
    {
        <!-- Collection address -->
        "0x89fDe0eF0d26469406544f2e162B13d5813e660F": {
            "tokensListedPrimaryMarket": [],
            "tokensListedSecundaryMarket": []
        }
    },
    {
        <!-- Collection Address -->
        "0xC5008C17dc337500A59a7999818a07f2F98CF744": {
            "tokensListedPrimaryMarket": [
                <!-- tokenIds -->
                "4",
                "2"
            ],
            "tokensListedSecundaryMarket": []
        }
    }
]

## 3 - getNftMetadata retorna un JSON con este estilo:
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
