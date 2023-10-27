const callApi = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return response;
}

const errorsManager = async (response) => {
  if (!response.status) throw new Error("El response no tiene status.");
  const resjson = await response.json();
  if (response.status.toString()[0] != "2") throw resjson;
  return resjson;
}

export {  callApi, errorsManager  };