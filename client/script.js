const button = document.querySelector("button");
const baseUrl = window.location.protocol + "//" + window.location.host;
button.addEventListener("click", () => {
  fetch(`${baseUrl}/api/stripe/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.ok) return res.json();
      return res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((e) => {
      console.log(e);
    });
});
