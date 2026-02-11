const form = document.getElementById("paymentForm");
const statusDiv = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

let isSubmitting = false;
let retryCount = 0;
const MAX_RETRIES = 3;

function setStatus(message, className) {
  statusDiv.textContent = message;
  statusDiv.className = "status " + className;
}

function mockApiRequest(payload) {
  return new Promise((resolve, reject) => {
    const random = Math.random();

    if (random < 0.4) {
      setTimeout(() => resolve({ status: 200, data: payload }), 1000);
    } else if (random < 0.7) {
      setTimeout(() => reject({ status: 503 }), 1000);
    } else {
      const delay = 5000 + Math.random() * 5000;
      setTimeout(() => resolve({ status: 200, data: payload }), delay);
    }
  });
}

async function submitWithRetry(payload) {
  try {
    await mockApiRequest(payload);
    setStatus("Submission successful!", "success");
    resetState();
  } catch (error) {
    if (error.status === 503 && retryCount < MAX_RETRIES) {
      retryCount++;
      setStatus(
        `Temporary failure. Retrying (${retryCount}/${MAX_RETRIES})...`,
        "pending"
      );
      submitWithRetry(payload);
    } else {
      setStatus("Submission failed. Please try again later.", "error");
      resetState();
    }
  }
}

function resetState() {
  isSubmitting = false;
  retryCount = 0;
  submitBtn.disabled = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  isSubmitting = true;
  submitBtn.disabled = true;

  const payload = {
    email: document.getElementById("email").value,
    amount: Number(document.getElementById("amount").value),
    requestId: Date.now()
  };

  setStatus("Pending submission...", "pending");
  submitWithRetry(payload);
});
