let selectedAvatar = "female";

let currentRoom = "";

let galleryName = "";

const socket = (typeof io === "function")
    ? io()
    : {
        emit: function () {},
        on: function () {}
    };

const remotePlayers = {};

/* TEMPORARY FRIEND FOR FRONTEND DEMO */

const demoFriend = {
    id: "demo-friend",
    x: 850,
    y: 300,
    avatar: "male"
};

let demoFriendEnabled = true;

const canvas =
    document.getElementById("galleryCanvas");

const ctx =
    canvas.getContext("2d");


/* PLAYER */

const player = {

    x: 500,

    y: 300,

    size: 25,

    speed: 5

};


/* KEYBOARD */

const keys = {};


document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key.toLowerCase();

        keys[key] = true;


        // Press ENTER to open a nearby painting

        if (key === "enter") {

            checkPaintingInteraction();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key.toLowerCase()] = false;

    }
);


/* PAGE NAVIGATION */

function hideAllPages() {

    document
        .querySelectorAll(".page")
        .forEach(function(page) {

            page.classList.remove("active");

        });

}


function goHome() {

    hideAllPages();

    document
        .getElementById("landingPage")
        .classList.add("active");

}


function showCreateGallery() {

    hideAllPages();

    document
        .getElementById("createPage")
        .classList.add("active");

}


function showJoinGallery() {

    hideAllPages();

    document
        .getElementById("joinPage")
        .classList.add("active");

}

// Show the room-created page
function showRoomCreatedPage(roomCode) {
    hideAllPages();

    currentRoom = roomCode;

    document.getElementById("createdRoomCode").textContent = roomCode;
    document.getElementById("roomCreatedPage").classList.add("active");
}

// Copy the room code
function copyRoomCode() {
    const roomCode = document.getElementById("createdRoomCode").textContent;

    navigator.clipboard.writeText(roomCode)
        .then(() => alert("Room code copied! Share it with your friends."))
        .catch(() => alert("Your room code is: " + roomCode));
}


/* GALLERY THEME SELECTION */

function showRoomSelection() {
    hideAllPages();

    document
        .getElementById("roomSelectionPage")
        .classList.add("active");
}

/* SELECT GALLERY THEME */

let selectedTheme = "";


/* SELECT THEME AND CREATE DEMO ROOM */

function selectThemeRoom(theme) {
    selectedTheme = theme;

    // Load paintings for the selected theme
    paintings = themePaintings[theme] || [];
    loadPaintingImages();

    // Generate a temporary room code
    currentRoom = "SC" + Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();

    // Display the room code page
    showRoomCreatedPage(currentRoom);
}




/* CREATE GALLERY - FRONTEND DEMO */

function createGallery() {
    galleryName = document
        .getElementById("galleryName")
        .value
        .trim();

    if (galleryName === "") {
        galleryName = "My Shared Gallery";
    }

    showRoomSelection();
}


/* JOIN GALLERY */

async function joinGallery() {

    const code =
        document
            .getElementById("roomCode")
            .value
            .trim();


    if (code === "") {

        alert(
            "Please enter a room code."
        );

        return;

    }


    const response = await fetch("/api/galleries/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code
        })
    });

    if (!response.ok) {
        alert("Gallery not found.");
        return;
    }

    const data = await response.json();

    currentRoom = data.code;
    galleryName = data.name;


    showAvatarPage();

}


/* AVATAR */

function showAvatarPage() {

    hideAllPages();

    document
        .getElementById("avatarPage")
        .classList.add("active");

}


function selectAvatar(type) {

    selectedAvatar = type;


    document
        .getElementById("femaleAvatar")
        .classList.remove(
            "selected"
        );


    document
        .getElementById("maleAvatar")
        .classList.remove(
            "selected"
        );


    document
        .getElementById(
            type + "Avatar"
        )
        .classList.add(
            "selected"
        );

}

/* ENTER GALLERY */

function enterGallery() {

    hideAllPages();

    document
        .getElementById("galleryPage")
        .classList.add("active");


    document
        .getElementById("roomDisplay")
        .textContent =
        "Room: " + currentRoom;

    socket.emit("join-gallery", {
        room: currentRoom,
        avatar: selectedAvatar
    });


    player.x = 500;

    player.y = 300;


    startGame();

}


/* THEME PAINTINGS */

