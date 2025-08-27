const donationInput = document.getElementById("donationAmount");
const donationError = document.getElementById("donationError");
const integer1Input = document.getElementById("teamBaseline");
const integer2Input = document.getElementById("assignedBaseline");
const shuffleBtn = document.getElementById("shuffleBtn");

const UNIT1 = 2; // $2 per unit
const UNIT2 = 5; // $5 per unit

const nextBtn = document.getElementById("nextBtn");
const paymentScreenshot = document.getElementById("paymentScreenshot");

// Disable button by default (redundant but safe)
nextBtn.disabled = true;

// paymentScreenshot.addEventListener("change", () => {
//   if (paymentScreenshot.files.length > 0) {
//     nextBtn.disabled = false;
//   } else {
//     nextBtn.disabled = true;
//   }
// });


// Utility: Only allow digits in input
function enforceIntegerOnly(input) {
  input.value = input.value.replace(/\D/g, "");
}

// Utility: Update donation amount based on integer inputs
function updateDonationAmount() {
  const int1 = parseInt(integer1Input.value) || 0;
  const int2 = parseInt(integer2Input.value) || 0;
  const total = int1 * UNIT1 + int2 * UNIT2;
  donationInput.value = total.toString();
  donationError.textContent = "";
  donationInput.style.borderColor = "";
}

// Utility: Split donation amount into integer1 and integer2
function splitDonationAmount(amount) {
  const combinations = [];

  for (let x = 0; x <= amount / UNIT1; x++) {
    const remaining = amount - x * UNIT1;
    if (remaining % UNIT2 === 0) {
      const y = remaining / UNIT2;
      combinations.push([x, y]);
    }
  }

  return combinations;
}

// Update label when baseline changes
function updateNameLabel() {
    const checkboxes = document.querySelectorAll(".nameCheck");
    const limit = parseInt(integer2Input.value) || 0;
    const selectedCount = [...checkboxes].filter(cb => cb.checked).length;

    nameLimitLabel.textContent = `You can select up to ${limit} name${limit !== 1 ? 's' : ''} (${selectedCount} selected)`;

    // Disable unchecked checkboxes if limit reached
    checkboxes.forEach(cb => {
        cb.disabled = !cb.checked && selectedCount >= limit;
    });
}

// On donation input change
donationInput.addEventListener("input", () => {
  const value = donationInput.value.trim();

  if (!/^\d+$/.test(value)) {
    donationError.textContent = "Please enter a valid whole number (e.g. 10)";
    donationInput.style.borderColor = "red";
    return;
  }

  donationError.textContent = "";
  donationInput.style.borderColor = "";

  const amount = parseInt(value);
  const combos = splitDonationAmount(amount);

  if (combos.length > 0) {
    const [int1, int2] = combos[0]; // default to first combo
    integer1Input.value = int1;
    integer2Input.value = int2;
  } else {
    donationError.textContent = "Cannot split amount with $2 and $5 units.";
  }
  updateNameLabel();

  if (amount >= UNIT1) {
    nextBtn.disabled = false;
  } else {  
    nextBtn.disabled = true;
  }
});

// On integer inputs change
[integer1Input, integer2Input].forEach((input) => {
  input.addEventListener("input", () => {
    enforceIntegerOnly(input);
    updateDonationAmount();
    updateNameLabel();
  });
});

// On shuffle button click
shuffleBtn.addEventListener("click", () => {
  const value = parseInt(donationInput.value.trim());

  if (!value || value <= 0) {
    donationError.textContent = "Please enter a valid donation amount first.";
    return;
  }

  const combos = splitDonationAmount(value);

  if (combos.length === 0) {
    donationError.textContent = "No valid combinations found.";
    return;
  }

  // Track old value of Integer 2 before updating
  const oldInteger2 = parseInt(integer2Input.value) || 0;

  // Pick a random combination
  const randomCombo = combos[Math.floor(Math.random() * combos.length)];
  const [randInt1, randInt2] = randomCombo;

  // Update inputs
  integer1Input.value = randInt1;
  integer2Input.value = randInt2;

  // Update donation amount
  updateDonationAmount();

  // If Integer 2 changed, deselect all checkboxes
  if (randInt2 !== oldInteger2) {
    nameChecks.forEach(cb => cb.checked = false);
    nameError.textContent = "";
  }
});


// Name selection

const nameChecks = document.querySelectorAll(".nameCheck");
const nameError = document.getElementById("nameError");

function getInteger2Value() {
  return parseInt(integer2Input.value) || 0;
}

// Enforce max selection based on integer2
nameChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const maxAllowed = getInteger2Value();
    const checkedBoxes = Array.from(nameChecks).filter(cb => cb.checked);

    updateNameLabel();

    if (checkedBoxes.length > maxAllowed) {
      checkbox.checked = false; // undo the extra check
      nameError.textContent = `You can only select ${maxAllowed} name(s).`;
    } else {
      nameError.textContent = "";
    }
  });
});

