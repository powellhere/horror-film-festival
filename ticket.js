const movieBackgrounds = {
    Frankenstein: [
        "images/frank-bg-1.jpg",
        "images/frank-bg-2.jpg",
        "images/frank-bg-3.jpg",
        "images/frank-bg-4.jpg"
    ],
    Psycho: [
        "images/psycho-bg-1.jpg",
        "images/psycho-bg-2.jpg",
        "images/psycho-bg-3.jpg"
    ],
    "Rosemary's Baby": [
        "images/rosemary-bg-1.jpg",
        "images/rosemary-bg-2.jpg"
    ],
    "The Exorcist": [
        "images/exorcist-bg-1.jpg",
        "images/exorcist-bg-2.jpg",
        "images/exorcist-bg-3.jpg"
    ],
    "The Shining": [
        "images/shining-bg-1.jpg",
        "images/shining-bg-2.jpg",
        "images/shining-bg-3.jpg"
    ]
};

const movieGenres = {
    Frankenstein: "Monster",
    Psycho: "Psychological",
    "Rosemary's Baby": "Occult",
    "The Exorcist": "Occult",
    "The Shining": "Haunted"
};

let currentMovie = "";
let activeFilter = "all";
let lastFocusedTrigger = null;
let currentPreviewUrl = null;
let currentBackgroundIndex = 0;

const modal = document.getElementById("ticketModal");
const nameInput = document.getElementById("viewerName");
const generateButton = document.getElementById("generateTicketButton");
const ticketHeading = document.getElementById("ticketHeading");
const ticketDescription = document.getElementById("ticketDescription");
const ticketPreviewContainer = document.getElementById("ticketPreviewContainer");
const ticketPreviewImage = document.getElementById("ticketPreviewImage");
const downloadLink = document.getElementById("downloadLink");
const canvas = document.getElementById("ticketCanvas");
const movieCards = Array.from(document.querySelectorAll(".movie-card"));
const searchInput = document.getElementById("movieSearch");
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
const resultsCopy = document.getElementById("resultsCopy");
const galleryPreviewImage = document.getElementById("galleryPreviewImage");
const galleryThumbs = document.getElementById("galleryThumbs");
const galleryPrevButton = document.getElementById("galleryPrevButton");
const galleryNextButton = document.getElementById("galleryNextButton");

function getCurrentImagePool() {
    return movieBackgrounds[currentMovie] || [];
}

function setActiveBackground(index) {
    const imagePool = getCurrentImagePool();
    if (!imagePool.length) {
        galleryPreviewImage.removeAttribute("src");
        return;
    }

    currentBackgroundIndex = (index + imagePool.length) % imagePool.length;
    galleryPreviewImage.src = imagePool[currentBackgroundIndex];

    for (const thumb of galleryThumbs.querySelectorAll(".gallery-thumb")) {
        const isActive = Number(thumb.dataset.index) === currentBackgroundIndex;
        thumb.classList.toggle("is-active", isActive);
        thumb.setAttribute("aria-pressed", String(isActive));
    }
}

function renderGallery() {
    const imagePool = getCurrentImagePool();
    galleryThumbs.innerHTML = "";

    if (!imagePool.length) {
        galleryPreviewImage.removeAttribute("src");
        galleryPrevButton.hidden = true;
        galleryNextButton.hidden = true;
        return;
    }

    galleryPrevButton.hidden = imagePool.length <= 1;
    galleryNextButton.hidden = imagePool.length <= 1;

    imagePool.forEach((imagePath, index) => {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "gallery-thumb";
        thumb.dataset.index = String(index);
        thumb.setAttribute("aria-label", `Select background ${index + 1}`);

        const thumbImage = document.createElement("img");
        thumbImage.src = imagePath;
        thumbImage.alt = "";
        thumb.appendChild(thumbImage);

        thumb.addEventListener("click", () => {
            setActiveBackground(index);
        });

        galleryThumbs.appendChild(thumb);
    });

    setActiveBackground(currentBackgroundIndex);
}

function resetTicketPreview() {
    if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
        currentPreviewUrl = null;
    }

    ticketPreviewImage.removeAttribute("src");
    downloadLink.href = "#";
    ticketPreviewContainer.hidden = true;
}

function showTicketPreview(blob) {
    resetTicketPreview();

    currentPreviewUrl = URL.createObjectURL(blob);
    ticketPreviewImage.onload = () => {
        ticketPreviewContainer.hidden = false;
    };
    ticketPreviewImage.onerror = () => {
        resetTicketPreview();
        window.alert("Preview generation failed. Please try again.");
    };
    ticketPreviewImage.src = currentPreviewUrl;
    downloadLink.href = currentPreviewUrl;
}

function openTicketModal(movieTitle, trigger = null) {
    currentMovie = movieTitle;
    currentBackgroundIndex = 0;
    lastFocusedTrigger = trigger;

    ticketHeading.textContent = `${movieTitle} Ticket Stub`;
    ticketDescription.textContent = `Generate a personalized admission for ${movieTitle} and download it as a festival souvenir.`;
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    resetTicketPreview();
    renderGallery();
    nameInput.value = "";

    window.requestAnimationFrame(() => {
        nameInput.focus();
    });
}

function closeTicketModal() {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedTrigger instanceof HTMLElement) {
        lastFocusedTrigger.focus();
    }
}

