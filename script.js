const weddingBgm = document.getElementById("weddingBgm");

async function playBgm() {
  if (!weddingBgm) {
    return;
  }

  try {
    await weddingBgm.play();
  } catch {
    // Mobile browsers may block autoplay until first user interaction.
  }
}

void playBgm();
["click", "touchstart", "keydown"].forEach((eventName) => {
  document.addEventListener(
    eventName,
    () => {
      void playBgm();
    },
    { once: true, passive: true }
  );
});

const GUESTBOOK_KEY = "weddingGuestbookV1";
const ADMIN_SESSION_KEY = "weddingAdminSessionV1";
const ADMIN_PASSWORD = "472150";
const ADMIN_LONG_PRESS_MS = 1800;

const guestbookForm = document.getElementById("guestbookForm");
const guestName = document.getElementById("guestName");
const guestMessage = document.getElementById("guestMessage");
const guestbookStatus = document.getElementById("guestbookStatus");
const guestbookList = document.getElementById("guestbookList");
const groomAdminTrigger = document.getElementById("groomAdminTrigger");
const galleryPhotos = Array.from(document.querySelectorAll(".gallery-photo"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let adminPressTimer = null;
let currentPhotoIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function isAdmin() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function getGuestbookItems() {
  try {
    const raw = localStorage.getItem(GUESTBOOK_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestbookItems(items) {
  localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(items));
}

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function deleteGuestbookItem(itemId) {
  const next = getGuestbookItems().filter((entry) => entry.id !== itemId);
  saveGuestbookItems(next);
  renderGuestbook();
}

function renderGuestbook() {
  if (!guestbookList) {
    return;
  }

  const items = getGuestbookItems();
  const adminMode = isAdmin();
  guestbookList.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "notice";
    empty.textContent = "첫 축하 메시지를 남겨주세요.";
    guestbookList.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "guestbook-item";

    const top = document.createElement("div");
    top.className = "guestbook-top";

    const name = document.createElement("p");
    name.className = "guestbook-name";
    name.textContent = item.name;

    top.appendChild(name);

    if (adminMode) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "삭제";
      deleteBtn.addEventListener("click", () => {
        deleteGuestbookItem(item.id);
      });
      top.appendChild(deleteBtn);
    }

    const date = document.createElement("p");
    date.className = "guestbook-date";
    date.textContent = formatDate(item.createdAt);

    const message = document.createElement("p");
    message.className = "guestbook-message";
    message.textContent = item.message;

    li.append(top, date, message);
    guestbookList.appendChild(li);
  });
}

function clearAdminPressTimer() {
  if (adminPressTimer) {
    clearTimeout(adminPressTimer);
    adminPressTimer = null;
  }
}

function handleAdminLongPress() {
  if (isAdmin()) {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    guestbookStatus.textContent = "관리자 로그아웃되었습니다.";
    renderGuestbook();
    return;
  }

  const input = window.prompt("관리자 비밀번호를 입력하세요.");

  if (input === null) {
    return;
  }

  if (input !== ADMIN_PASSWORD) {
    guestbookStatus.textContent = "비밀번호가 올바르지 않습니다.";
    return;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  guestbookStatus.textContent = "관리자 로그인되었습니다.";
  renderGuestbook();
}

function startAdminLongPress() {
  clearAdminPressTimer();
  adminPressTimer = window.setTimeout(() => {
    handleAdminLongPress();
    clearAdminPressTimer();
  }, ADMIN_LONG_PRESS_MS);
}

function openLightbox(index) {
  if (!lightbox || !lightboxImage || galleryPhotos.length === 0) {
    return;
  }

  currentPhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const target = galleryPhotos[currentPhotoIndex];
  lightboxImage.src = target.src;
  lightboxImage.alt = target.alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function showPreviousPhoto() {
  openLightbox(currentPhotoIndex - 1);
}

function showNextPhoto() {
  openLightbox(currentPhotoIndex + 1);
}

galleryPhotos.forEach((photo, index) => {
  photo.addEventListener("click", () => {
    openLightbox(index);
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", showPreviousPhoto);
lightboxNext?.addEventListener("click", showNextPhoto);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightbox?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

lightbox?.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].clientX;
  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) < 30) {
    return;
  }

  if (deltaX > 0) {
    showPreviousPhoto();
    return;
  }

  showNextPhoto();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    showPreviousPhoto();
    return;
  }

  if (event.key === "ArrowRight") {
    showNextPhoto();
  }
});

groomAdminTrigger?.addEventListener("mousedown", startAdminLongPress);
groomAdminTrigger?.addEventListener("touchstart", startAdminLongPress, { passive: true });
groomAdminTrigger?.addEventListener("mouseup", clearAdminPressTimer);
groomAdminTrigger?.addEventListener("mouseleave", clearAdminPressTimer);
groomAdminTrigger?.addEventListener("touchend", clearAdminPressTimer);
groomAdminTrigger?.addEventListener("touchcancel", clearAdminPressTimer);

guestbookForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameValue = guestName?.value.trim() || "";
  const messageValue = guestMessage?.value.trim() || "";

  if (!nameValue || !messageValue) {
    guestbookStatus.textContent = "이름과 메시지를 모두 입력해주세요.";
    return;
  }

  const items = getGuestbookItems();
  const nextItems = [
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: nameValue,
      message: messageValue,
      createdAt: new Date().toISOString(),
    },
    ...items,
  ];

  saveGuestbookItems(nextItems);
  guestbookForm.reset();
  guestbookStatus.textContent = "축하 메시지가 등록되었습니다.";
  renderGuestbook();
});

renderGuestbook();

