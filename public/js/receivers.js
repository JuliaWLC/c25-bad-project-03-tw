window.onload = () => {
  receiversForm();
};

function receiversForm() {
  const form = document.querySelector("#receivers-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = form.token.value;
    const resp = await fetch("/receivertoken/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (resp.status === 200) {
      alert("Thank you for choosing us!");
      window.location = "/index.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}





