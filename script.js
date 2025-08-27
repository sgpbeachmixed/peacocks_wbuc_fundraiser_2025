// SHAKE BUTTON
const btn = document.getElementById("shakeBtn");

function shakeButton() {
  console.log("shakeButton")
  btn.classList.add("shake");

  // Remove the class after animation duration (0.5s)
  setTimeout(() => {
    btn.classList.remove("shake");
  }, 500);
}

// Shake intermittently every 3 seconds
// setInterval(shakeButton, 3000);


// FAQ
// Toggle FAQ open/close on click
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    question.parentElement.classList.toggle('active');
  });
});