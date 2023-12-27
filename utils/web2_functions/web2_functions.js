import { callApi, errorsManager } from "../call_api_functions";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_HOST;
const web2Functions = {};

web2Functions.getGameStudioCollections = async (projectId) => {
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

web2Functions.getProjectForDomain = async function (projectDomain) {
  const response = await callApi(`${apiBaseUrl}/get_project_for_marketplace`, {
    projectDomain
  });
  const resjson = await errorsManager(response);
  return resjson;
}

// web2Functions.loginWithGoogle = async function () {}

web2Functions.logout = async function () {}

// Purchase in primary market
// web2Functions.primaryPurchaseWithXerialWallet = async function () {}

// web2Functions.sellNft = async function () {}

// web2Functions.delist = async function () {}

// web2Functions.transferNft = async function () {}

// web2Functions.transferMatic = async function () {}

// web2Functions.transferUsdc = async function () {}

export default web2Functions;