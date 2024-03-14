const marketplaceABI = [
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "_xerialComissionWallet",
			"type": "address"
		}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "CommissionNotAllowed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "IncorrectPaymentAmount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InsufficientFundsForSeller",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InsufficientFundsForStudioComission",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InsufficientFundsForXerialComission",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "MarketItemDoesNotExist",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "MintingFailed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoStock",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotForSale",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PriceMustBeAtLeast1Wei",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "QuantityCannotBeZero",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TierDoesNotExist",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TokenTypeNotExist",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "YouAreNotTheSeller",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "marketItemId",
			"type": "uint256"
		}
		],
		"name": "MarketItemCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "marketItemId",
			"type": "uint256"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "nftContract",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "studio",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "seller",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "price",
			"type": "uint256"
		}
		],
		"name": "MarketItemCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "previousOwner",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "newOwner",
			"type": "address"
		}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "nftContract",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256[]",
			"name": "tokenIds",
			"type": "uint256[]"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "studio",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "buyer",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "unitPrice",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "totalPrice",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "income",
			"type": "uint256"
		}
		],
		"name": "PrimaryPurchase",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "nftContract",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "studio",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "seller",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "buyer",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "price",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "royalty",
			"type": "uint256"
		}
		],
		"name": "SecondaryPurchase",
		"type": "event"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "marketItemId",
			"type": "uint256"
		}
		],
		"name": "cancelMarketItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "nftContractAddress",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		},
		{
			"internalType": "uint256",
			"name": "price",
			"type": "uint256"
		}
		],
		"name": "createMarketItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"components": [
			{
				"internalType": "address",
				"name": "collectionAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenTypeId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
			],
			"internalType": "struct MarketplaceStorage.Drop[]",
			"name": "drops",
			"type": "tuple[]"
		}
		],
		"name": "drop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "seller",
			"type": "address"
		},
		{
			"internalType": "address",
			"name": "studio",
			"type": "address"
		}
		],
		"name": "getMarketItemsBySeller",
		"outputs": [
		{
			"components": [
			{
				"internalType": "uint256",
				"name": "marketItemId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "metadataURI",
				"type": "string"
			}
			],
			"internalType": "struct MarketplaceStorage.MarketItemMetadata[]",
			"name": "",
			"type": "tuple[]"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "studio",
			"type": "address"
		}
		],
		"name": "getMarketItemsByStudio",
		"outputs": [
		{
			"components": [
			{
				"internalType": "uint256",
				"name": "marketItemId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "metadataURI",
				"type": "string"
			}
			],
			"internalType": "struct MarketplaceStorage.MarketItemMetadata[]",
			"name": "",
			"type": "tuple[]"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "studio",
			"type": "address"
		}
		],
		"name": "getStudioComission",
		"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "tier",
			"type": "uint256"
		}
		],
		"name": "getTierComission",
		"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
		],
		"name": "marketItemIdToMarketItem",
		"outputs": [
		{
			"internalType": "uint256",
			"name": "marketItemId",
			"type": "uint256"
		},
		{
			"internalType": "address",
			"name": "nftContractAddress",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tokenId",
			"type": "uint256"
		},
		{
			"internalType": "address",
			"name": "studio",
			"type": "address"
		},
		{
			"internalType": "address",
			"name": "seller",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "price",
			"type": "uint256"
		},
		{
			"internalType": "bool",
			"name": "inSale",
			"type": "bool"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
		{
			"internalType": "address",
			"name": "",
			"type": "address"
		}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
		{
			"components": [
			{
				"internalType": "address",
				"name": "collectionAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenTypeId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
			],
			"internalType": "struct MarketplaceStorage.Purchase[]",
			"name": "purchases",
			"type": "tuple[]"
		}
		],
		"name": "primaryPurchase",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "marketItemId",
			"type": "uint256"
		}
		],
		"name": "secondaryPurchase",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "studio",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "comission",
			"type": "uint256"
		}
		],
		"name": "setStudioComission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "studio",
			"type": "address"
		},
		{
			"internalType": "uint256",
			"name": "tier",
			"type": "uint256"
		}
		],
		"name": "setStudioTier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "uint256",
			"name": "tier",
			"type": "uint256"
		},
		{
			"internalType": "uint256",
			"name": "comission",
			"type": "uint256"
		}
		],
		"name": "setTierComission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "_xerialComissionWallet",
			"type": "address"
		}
		],
		"name": "setXerialComissionWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
		{
			"internalType": "address",
			"name": "newOwner",
			"type": "address"
		}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "xerialComissionWallet",
		"outputs": [
		{
			"internalType": "address",
			"name": "",
			"type": "address"
		}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default marketplaceABI;