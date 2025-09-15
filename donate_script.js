const donationInput = document.getElementById("donationAmount");
const donationError = document.getElementById("donationError");
const integer1Input = document.getElementById("teamBaseline");
const integer2Input = document.getElementById("assignedBaseline");
const integer3Input = document.getElementById("coachBaseline");
const shuffleBtn = document.getElementById("shuffleBtn");

const UNIT1 = 2; // $2 per unit
const UNIT2 = 5; // $5 per unit
const UNIT3 = 10; // $10 per unit

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
  const int3 = parseInt(integer3Input.value) || 0;
  const total = int1 * UNIT1 + int2 * UNIT2 + int3 * UNIT3;
  // donationInput.value = total.toString();
  donationInput.textContent = total.toString() + ".00";
  donationError.textContent = "";
  donationInput.style.borderColor = "";

  if (total >= UNIT1) {
    nextBtn.disabled = false;
  } else {  
    nextBtn.disabled = true;
  }
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
    const playerCheckboxes = document.querySelectorAll(".nameCheck");
    const playerLimit = parseInt(integer2Input.value) || 0;
    const selectedPlayerCount = [...playerCheckboxes].filter(cb => cb.checked).length;


    const coachCheckboxes = document.querySelectorAll(".coachCheck");
    const coachLimit = Math.min((parseInt(integer3Input.value) || 0), 2);
    const selectedCoachCount = [...coachCheckboxes].filter(cb => cb.checked).length;

    nameLimitLabel.textContent = `You can select up to ${playerLimit} player name${playerLimit !== 1 ? 's' : ''} (${selectedPlayerCount} selected) and ${coachLimit} coach name${coachLimit !== 1 ? 's' : ''} (${selectedCoachCount} selected)`;

    // Disable unchecked checkboxes if limit reached
    playerCheckboxes.forEach(cb => {
        cb.disabled = !cb.checked && selectedPlayerCount >= playerLimit;
    });
    coachCheckboxes.forEach(cb => {
        cb.disabled = !cb.checked && selectedCoachCount >= coachLimit;
    });
}

// On donation input change
donationInput.addEventListener("input", () => {
  const value = donationInput.value.trim();

  if (!/^\d+$/.test(value)) {
    donationError.textContent = "Please enter a valid whole number (e.g. 100)";
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
  resetBackgroundAndLabel();
  updateNameLabel();

  if (amount >= UNIT1) {
    nextBtn.disabled = false;
  } else {  
    nextBtn.disabled = true;
  }
});

// On integer inputs change
[integer1Input, integer2Input, integer3Input].forEach((input) => {
  input.addEventListener("input", () => {
    enforceIntegerOnly(input);
    resetBackgroundAndLabel();
    updateDonationAmount();
    updateNameLabel();
  });
});

// On shuffle button click
// shuffleBtn.addEventListener("click", () => {
//   const value = parseInt(donationInput.value.trim());

//   if (!value || value <= 0) {
//     donationError.textContent = "Please enter a valid donation amount first.";
//     return;
//   }

//   const combos = splitDonationAmount(value);

//   if (combos.length === 0) {
//     donationError.textContent = "No valid combinations found.";
//     return;
//   }

//   // Track old value of Integer 2 before updating
//   const oldInteger2 = parseInt(integer2Input.value) || 0;

//   // Pick a random combination
//   const randomCombo = combos[Math.floor(Math.random() * combos.length)];
//   const [randInt1, randInt2] = randomCombo;

//   // Update inputs
//   integer1Input.value = randInt1;
//   integer2Input.value = randInt2;

//   // Update donation amount
//   updateDonationAmount();
//   updateNameLabel();

//   // If Integer 2 changed, deselect all checkboxes
//   if (randInt2 !== oldInteger2) {
//     nameChecks.forEach(cb => cb.checked = false);
//     nameError.textContent = "";
//   }
// });


// Name selection

// Copy name on click
// function copySpanText(element) {
//     const span = element.querySelector('span');

//     // Copy to clipboard
//     if (span) {
//       const text = span.textContent.trim();
//       navigator.clipboard.writeText(text)
//         .then(() => showCopiedMessage(element, text))
//         .catch(err => console.error('Copy failed', err));
//     }
//   }

// function showCopiedMessage(element, text) {
//   // Create message div
//   let msg = document.createElement('div');
//   msg.className = 'copied-msg show';
//   msg.textContent = 'Copied '+ text + ' to clipboard';
  
//   element.appendChild(msg);

//   // Remove after 2 seconds
//   setTimeout(() => {
//     msg.classList.remove('show');
//     setTimeout(() => element.removeChild(msg), 300); // wait for transition
//   }, 500);
// }

const nameChecks = document.querySelectorAll(".nameCheck");
const nameError = document.getElementById("nameError");
const nameCards = document.querySelectorAll(".name-card");

function getInteger2Value() {
  return parseInt(integer2Input.value) || 0;
}

function getInteger3Value() {
  return parseInt(integer3Input.value) || 0;
}

// Enforce max selection based on integer2
nameChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {

    // player assigned baselines
    const maxAllowed = getInteger2Value();
    const checkedBoxes = Array.from(nameChecks).filter(cb => cb.checked);

    if (maxAllowed == 0) {
      checkbox.checked = false; // undo the extra check
      nameError.textContent = `No assigned baselines. Enter no. of assigned baselines before selecting.`;
      nameCards.forEach(nameCard => {
        nameCard.style.backgroundColor = '#ffe6e6'; // light red
      });
    } else if (checkedBoxes.length > maxAllowed) {
      checkbox.checked = false; // undo the extra check
      nameError.textContent = `You can only select ${maxAllowed} name(s).`;
    } else {
      nameError.textContent = "";
    }

    updateNameLabel();
  });
});


