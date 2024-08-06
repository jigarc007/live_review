const baseURL = "http://localhost:3001/";
export const addReview = (payload) => {
  localStorage.removeItem("updatedRecord");
  fetch(`${baseURL}added`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getReview = () => {
  return fetch(`${baseURL}getReview`, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
};


export const EditReview = async (id, payload) => {
  const editResponse = await fetch(`${baseURL}edited/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const res = await editResponse.json();
  console.log({ res });
  localStorage.setItem("updatedRecord", JSON.stringify(res));
};
export const deleteReview = async (id) => {
  await fetch(`${baseURL}deleted/${id}`, {
    method: "delete",
    headers: { "Content-Type": "application/json" },
  });
};