const themePaintings = {
    "Renaissance": [
        {
            x: 130, y: 100, width: 110, height: 130,
            title: "Almond Blossoms",
            artist: "Vincent van Gogh",
            year: "1890",
            medium: "Oil on Canvas",
            description: "A flowering almond tree symbolizing new life.",
            color: "#a8c9dc",
            image: "images/renaissance/Almondblossoms.jpeg"
        },
        {
            x: 420, y: 100, width: 110, height: 130,
            title: "Mona Lisa",
            artist: "Leonardo da Vinci",
            year: "1503–1519",
            medium: "Oil on Poplar Panel",
            description: "One of the world's most famous portraits.",
            color: "#806f52",
            image: "images/renaissance/MonaLisa.jpg"
        },
        {
            x: 670, y: 100, width: 110, height: 130,
            title: "The School of Athens",
            artist: "Raphael",
            year: "1509–1511",
            medium: "Fresco",
            description: "A gathering of great philosophers in classical architecture.",
            color: "#c9b18b",
            image: "images/renaissance/The_School_of_Athens.jpg"
        },
        {
            x: 130, y: 400, width: 110, height: 130,
            title: "The Last Supper",
            artist: "Leonardo da Vinci",
            year: "1495–1498",
            medium: "Wall Painting",
            description: "Leonardo's famous depiction of the Last Supper.",
            color: "#b79b75",
            image: "images/renaissance/thelastsupper.jpg"
        },
        {
            x: 420, y: 400, width: 110, height: 130,
            title: "Lady with an Ermine",
            artist: "Leonardo da Vinci",
            year: "c. 1489–1491",
            medium: "Oil on Panel",
            description: "A Renaissance portrait featuring a woman holding an ermine.",
            color: "#63594c",
            image: "images/renaissance/The_Lady_with_an_Ermine.jpg"
        },
        {
            x: 700, y: 400, width: 110, height: 130,
            title: "Sistine Madonna",
            artist: "Raphael",
            year: "c. 1512",
            medium: "Oil on Canvas",
            description: "A celebrated Madonna painting by Raphael.",
            color: "#8a7867",
            image: "images/renaissance/SistineMadonna.webp"
        },
        {
            x: 250, y: 280, width: 110, height: 130,
            title: "Primavera",
            artist: "Sandro Botticelli",
            year: "c. 1480",
            medium: "Tempera on Panel",
            description: "A richly detailed mythological scene from the Italian Renaissance.",
            color: "#77936a",
            image: "images/renaissance/Botticelli-primavera.jpg"
        },
        {
            x: 650, y: 280, width: 110, height: 130,
            title: "The Assumption of the Virgin",
            artist: "Titian",
            year: "1516–1518",
            medium: "Oil on Panel",
            description: "A monumental altarpiece showing the Virgin Mary's ascent to heaven.",
            color: "#a67f5b",
            image: "images/renaissance/The Assumption of the Virgin.jpg"
        }
    ]
};

// Start with an empty list until a theme is selected
let paintings = [];

const paintingImages = {};

function loadPaintingImages() {
    // Clear images from the previously selected room
    Object.keys(paintingImages).forEach(function(title) {
        delete paintingImages[title];
    });

    paintings.forEach(function(painting) {
        const img = new Image();

        img.onload = function() {
            console.log("Loaded painting:", painting.title);
        };

        img.onerror = function() {
            console.error("Could not load image:", painting.image);
        };

        img.src = painting.image;
        paintingImages[painting.title] = img;
    });
}


/* DRAW GALLERY */

function drawGallery() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* FLOOR */

    ctx.fillStyle = "#d6c4a8";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* WALLS */

    ctx.fillStyle = "#8b7355";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        35
    );


    ctx.fillRect(
        0,
        canvas.height - 35,
        canvas.width,
        35
    );


    ctx.fillRect(
        0,
        0,
        35,
        canvas.height
    );


    ctx.fillRect(
        canvas.width - 35,
        0,
        35,
        canvas.height
    );


    /* TITLE */

    ctx.fillStyle = "#333";

    ctx.font = "bold 26px Georgia";

    ctx.fillText(
        "THE SHARED CANVAS",
        50,
        60
    );


    /* PAINTINGS — NEAT GRID */

const columns = 4;
const leftMargin = 100;
const topMargin = 120;
const columnGap = 210;
const rowGap = 230;