function attachOpeners() {
    const triggers = document.querySelectorAll("[data-open-ticket]");

    for (const trigger of triggers) {
        trigger.addEventListener("click", (event) => {
            const movieTitle = event.currentTarget.dataset.movie;
            openTicketModal(movieTitle, event.currentTarget);
        });
    }

    for (const card of movieCards) {
        card.addEventListener("click", (event) => {
            if (event.target.closest("[data-open-ticket]")) {
                return;
            }

            openTicketModal(card.dataset.movie, card);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openTicketModal(card.dataset.movie, card);
            }
        });
    }
}

function updateResults(visibleCards) {
    const label = visibleCards === 1 ? "film" : "films";
    resultsCopy.textContent = `Showing ${visibleCards} ${label}`;
}

function filterMovies() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCards = 0;

    for (const card of movieCards) {
        const matchesFilter =
            activeFilter === "all" || card.dataset.genre === activeFilter;
        const matchesQuery =
            query.length === 0 || card.dataset.search.includes(query);
        const shouldShow = matchesFilter && matchesQuery;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCards += 1;
        }
    }

    updateResults(visibleCards);
}

function attachFilters() {
    searchInput.addEventListener("input", filterMovies);

    for (const button of filterButtons) {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;

            for (const chip of filterButtons) {
                chip.classList.toggle("is-active", chip === button);
            }

            filterMovies();
        });
    }
}

function attachModalControls() {
    generateButton.addEventListener("click", generateTicket);
    galleryPrevButton.addEventListener("click", () => {
        setActiveBackground(currentBackgroundIndex - 1);
    });
    galleryNextButton.addEventListener("click", () => {
        setActiveBackground(currentBackgroundIndex + 1);
    });

    document.querySelector(".close-btn").addEventListener("click", closeTicketModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeTicketModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-visible")) {
            closeTicketModal();
        }
    });

    nameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            generateTicket();
        }
    });
}

function attachRevealAnimation() {
    if (!("IntersectionObserver" in window)) {
        for (const card of document.querySelectorAll(".reveal-card")) {
            card.classList.add("is-visible");
        }
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.2 }
    );

    for (const card of document.querySelectorAll(".reveal-card")) {
        observer.observe(card);
    }
}

function generateTicket() {
    const guestName = nameInput.value.trim() || "GUEST";
    const ctx = canvas.getContext("2d");
    const imagePool = movieBackgrounds[currentMovie] || [];
    const isFileProtocol = window.location.protocol === "file:";
    const imagePath = imagePool.length
        ? imagePool[currentBackgroundIndex % imagePool.length]
        : null;

    const drawTicket = (backgroundImage = null) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundImage) {
            const imgRatio = backgroundImage.width / backgroundImage.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth;
            let drawHeight;
            let offsetX;
            let offsetY;

            if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = backgroundImage.width * (canvas.height / backgroundImage.height);
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = backgroundImage.height * (canvas.width / backgroundImage.width);
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#150d0d");
            gradient.addColorStop(1, "#090909");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = "rgba(6, 6, 6, 0.48)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(228, 199, 126, 0.62)";
        ctx.lineWidth = 3;
        ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

        ctx.strokeStyle = "rgba(228, 199, 126, 0.32)";
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(610, 26);
        ctx.lineTo(610, 274);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f0e2c4";
        ctx.font = "600 26px 'Georgia'";
        ctx.fillText("SHADOWS & CELLULOID", 48, 66);

        ctx.fillStyle = "#cfb67a";
        ctx.font = "18px 'Courier New'";
        ctx.fillText("MIDNIGHT MATINEE / ADMIT ONE", 50, 98);

        ctx.fillStyle = "#ffffff";
        ctx.font = "italic 42px 'Georgia'";
        ctx.fillText(currentMovie, 48, 152);

        ctx.fillStyle = "#cfb67a";
        ctx.font = "18px 'Courier New'";
        ctx.fillText(`GENRE: ${movieGenres[currentMovie] || "Cult"}`, 50, 192);
        ctx.fillText("SCREENING: 23:45", 50, 222);
        ctx.fillText("VENUE: MIDNIGHT HALL", 50, 248);

        ctx.fillStyle = "#8f1717";
        ctx.font = "bold 30px 'Courier New'";
        ctx.fillText(guestName.toUpperCase(), 628, 120);

        ctx.fillStyle = "#f0e2c4";
        ctx.font = "18px 'Courier New'";
        ctx.fillText("ROW 13 / SEAT 4", 628, 160);
        ctx.fillText("VOID IF DAWN ARRIVES", 628, 195);
        ctx.fillText("HORRORDB 2026", 628, 230);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    showTicketPreview(blob);
                    return;
                }

                try {
                    const dataURL = canvas.toDataURL("image/jpeg", 0.92);
                    fetch(dataURL)
                        .then((response) => response.blob())
                        .then(showTicketPreview)
                        .catch((error) => {
                            console.error("Ticket preview fallback failed:", error);
                            resetTicketPreview();
                        });
                } catch (error) {
                    console.error("Ticket export failed:", error);
                    resetTicketPreview();
                    window.alert("Ticket generation is blocked in this view. Please try again.");
                }
            },
            "image/jpeg",
            0.92
        );
    };

    if (isFileProtocol || !imagePath) {
        drawTicket();
        return;
    }

    const backgroundImage = new Image();
    backgroundImage.onload = () => drawTicket(backgroundImage);
    backgroundImage.onerror = () => drawTicket();
    backgroundImage.src = imagePath;
}

attachOpeners();
attachFilters();
attachModalControls();
attachRevealAnimation();
filterMovies();
