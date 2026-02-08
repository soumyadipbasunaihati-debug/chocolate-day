let biteIndex = 0;
const bites = [
  "choco/choco1.png",
  "choco/choco2.png",
  "choco/choco3.png",
  "choco/choco4.png",
  "choco/choco5.png"
];

let audioContext, analyser, mic;
let canBite = true;

// PASSWORD
function checkPassword() {
  const pass = document.getElementById("password").value;
  if (pass === "IWANTCHOCOLATE") {
    document.getElementById("passwordScreen").classList.add("hidden");
    document.getElementById("popup").classList.remove("hidden");
  } else {
    document.getElementById("error").innerText = "Wrong password 😝";
  }
}

// NO BUTTON TRICK
function noTrick() {
  const btn = document.getElementById("noBtn");
  btn.innerText = "Yes 😋";
  btn.onclick = acceptChocolate;
}

// ACCEPT
function acceptChocolate() {
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("chocoScene").classList.remove("hidden");
  initMic(); // MUST be after user click
}

// INIT MIC (MOBILE SAFE)
function initMic() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume(); // VERY IMPORTANT FOR MOBILE

      analyser = audioContext.createAnalyser();
      mic = audioContext.createMediaStreamSource(stream);
      mic.connect(analyser);

      analyser.fftSize = 256;
      detectBite();
    })
    .catch(() => alert("Please allow microphone permission 🥺"));
}

// DETECT BITE
function detectBite() {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);

  let volume = data.reduce((a, b) => a + b) / data.length;

  if (volume > 40 && canBite) {
    takeBite();
    canBite = false;
    setTimeout(() => canBite = true, 1200);
  }

  requestAnimationFrame(detectBite);
}

// TAKE BITE
function takeBite() {
  const choco = document.getElementById("chocolate");

  choco.style.transform = "scale(0.92)";
  setTimeout(() => choco.style.transform = "scale(1)", 200);

  biteIndex++;

  if (biteIndex < bites.length) {
    choco.src = bites[biteIndex];
  } else {
    document.getElementById("chocoScene").classList.add("hidden");
    document.getElementById("loveScreen").classList.remove("hidden");
  }
}