paintings.forEach(function(painting, index) {
    const col = index % columns;
    const row = Math.floor(index / columns);

    painting.x = leftMargin + col * columnGap;
    painting.y = topMargin + row * rowGap;

    drawPainting(painting);
});


    /* FRIEND */

    drawOtherPlayer();


    /* PLAYER */

    drawPlayer();

}


/* DRAW PAINTING */

function drawPainting(painting) {

    /* FRAME */

    ctx.fillStyle = "#4b3621";

    ctx.fillRect(
        painting.x - 8,
        painting.y - 8,
        painting.width + 16,
        painting.height + 16
    );


    /* ARTWORK */

    const img = paintingImages[painting.title];


    if (img && img.complete && img.naturalWidth > 0) {

        /*
         * Draw a tiny version first.
         * This creates the pixelated thumbnail effect.
         */

        const smallCanvas =
            document.createElement("canvas");

        smallCanvas.width = 22;
        smallCanvas.height = 26;

        const smallCtx =
            smallCanvas.getContext("2d");

        smallCtx.imageSmoothingEnabled = false;


        smallCtx.drawImage(
            img,
            0,
            0,
            22,
            26
        );


        ctx.save();

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            smallCanvas,
            painting.x,
            painting.y,
            painting.width,
            painting.height
        );

        ctx.restore();


    } else {

        /* FALLBACK */

        ctx.fillStyle = painting.color;

        ctx.fillRect(
            painting.x,
            painting.y,
            painting.width,
            painting.height
        );

    }


    /* LABEL */

    ctx.fillStyle = "#222";

ctx.font = "12px Georgia";

ctx.textAlign = "center";

ctx.fillText(
    painting.title,
    painting.x + painting.width / 2,
    painting.y + painting.height + 25
);

ctx.textAlign = "left";
}
function drawPlayer() {

    /* USER AVATAR */

    if (selectedAvatar === "female") {

        // Female avatar - head
        ctx.fillStyle = "#f3a6b8";

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y - 12,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Female avatar - body
        ctx.fillStyle = "#e58f9f";

        ctx.fillRect(
            player.x - 10,
            player.y,
            20,
            25
        );

    } else {

        // Male avatar - head
        ctx.fillStyle = "#8ec5ff";

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y - 12,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Male avatar - body
        ctx.fillStyle = "#4f7fe8";

        ctx.fillRect(
            player.x - 10,
            player.y,
            20,
            25
        );

    }


    // Name above the avatar

    ctx.fillStyle = "#222";

    ctx.font = "12px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "You",
        player.x,
        player.y + 42
    );

    ctx.textAlign = "left";

}

/* OTHER PLAYER */


function drawOtherPlayer() {
    // Draw the temporary friend during frontend testing
    if (demoFriendEnabled) {
        drawRemotePlayer(demoFriend);
    }

    // Draw actual remote players when backend is connected
    Object.values(remotePlayers).forEach(function(remotePlayer) {
        drawRemotePlayer(remotePlayer);
    });
}


function drawRemotePlayer(remotePlayer) {
    const x = remotePlayer.x;

    const y = remotePlayer.y;


    ctx.beginPath();

    ctx.arc(
        x,
        y - 10,
        10,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#8ab4f8";

    ctx.fill();


    ctx.fillStyle =
        "#5c7cfa";

    ctx.fillRect(
        x - 10,
        y,
        20,
        25
    );


    ctx.fillStyle =
        "#222";

    ctx.font =
        "12px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        remotePlayer.avatar === "male" ? "Guest" : "Friend",
        x,
        y + 45
    );

    ctx.textAlign =
        "left";

}


/* MOVEMENT */

function updatePlayer() {

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        player.y -= player.speed;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        player.y += player.speed;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.x -= player.speed;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.x += player.speed;

    }


    /* BOUNDARIES */

    player.x =
        Math.max(
            60,
            Math.min(
                canvas.width - 60,
                player.x
            )
        );


    player.y =
        Math.max(
            90,
            Math.min(
                canvas.height - 75,
                player.y
            )
        );

    socket.emit("player-move", {
        x: player.x,
        y: player.y
    });

}
function checkPaintingInteraction() {

    let closestPainting = null;

    let closestDistance = Infinity;


    paintings.forEach(function(painting) {

        const paintingCenterX =
            painting.x +
            painting.width / 2;

        const paintingCenterY =
            painting.y +
            painting.height / 2;


        const distanceX =
            player.x -
            paintingCenterX;

        const distanceY =
            player.y -
            paintingCenterY;


        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );


        if (
            distance < 120 &&
            distance < closestDistance
        ) {

            closestDistance = distance;

            closestPainting = painting;

        }

    });


    if (closestPainting !== null) {

        showArtwork(closestPainting);

    }

}