// When Integer 2 changes, update enforcement and reset if needed
integer2Input.addEventListener("input", () => {
    enforceIntegerOnly(integer2Input);
    updateDonationAmount();
    updateNameLabel();

  const maxAllowed = getInteger2Value();
  const checkedBoxes = Array.from(nameChecks).filter(cb => cb.checked);

  if (checkedBoxes.length > maxAllowed) {
    // Uncheck extras automatically
    checkedBoxes.slice(maxAllowed).forEach(cb => cb.checked = false);
  }

  nameError.textContent = "";
});

// FORM REDIRECT
document.getElementById("nextBtn").addEventListener("click", () => {
    const donation = donationInput.value.trim();
    const teamBaseline = integer1Input.value.trim();
    const assignedBaseline = integer2Input.value.trim();
    const selectedNames = Array.from(nameChecks)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(", ");

    // Encode values for URL
    const encodedDonation = encodeURIComponent(donation);
    const encodedTeam = encodeURIComponent(teamBaseline);
    const encodedAssigned = encodeURIComponent(assignedBaseline);
    var encodedNames = encodeURIComponent(selectedNames);

    if (selectedNames == "") {
      encodedNames = encodeURIComponent("none");
    }

    // Construct the prefilled Google Form URL
    const formURL = `https://docs.google.com/forms/d/1B18Ep-Wbrzbu6IkQKbEhcZA-2tlQ-9y3PDf0mXXUWxo/viewform?entry.53587164=${encodedDonation}&entry.410711527=${encodedTeam}&entry.223218149=${encodedAssigned}&entry.1183523693=${encodedNames}`;

    // Open new tab or window
    window.open(formURL, '_blank');
});

// Form Submission

// document.getElementById("nextBtn").addEventListener("click", () => {
//   const donation = donationInput.value.trim();
//   const int1 = integer1Input.value.trim();
//   const int2 = integer2Input.value.trim();
//   const selectedNames = Array.from(nameChecks)
//     .filter(cb => cb.checked)
//     .map(cb => cb.value)
//     .join(", ");

//   const statusMsg = document.getElementById("submitStatus");

//   if (!donation || !int1 || !int2) {
//     statusMsg.textContent = "Please fill out all fields before submitting.";
//     return;
//   }

//   // Example Google Form URL and field names
//   const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdqABE7L-T8kxDzUV0FTNRN6jfnAuttoId5ZL3BiarHOgSJ0Q/formResponse";
//   const formData = new FormData();
//   formData.append("entry.53587164", donation);       // Donation Amount
//   formData.append("entry.410711527", int1);           // Integer 1
//   formData.append("entry.223218149", int2);           // Integer 2
//   formData.append("entry.1183523693", selectedNames);  // Selected Names

//   fetch(FORM_URL, {
//     method: "POST",
//     mode: "no-cors",
//     body: formData
//   })
//     .then(() => {
//       statusMsg.textContent = "Submitted successfully!";
//       statusMsg.style.color = "green";

//       // Optionally clear fields
//       // donationInput.value = "";
//       // integer1Input.value = "";
//       // integer2Input.value = "";
//       // nameChecks.forEach(cb => cb.checked = false);
//     })
//     .catch(() => {
//       statusMsg.textContent = "Submission failed.";
//       statusMsg.style.color = "red";
//     });
// });


// Payment Upload
// document.getElementById("nextBtn").addEventListener("click", async () => {
//     console.log("Button was clicked!");
//     const donation = donationInput.value.trim();
//     const teamBaseline = integer1Input.value.trim();
//     const assignedBaseline = integer2Input.value.trim();
//     const selectedNames = Array.from(nameChecks)
//         .filter(cb => cb.checked)
//         .map(cb => cb.value)
//         .join(", ");
//     const screenshotFile = document.getElementById("paymentScreenshot").files[0];

//     const statusMsg = document.getElementById("submitStatus");

//     if (!donation || !teamBaseline || !assignedBaseline || !screenshotFile) {
//         statusMsg.textContent = "Please fill all fields and upload your payment screenshot.";
//         return;
//     }

//     // Read the file as base64
//     const base64 = await new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result.split(',')[1]);
//         reader.onerror = reject;
//         reader.readAsDataURL(screenshotFile);
//     });

//     const formData = new FormData();
//     formData.append("donationAmount", donation);
//     formData.append("teamBaseline", teamBaseline);
//     formData.append("assignedBaseline", assignedBaseline);
//     formData.append("selectedNames", selectedNames);
//     formData.append("fileName", screenshotFile.name);
//     formData.append("fileType", screenshotFile.type);
//     formData.append("fileBlob", base64);

//     // show loading UI
//     const loading = document.getElementById("loading");
//     loading.style.display = "block";

//     const SCRIPT_URL="https://script.google.com/macros/s/AKfycbyECv0mr8OeLDsBm53DJJEwCezF2pLebDcUzMyMKRUcTEWqM3Y-aI84xsUDxBeXYfd7/exec";
//     fetch(SCRIPT_URL, {
//         method: "POST",
//         body: formData,
//         redirect: "follow"
//     })
//     .then(() => {
//         statusMsg.textContent = "Submitted successfully!";
//         statusMsg.style.color = "green";
//         loading.style.display = "none"
//     })
//     .catch(() => {
//         statusMsg.textContent = "Submission failed.";
//         statusMsg.style.color = "red";
//         loading.style.display = "none"
//     });
// });
