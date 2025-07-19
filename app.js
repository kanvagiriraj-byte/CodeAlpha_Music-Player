const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");
const fileInput = document.getElementById("fileInput");

let songs = [];
let currentIndex = 0;
let isPlaying = false;

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  songs = files.map((file) => ({
    title: file.name.replace(/\.[^/.]+$/, ""),
    artist: "Uploaded File",
    file,
    url: URL.createObjectURL(file),
  }));

  updatePlaylist();
  if (songs.length > 0) {
    currentIndex = 0;
    loadSong(currentIndex);
  }
});

function updatePlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} — ${song.artist}`;
    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function loadSong(index) {
  const song = songs[index];
  audio.src = song.url;
  title.textContent = song.title;
  artist.textContent = song.artist;

  [...playlistEl.children].forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

function playSong() {
  audio.play();
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn.textContent = "▶";
});

audio.addEventListener("ended", () => {
  nextSong();
});

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Progress and duration
audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  progress.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

// Volume
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}
