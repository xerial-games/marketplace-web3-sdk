import { callApi, errorsManager } from "@/functions/callApi";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_HOST;
const web2Functions = {};

// Obtain the collections from the Game Studio
web2Functions.getGameStudioCollections = async ({ projectId }) => {
  const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/get_collections_from_project`, { projectId });
  return await errorsManager(response);
};

// Obtain the user's inventory
web2Functions.getInventory = async ({ address, studioAddress, chain }) => {
  try {
    const response = await callApi(`${apiBaseUrl}/get_inventory`, {
      studioAddress,
      address,
      chain,
    });
    const resjson = await errorsManager(response);
    return resjson;
  } catch (error) {
    console.error("Error in getInventory function. Reason: " +  error.message);
    throw new Error("Error: Get Inventory Failed");
  }
};

// Obtain the NFTs listed in the Primary Market.
web2Functions.getListedNfts = async function ({ chain, projectId }) {
  const response = await callApi(`${apiBaseUrl}/get_listed_nfts`, {
    chain,
    projectId,
  });
  const resjson = await errorsManager(response);
  return resjson;
};

// Obtain the NFTs listed in the secondary market.
web2Functions.getListedNftsOnSecondaryMarket = async function ({ chain, projectAddress }) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
    const raw = JSON.stringify({
      chain,
      studioAddress: projectAddress,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    });
    const resjson = await response.json();
    return resjson;
  } catch (error) {
    console.error("Error in getListedNftsOnSecondaryMarket function. Reason: " +  error.message);
    throw new Error(error.message);
  }
};

// Obtain the specific player NFTs listed in the Secondary Market.
web2Functions.getPlayerItemsOnSecondaryMarket = async function ({ chain, userAddress, studioAddress }) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
    const raw = JSON.stringify({
      chain,
      seller: userAddress,
      studioAddress
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    });
    const resjson = await response.json();
    if (response.status.toString()[0] != "2") throw resjson;
    return resjson;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtain information about your project using the configured project domain in the Dashboard.
web2Functions.getProjectForDomain = async function ({ projectDomain }) {
  const response = await callApi(`${apiBaseUrl}/get_project_for_marketplace`, {
    projectDomain,
  });
  const resjson = await errorsManager(response);
  return resjson;
};

// Obtain all the necessary data for authentication.
web2Functions.loginWithGoogle = async function ({ credential, clientId, projectId }) {
  try {
    if (!projectId) throw new Error("Project Not Found");
    const raw = JSON.stringify({ token: credential, clientId, projectId });
    const resAuth = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/google`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resjsonAuth = await errorsManager(resAuth);
    if (resjsonAuth.refresh && resjsonAuth.access) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${resjsonAuth.access.token}`,
        },
      });
      const userResjson = await response.json();
      return {
        sessionToken: resjsonAuth.access.token,
        tokens: resjsonAuth,
        player: userResjson.user,
        wallets: userResjson.wallets,
        loguedWith: "google",
      };
    } else throw new Error("Auth Tokens Not Found");
  } catch (error) {
    console.error(error);
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(error);
  }
};

web2Functions.logout = async function () {};

// Allows the player to buy NFTs on the Primary Market with Xerial Wallet.
web2Functions.primaryPurchaseWithXerialWallet = async function ({ tokenTypeId, quantity, collectionAddress, userAddress, sessionToken }) {
  try {
    if (!userAddress) throw new Error("User Wallet Not Found");
    if (!sessionToken) throw new Error("Session Token Not Found");
    const raw = JSON.stringify({
      typeId: tokenTypeId,
      quantity,
      collectionAddress,
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/primary-purchase`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    return await errorsManager(response);
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(error);
  }
};

// Allow the player to buy NFTs on Secondary Market with Xerial Wallet.
web2Functions.secondaryPurchaseWithXerialWallet = async function ({ marketItemId, userAddress, sessionToken }) {
  try {
    if (!userAddress) throw new Error("User Wallet Not Found");
    const raw = JSON.stringify({ marketItemId });
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/secondary-purchase`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    return await errorsManager(response);
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(error);
  }
};

// Allow the player to delist NFTs on Secondary Market with Xerial Wallet.
web2Functions.delistNftOnSecondaryMarket = async function ({ marketItemId, userAddress, sessionToken }) {
  try {
    if (!userAddress) throw new Error("User Wallet Not Found");
    const raw = JSON.stringify({ marketItemId });
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/delist-nft`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    return await errorsManager(response);
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(error);
  }
};

// Allow the player to list NFTs on Secondary Market with Xerial Wallet.
web2Functions.listNftOnSecondaryMarket = async function ({ collectionAddress, tokenId, price, userAddress, sessionToken }) {
  try {
    if (!userAddress) throw new Error("User Wallet Not Found");
    const raw = JSON.stringify({ collectionAddress, tokenId, price });
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/list-nft`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    return await errorsManager(response);
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(error);
  }
};

// Allow the player to list NFTs on Secondary Market with Xerial Wallet.
web2Functions.transferNft = async function ({ collectionAddress, tokenId, to, userAddress }) {
  try {
    if (!userAddress) throw new Error("User Wallet Not Found");
    const raw = JSON.stringify({ collectionAddress, tokenId, to });
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/transfer-nft`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${vm.sessionToken}`,
      },
    });
    return await errorsManager(response);
  } catch (error) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(error);
  }
};

// Obtain Matic balance of a specific user.
web2Functions.getMaticBalance = async function ({ userAddress, chain }) {
  if (!userAddress) throw new Error("User Wallet Not Found");
  const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/${chain}/eth`);
  const resjson = await errorsManager(response);
  if (!resjson.balance) throw new Error("Error to get MATIC balance");
  return Number(resjson.balance);
};

// REVIEW: can this be deleted? cc @RichardIrala
/*
  // web2Functions.transferMatic = async function () {}
  // web2Functions.transferUsdc = async function () {}
*/

export default web2Functions;
