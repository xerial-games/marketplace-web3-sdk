import { callApi, errorsManager } from "../call_api_functions";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_HOST;
const web2Functions = {};

web2Functions.getGameStudioCollections = async ({ projectId }) => {
  const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/get_collections_from_project`, { projectId });
  return await errorsManager(response);
}

// Chain can be "polygon"
web2Functions.getInventory = async ({ address, studioAddress, chain }) => {
  try {
    const response = await callApi(`${apiBaseUrl}/get_inventory`, {
      studioAddress,
      address,
      chain
    });
    const resjson = await errorsManager(response);
    return resjson;
  } catch (error) {
    throw new Error("Error: getInventory Failed.")
  }
}

web2Functions.getListedNfts = async function ({ chain, projectId }) {
  const response = await callApi(`${apiBaseUrl}/get_listed_nfts`, {
    chain,
    projectId
  });
  const resjson = await errorsManager(response);
  return resjson;
}

// Chain can be "polygon"
web2Functions.getListedNftsOnSecondaryMarket = async function ({ chain, projectAddress }) {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
  const raw = JSON.stringify({
    studioAddress: projectAddress,
    chain
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: raw
  });
  const resjson = await response.json();
  return resjson;
}

// Chain can be "polygon"
web2Functions.getPlayerItemsOnSecondaryMarket = async function ({ chain, userAddress }) {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
  const raw = JSON.stringify({
    seller: userAddress,
    chain
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: raw
  });
  const resjson = await response.json();
  return resjson;
}

web2Functions.getProjectForDomain = async function ({ projectDomain }) {
  const response = await callApi(`${apiBaseUrl}/get_project_for_marketplace`, {
    projectDomain
  });
  const resjson = await errorsManager(response);
  return resjson;
}

web2Functions.loginWithGoogle = async function ({ credential, clientId, projectId }) {
  try {
    if (!projectId) throw new Error("Project not found.");
    const raw = JSON.stringify({ token: credential, clientId, projectId });
    const resAuth = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/google`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "application/json"
      }
    });
    const resjsonAuth = await errorsManager(resAuth);
    if (resjsonAuth.refresh && resjsonAuth.access) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${resjsonAuth.access.token}`
        }
      });
      const userResjson = await response.json();
      return {
        sessionToken: resjsonAuth.access.token,
        tokens: resjsonAuth,
        player: userResjson.user,
        wallets: userResjson.wallets,
        loguedWith: "google",
      };
    } else throw new Error("Auth tokens not found.");
  } catch (error) {
    console.error(error);
  }
}

web2Functions.logout = async function () {}

// Purchase in primary market
// web2Functions.primaryPurchaseWithXerialWallet = async function () {}

// web2Functions.sellNft = async function () {}

// web2Functions.delist = async function () {}

// web2Functions.transferNft = async function () {}

// web2Functions.transferMatic = async function () {}

// web2Functions.transferUsdc = async function () {}

export default web2Functions;