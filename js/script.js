let timers = [];
let mId = "smodal";
window.addEventListener("load", () => {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});
window.onclick = function (event) {
  if (event.target == document.getElementById(mId)) {
    document.getElementById(mId).style.display = "none";
  }
};
/** VALIDATION */
function treplace(el) {
  //  alert(idEl.selectionStart);
  if (el.selectionStart == 1) {
    var o = el.value.substring(0, 1);
    if (isNaN(o)) {
      el.value = "";
    } else {
      if (parseInt(el.value) > 59) {
        if (parseInt(el.value.substring(0, 2)) > 59) {
          el.value = "0" + el.value.substring(0, 1);
        } else {
          el.value = el.value.substring(0, 2);
        }
      } else {
        el.value = el.value.substring(0, 2);
        el.selectionStart = 1;
      }
    }
  } else {
    if (el.selectionStart == 2) {
      var o = el.value.substring(1, 2);
      if (isNaN(o)) {
        el.value = el.value.substring(0, 1) + el.value.substring(2, 3);
      } else {
        if (parseInt(el.value) > 59) {
          if (parseInt(el.value.substring(0, 2)) > 59) {
            el.value = el.value.substring(0, 1);
          } else {
            el.value = el.value.substring(0, 2);
          }
        } else {
          el.value = el.value.substring(0, 2);
        }
      }
      //
    } else {
      if (el.selectionStart == 3) {
        var o = el.value.substring(2, 3);
        if (isNaN(o)) {
          el.value = el.value.substring(0, 2);
        } else {
          if (parseInt(el.value) > 59) {
            if (parseInt(el.value.substring(1, 3)) > 59) {
              el.value = "0" + o;
            } else {
              el.value = el.value.substring(1, 3);
            }
          } else {
            el.value = el.value.substring(1, 3);
          }
        }
      }
    }
  }
}

/* DARK MODE TOOGLE */
const darkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
</svg>`;

const lightIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>`;

function switchTheme() {
  let isDarkmode = localStorage.theme === "dark";
  if (isDarkmode) {
    localStorage.theme = "light";
    document.documentElement.classList.remove("dark");
    toogleB(false);
  } else {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    toogleB(true);
  }
}
function toogleB(opt) {
  const switchToggle = document.querySelector("#switch-toggle");
  if (opt) {
    switchToggle.classList.remove("bg-yellow-500", "-translate-x-2");
    switchToggle.classList.add("bg-gray-700", "translate-x-full");
    setTimeout(() => {
      switchToggle.innerHTML = darkIcon;
    }, 250);
  } else {
    switchToggle.classList.add("bg-yellow-500", "-translate-x-2");
    switchToggle.classList.remove("bg-gray-700", "translate-x-full");
    setTimeout(() => {
      switchToggle.innerHTML = lightIcon;
    }, 250);
  }
}
/** SETTINGS POPUP */
function setD() {
  document.getElementById(mId).style.display = "block";
  toogleB(localStorage.theme === "dark");
}
function clos() {
  document.getElementById(mId).style.display = "none";
}

function addTimer() {
  const name = document.getElementById("timerName").value || "Unnamed Timer";
  const hours = parseInt(document.getElementById("hours").value) || 0;
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const seconds = parseInt(document.getElementById("seconds").value) || 0;

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds > 0) {
    const timer = {
      id: Date.now(),
      name,
      totalSeconds,
      remainingSeconds: totalSeconds,
      interval: null,
      isPaused: false,
    };
    timers.push(timer);
    renderTimers();
    startTimer(timer.id);
  }
}

// function pour notification
function notifyUser(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

function startTimer(id) {
  const timer = timers.find((t) => t.id === id);
  if (timer) {
    timer.interval = setInterval(() => {
      if (!timer.isPaused) {
        timer.remainingSeconds--;
        if (timer.remainingSeconds <= 0) {
          clearInterval(timer.interval);
          playSound();
          notifyUser(`${timer.name} is done!`);
        }
        renderTimers();
      }
    }, 1000);
  }
}

function playSound() {
  const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
  audio.play();
}

function pauseTimer(id) {
  const timer = timers.find((t) => t.id === id);
  if (timer) {
    timer.isPaused = !timer.isPaused;
    renderTimers();
  }
}

function deleteTimer(id) {
  timers = timers.filter((t) => t.id !== id);
  renderTimers();
}

function renderTimers() {
  const timersContainer = document.getElementById("timers");
  timersContainer.innerHTML = "";
  timers.forEach((timer) => {
    const timerElement = document.createElement("div");
    timerElement.className = "timer";
    timerElement.innerHTML = `
            <span>${timer.name}: ${formatTime(timer.remainingSeconds)}</span>
            <button onclick="pauseTimer(${timer.id})">${
      timer.isPaused ? "Play" : "Pause"
    }</button>
            <button onclick="deleteTimer(${timer.id})">Delete</button>
        `;
    timersContainer.appendChild(timerElement);
  });
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}