const coachChecks = document.querySelectorAll(".coachCheck");

coachChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {

    // player assigned baselines
    const maxAllowed = getInteger3Value();
    const checkedBoxes = Array.from(coachChecks).filter(cb => cb.checked);

    if (maxAllowed == 0) {
      checkbox.checked = false; // undo the extra check
      nameError.textContent = `No assigned baselines for coaches. Enter no. of assigned baselines for coaches before selecting.`;
    } else if (checkedBoxes.length > maxAllowed) {
      checkbox.checked = false; // undo the extra check
      nameError.textContent = `You can only select ${maxAllowed} name(s).`;
    } else {
      nameError.textContent = "";
    }

    updateNameLabel();
  });
});

function resetBackgroundAndLabel() {
  nameError.textContent = ""
  nameCards.forEach(nameCard => {
    nameCard.style.backgroundColor = 'white'; 
  });
};

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

// When Integer 3 changes, update enforcement and reset if needed
integer3Input.addEventListener("input", () => {
    enforceIntegerOnly(integer3Input);
    updateDonationAmount();
    updateNameLabel();

  const maxAllowed = getInteger3Value();
  const checkedBoxes = Array.from(coachChecks).filter(cb => cb.checked);

  if (checkedBoxes.length > maxAllowed) {
    // Uncheck extras automatically
    checkedBoxes.slice(maxAllowed).forEach(cb => cb.checked = false);
  }

  nameError.textContent = "";
});

// FORM REDIRECT
document.getElementById("nextBtn").addEventListener("click", () => {
    const donation = donationInput.textContent.trim();
    const teamBaseline = integer1Input.value.trim();
    const assignedBaseline = integer2Input.value.trim();
    const coachBaseline = integer3Input.value.trim();
    const selectedNames = Array.from(nameChecks)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(", ");
    const selectedCoachNames = Array.from(coachChecks)
      .filter(cb => cb.checked)
      .map(cb => cb.value)
      .join(", ");

    // Encode values for URL
    const encodedDonation = encodeURIComponent(donation);
    var encodedTeam = encodeURIComponent(teamBaseline);
    var encodedAssigned = encodeURIComponent(assignedBaseline);
    var encodedNames = encodeURIComponent(selectedNames);
    var encodedCoachAssigned = encodeURIComponent(coachBaseline);
    var encodedCoachNames = encodeURIComponent(selectedCoachNames);

    // Fill up empty values
    if (teamBaseline == "") {
      encodedTeam = encodeURIComponent("0");
    }

    if (assignedBaseline == "") {
      encodedAssigned = encodeURIComponent("0");
    }

    if (coachBaseline == "") {
      encodedCoachAssigned = encodeURIComponent("0");
    }

    if (selectedNames == "") {
      encodedNames = encodeURIComponent("-");
    }

    if (selectedCoachNames == "") {
      encodedCoachNames = encodeURIComponent("-");
    }

    // Construct the prefilled Google Form URL
    const formURL = `https://docs.google.com/forms/d/1B18Ep-Wbrzbu6IkQKbEhcZA-2tlQ-9y3PDf0mXXUWxo/viewform?entry.53587164=${encodedDonation}&entry.410711527=${encodedTeam}&entry.223218149=${encodedAssigned}&entry.1183523693=${encodedNames}&entry.1871500344=${encodedCoachAssigned}&entry.1213971759=${encodedCoachNames}`;

    // Open new tab or window
    window.open(formURL, '_blank');
});

// SCROLL TO TOP
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
scrollToTopBtn.style.display = "none";

// Show button when user scrolls down
window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollToTopBtn.style.display = "flex";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

// Scroll smoothly to top when button clicked
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
