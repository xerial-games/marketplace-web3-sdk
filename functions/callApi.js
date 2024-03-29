const callApi = async (url, payload) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "Application/json",
    },
  });

  return response;
};

const callApiRest = async (url, payload, options) => {
  if (!options) {
    const response = await fetch(url);
    return response;
  } else {
    const finalOptions = {
      ...options,
      headers: options.headers ?? { "Content-Type": "Application/json" },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, finalOptions);
    return response;
  }
};

const callWalletApi = async (url, payload, options) => {
  if (!options) {
    const response = await fetch(url);
    return response;
  } else {
    const finalOptions = {
      ...options,
      headers: options.headers ?? { "Content-Type": "Application/json" },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, finalOptions);
    return response;
  }
};

const errorsManager = async (response) => {
  if (!response.status) throw new Error("Reponse Without Status");
  const resjson = await response.json();
  if (response.status.toString()[0] != "2") throw resjson;
  return resjson;
};

export { callApi, callApiRest, errorsManager, callWalletApi };
