const button = document.querySelector("button");
button.addEventListener("click", () => {
  console.log("button clicked");
  fetch("http://localhost:3000/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id: "66c6dfc6ed8b65983c6f0927",
      title: "farmland for good live",
      price: 100,
      owner: "66c6d66521a5bbdf2d12b95c",
      imgUrls: [
        "https://res.cloudinary.com/dey5s9slk/image/upload/v1724309447/xoz8genhkpzubscaajn1.jpg",
      ],
    }),
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
