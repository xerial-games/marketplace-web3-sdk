import { callApi, errorsManager } from "../call_api_functions";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_HOST;
const web2Functions = {};

web2Functions.getGameStudioCollections = async ({ projectId }) => {
  const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/get_collections_from_project`, { projectId });
  return await errorsManager(response);
};

// Chain can be "polygon"
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
    throw new Error("Error: Get Inventory Failed");
  }
};

web2Functions.getListedNfts = async function ({ chain, projectId }) {
  const response = await callApi(`${apiBaseUrl}/get_listed_nfts`, {
    chain,
    projectId,
  });
  const resjson = await errorsManager(response);
  return resjson;
};

// Chain can be "polygon"
web2Functions.getListedNftsOnSecondaryMarket = async function ({ chain, projectAddress }) {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
  const raw = JSON.stringify({
    studioAddress: projectAddress,
    chain,
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
};

// Chain can be "polygon"
web2Functions.getPlayerItemsOnSecondaryMarket = async function ({ chain, userAddress }) {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
  const raw = JSON.stringify({
    seller: userAddress,
    chain,
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
};

web2Functions.getProjectForDomain = async function ({ projectDomain }) {
  const response = await callApi(`${apiBaseUrl}/get_project_for_marketplace`, {
    projectDomain,
  });
  const resjson = await errorsManager(response);
  return resjson;
};

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

// Purchase in primary market
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

web2Functions.secondaryPurchaseWithXerialWallet = async function ({ marketItemId, sessionToken, userAddress }) {
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

web2Functions.getMaticBalance = async function ({ userAddress }) {
  if (!userAddress) throw new Error("User Wallet Not Found");
  const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/eth`);
  const resjson = await errorsManager(response);
  if (!resjson.balance) throw new Error("Error to get MATIC balance");
  return Number(resjson.balance);
};

web2Functions.getUsdcBalance = async function ({ userAddress }) {
  if (!userAddress) throw new Error("User Wallet Not Found");
  const resTokens = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/tokens`);
  const resjsonTokens = await errorsManager(resTokens);
  if (!resjsonTokens.balances) throw new Error("Error to get USDC balance");
  return Number(resjsonTokens.balances.usdc);
};

// web2Functions.transferMatic = async function () {}

// web2Functions.transferUsdc = async function () {}

export default web2Functions;