/* GAME LOOP */

let gameRunning = false;


function startGame() {

    if (gameRunning) {

        return;

    }


    gameRunning = true;


    function gameLoop() {

        updatePlayer();

        drawGallery();

        requestAnimationFrame(
            gameLoop
        );

    }


    gameLoop();

}


/* CLICK PAINTING */

canvas.addEventListener(
    "click",
    function(event) {

        const rect =
            canvas.getBoundingClientRect();


        /*
         * The canvas is visually resized using CSS.
         * These values convert the mouse position
         * back to the original 1000 x 600 canvas.
         */

        const scaleX =
            canvas.width / rect.width;

        const scaleY =
            canvas.height / rect.height;


        const mouseX =
            (event.clientX - rect.left) *
            scaleX;


        const mouseY =
            (event.clientY - rect.top) *
            scaleY;


        paintings.forEach(
            function(painting) {

                if (

                    mouseX >= painting.x &&

                    mouseX <=
                        painting.x +
                        painting.width &&

                    mouseY >= painting.y &&

                    mouseY <=
                        painting.y +
                        painting.height

                ) {

                    showArtwork(painting);

                }

            }
        );

    }
);


/* ARTWORKcanvas.add POPUP */

function showArtwork(painting) {

    const artwork =
        document.getElementById(
            "artworkImage"
        );


    artwork.style.background =
        painting.color;


    document.getElementById(
        "artworkTitle"
    ).textContent =
        painting.title;


    document.getElementById(
        "artworkArtist"
    ).textContent =
        painting.artist;


    document.getElementById(
        "artworkYear"
    ).textContent =
        painting.year;


    document.getElementById(
        "artworkMedium"
    ).textContent =
        painting.medium;


    document.getElementById(
        "artworkDescription"
    ).textContent =
        painting.description;


    document.getElementById(
        "artworkModal"
    ).classList.add(
        "show"
    );

}


function closeArtwork() {

    document.getElementById(
        "artworkModal"
    ).classList.remove(
        "show"
    );

}


/* CHAT */

function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );


    const message =
        input.value.trim();


    if (message === "") {

        return;

    }


    socket.emit("chat-message", message);
    input.value = "";

}

socket.on("chat-message", function(message) {
    const messages = document.getElementById("chatMessages");
    const newMessage = document.createElement("div");
    const sender = document.createElement("strong");

    newMessage.className = "message";
    sender.textContent = message.sender + ": ";
    newMessage.appendChild(sender);
    newMessage.appendChild(document.createTextNode(message.text));
    messages.appendChild(newMessage);
    messages.scrollTop = messages.scrollHeight;
});

socket.on("player-move", function(remotePlayer) {
    remotePlayers[remotePlayer.id] = remotePlayer;
});

socket.on("player-joined", function(remotePlayer) {
    remotePlayers[remotePlayer.id] = {
        x: 850,
        y: 300,
        avatar: remotePlayer.avatar
    };
});

socket.on("player-left", function(playerId) {
    delete remotePlayers[playerId];
});


function handleChatKey(event) {

    if (
        event.key === "Enter"
    ) {

        sendMessage();

    }

}
function showArtwork(painting) {

    const artworkImage =
        document.getElementById("artworkImage");


    /* SHOW CLEAR PAINTING */

    artworkImage.style.backgroundImage =
        "url('" + painting.image + "')";

    artworkImage.style.backgroundSize =
        "contain";

    artworkImage.style.backgroundPosition =
        "center";

    artworkImage.style.backgroundRepeat =
        "no-repeat";


    /* SHOW INFORMATION */

    document.getElementById("artworkTitle").textContent =
        painting.title;

    document.getElementById("artworkArtist").textContent =
        painting.artist;

    document.getElementById("artworkYear").textContent =
        painting.year;

    document.getElementById("artworkMedium").textContent =
        painting.medium;

    document.getElementById("artworkDescription").textContent =
        painting.description;


    /* OPEN POPUP */

    document
        .getElementById("artworkModal")
        .classList.add("show");

}
function closeArtwork() {

    document
        .getElementById("artworkModal")
        .classList.remove("show");

}