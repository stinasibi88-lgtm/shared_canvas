const API_BASE = "";
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



/* SELECT THEME AND CREATE A REAL BACKEND ROOM */



async function selectThemeRoom(theme) {
    selectedTheme = theme;

    try {
        const response = await fetch(`${API_BASE}/api/gallery/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: galleryName || "My Shared Gallery",
                theme: selectedTheme
            })
        });

        if (!response.ok) {
            throw new Error(`Gallery creation failed: ${response.status}`);
        }

        const data = await response.json();

        currentRoom = data.code;

        if (!currentRoom) {
            throw new Error("The backend did not return a room code.");
        }

        // Keep your existing painting display working for now.
        paintings = themePaintings[theme] || [];
        loadPaintingImages();

        showRoomCreatedPage(currentRoom);

    } catch (error) {
        console.error("Gallery creation failed:", error);
        alert(
            "Could not create the gallery. Please check that the backend is running."
        );
    }
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



/* JOIN AN EXISTING GALLERY */

async function joinGallery() {
    const code = document
        .getElementById("roomCode")
        .value
        .trim();

    if (!code) {
        alert("Please enter a room code.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/api/gallery/rooms/${encodeURIComponent(code)}`
        );

        if (!response.ok) {
            alert("Gallery not found.");
            return;
        }

        const data = await response.json();

        currentRoom = data.code;
        galleryName = data.name;
        selectedTheme = data.theme;
        paintings = themePaintings[selectedTheme] || [];
        loadPaintingImages();

        showAvatarPage();

    } catch (error) {
        console.error("Joining gallery failed:", error);
        alert("Could not connect to the backend.");
    }
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

function makePainting(title, artist, year, medium, description, image) {
    return {
        x: 100,
        y: 120,
        width: 110,
        height: 130,
        title: title,
        artist: artist,
        year: year,
        medium: medium,
        description: description,
        color: "#b8a58c",
        image: image
    };
}

const themePaintings = {
    "Renaissance": [
        makePainting("Almond Blossoms", "Vincent van Gogh", "1890", "Oil on canvas", "A flowering almond tree symbolizing new life.", "images/Renaissance/Almondblossoms.jpeg"),
        makePainting("Primavera", "Sandro Botticelli", "c. 1480", "Tempera on panel", "A richly detailed mythological scene.", "images/Renaissance/Botticelli-primavera.jpg"),
        makePainting("Mona Lisa", "Leonardo da Vinci", "1503–1519", "Oil on panel", "One of the world's most famous portraits.", "images/Renaissance/MonaLisa.jpg"),
        makePainting("Sistine Madonna", "Raphael", "c. 1512", "Oil on canvas", "A celebrated Madonna painting.", "images/Renaissance/SistineMadonna.webp"),
        makePainting("The Assumption of the Virgin", "Titian", "1516–1518", "Oil painting", "A monumental religious scene.", "images/Renaissance/The Assumption of the Virgin.jpg"),
        makePainting("The Last Supper", "Leonardo da Vinci", "1495–1498", "Wall painting", "Leonardo's famous depiction of the Last Supper.", "images/Renaissance/thelastsupper.jpg"),
        makePainting("Lady with an Ermine", "Leonardo da Vinci", "c. 1489–1491", "Oil on panel", "A Renaissance portrait.", "images/Renaissance/The_Lady_with_an_Ermine.jpg"),
        makePainting("The School of Athens", "Raphael", "1509–1511", "Fresco", "Great philosophers gathered in classical architecture.", "images/Renaissance/The_School_of_Athens.jpg")
    ],

    "Impressionism": [
        makePainting("Braiding Her Hair", "Verify attribution", "Unknown", "Unknown", "A figure-focused artwork.", "images/Impressionism/Braiding her hair.jpg"),
        makePainting("Clair de lune", "Verify attribution", "Unknown", "Unknown", "An atmospheric moonlight-themed artwork.", "images/Impressionism/Clair de lune.jpg"),
        makePainting("Jeune Femme dans les vignes", "Verify attribution", "Unknown", "Unknown", "A young woman among the vines.", "images/Impressionism/Jeune Femme dans les vignes .jpg"),
        makePainting("Picnic in May", "Verify attribution", "Unknown", "Unknown", "An outdoor scene.", "images/Impressionism/Picnic in May.jpg"),
        makePainting("Sistine Madonna", "Raphael", "c. 1512", "Oil on canvas", "A celebrated Madonna composition.", "images/Impressionism/Sistine Madonna.webp"),
        makePainting("The Beet Harvest", "Verify attribution", "Unknown", "Unknown", "A scene of agricultural work.", "images/Impressionism/The Beet harvest.jpg"),
        makePainting("The Yellow Fields", "Verify attribution", "Unknown", "Unknown", "A landscape dominated by yellow fields.", "images/Impressionism/The Yellow Fields.jpg"),
        makePainting("Walchensee Panorama", "Verify attribution", "Unknown", "Unknown", "A panoramic landscape view.", "images/Impressionism/Walchensee Panorama, View from the Kanzel.jpg")
    ],

    "Surrealism": [
        makePainting("Amour sacré, Amour profane", "Verify attribution", "Unknown", "Unknown", "A symbolic composition.", "images/Surrealism/Amour sacré, Amour profane.jpg"),
        makePainting("The Couple", "Verify attribution", "Unknown", "Unknown", "An artwork depicting a couple.", "images/Surrealism/Couple(La_coppia).jpg"),
        makePainting("Deux personnes seules", "Verify attribution", "Unknown", "Unknown", "A composition featuring two solitary figures.", "images/Surrealism/Deux personnes seules.jpg"),
        makePainting("Dinamica del potere", "Verify attribution", "Unknown", "Unknown", "An artwork titled Dynamics of Power.", "images/Surrealism/Dinamica_del_potere.jpg"),
        makePainting("Island Moon before the World", "Verify attribution", "Unknown", "Unknown", "An imaginative scene.", "images/Surrealism/Island Moon before the World.jpg"),
        makePainting("Kamo", "Verify attribution", "Unknown", "Unknown", "An artwork titled Kamo.", "images/Surrealism/Kamo.jpg"),
        makePainting("Maria Petringa Martini", "Verify attribution", "Unknown", "Unknown", "An artwork with this title.", "images/Surrealism/Maria Petringa Martini.jpg"),
        makePainting("Plumeria Night", "Verify attribution", "Unknown", "Unknown", "A night-themed artwork.", "images/Surrealism/Plumeria Night.jpg")
    ],

    "Expressionism": [
        makePainting("Dance Around the Golden Calf", "Verify attribution", "Unknown", "Unknown", "An expressive scene with energetic figures.", "images/Expressionism/dance around the golden calf.jpg"),
        makePainting("Dr Rosa Schapire", "Verify attribution", "Unknown", "Unknown", "A portrait of Dr Rosa Schapire.", "images/Expressionism/dr rosa schapire.jpg"),
        makePainting("The Red Room", "Verify attribution", "Unknown", "Unknown", "A vivid interior scene.", "images/Expressionism/red room.webp"),
        makePainting("Self-Portrait with a Chinese Lantern Plant", "Verify attribution", "Unknown", "Unknown", "A self-portrait with a plant.", "images/Expressionism/self portrait with a chinese lantern plant.jpg"),
        makePainting("Street, Berlin", "Verify attribution", "Unknown", "Unknown", "An urban street scene.", "images/Expressionism/street, berlin.webp"),
        makePainting("The Blue Rider", "Verify attribution", "Unknown", "Unknown", "An artwork titled The Blue Rider.", "images/Expressionism/The blue rider.jpg"),
        makePainting("The Large Blue Horses", "Franz Marc", "1911", "Oil on canvas", "A colourful composition of blue horses.", "images/Expressionism/The large blue horses.webp"),
        makePainting("The Scream", "Edvard Munch", "1893", "Oil, tempera and pastel", "A famous image expressing anxiety.", "images/Expressionism/The scream.webp")
    ],

    "Japanese Art": [
        makePainting("Sunrise over the Eastern Sea", "Fujishima Takeji", "Unknown", "Unknown", "A Japanese seascape at sunrise.", "images/Japanese-art/Fujishima-Takeji-Sunrise-over-the-Eastern-Sea.webp"),
        makePainting("Fuji from Kawaguchi Lake", "Hiroshi Yoshida", "Unknown", "Print", "A landscape depicting Mount Fuji.", "images/Japanese-art/Hiroshi-Yoshida-Fuji-from-Kawaguchi-Lake.webp"),
        makePainting("The Great Wave", "Katsushika Hokusai", "c. 1831", "Woodblock print", "A celebrated print of a towering wave.", "images/Japanese-art/Katsushika-Hokusai-The Great Wave.webp"),
        makePainting("Tiger", "Kawanabe Kyosai", "Unknown", "Unknown", "A Japanese artwork depicting a tiger.", "images/Japanese-art/Kawanabe-Kyosai-Tiger.webp"),
        makePainting("Woman Wiping Sweat", "Kitagawa Utamaro", "Unknown", "Woodblock print", "A print depicting a woman.", "images/Japanese-art/Kitagawa-Utamaro-Woman-Wiping-Sweat-.webp"),
        makePainting("727", "Takashi Murakami", "1996", "Acrylic painting", "A contemporary artwork by Murakami.", "images/Japanese-art/Takashi-Murakami-727.webp"),
        makePainting("Japanese Spirit No. 14", "Tenmyouya Hisashi", "Unknown", "Unknown", "A contemporary work inspired by Japanese visual traditions.", "images/Japanese-art/Tenmyouya-Hisashi-Japanese-Spirit-No.-14.webp"),
        makePainting("Pumpkin", "Yayoi Kusama", "Unknown", "Unknown", "A pumpkin artwork by Yayoi Kusama.", "images/Japanese-art/Yayoi-Kusama-Pumpkin.webp")
    ],

    "Modern Art": [
        makePainting("The Two Fridas", "Frida Kahlo", "1939", "Oil on canvas", "A double self-portrait.", "images/Modern-art/Frida Kahlo, The Two Fridas.jpg"),
        makePainting("The Harlequin's Carnival", "Joan Miró", "1924–1925", "Oil on canvas", "A playful, dreamlike composition.", "images/Modern-art/Joan Miró, The Harlequin’s Carnival.jpg"),
        makePainting("Black Square", "Kazimir Malevich", "1915", "Oil on canvas", "A landmark abstract composition.", "images/Modern-art/Kazimir Malevich, Black Square.png"),
        makePainting("Nude Descending a Staircase", "Marcel Duchamp", "1912", "Oil on canvas", "A modernist depiction of movement.", "images/Modern-art/Nude descending staircase.jpg"),
        makePainting("Broadway Boogie Woogie", "Piet Mondrian", "1942–1943", "Oil on canvas", "A geometric abstract work inspired by New York.", "images/Modern-art/Piet Mondrian, Broadway Boogie Woogie.jpg"),
        makePainting("The Persistence of Memory", "Salvador Dalí", "1931", "Oil on canvas", "A surrealist painting featuring melting clocks.", "images/Modern-art/Salvador Dalí, The Persistence of Memory.jpg"),
        makePainting("The Red Studio", "Henri Matisse", "1911", "Oil on canvas", "A studio interior dominated by red.", "images/Modern-art/The red studio.jpg"),
        makePainting("Composition VII", "Wassily Kandinsky", "1913", "Oil on canvas", "An abstract composition of forms and colours.", "images/Modern-art/Wassily Kandinsky, Composition VII.jpg")
    ],

    "Romanticism": [
        makePainting("Napoleon Crossing the Alps", "Jacques-Louis David", "1801", "Oil on canvas", "An idealised equestrian portrait of Napoleon.", "images/Romanticism/Napoleon Crossing the Alps by Jacques-Louis David.jpg"),
        makePainting("The Hay Wain", "John Constable", "1821", "Oil on canvas", "A celebrated English countryside landscape.", "images/Romanticism/The Hay Wain by John Constable.jpg"),
        makePainting("The Third of May 1808", "Francisco Goya", "1814", "Oil on canvas", "A dramatic depiction of wartime execution.", "images/Romanticism/The Third of May 1808.jpg"),
        makePainting("Wanderer above the Sea of Fog", "Caspar David Friedrich", "c. 1818", "Oil on canvas", "A lone figure looks across a misty landscape.", "images/Romanticism/Wanderer above the Sea of Fog.jpg"),
        makePainting("The Kiss", "Francesco Hayez", "1859", "Oil on canvas", "A romantic scene of two figures embracing.", "images/Romanticism/‘The Kiss’ by Francesco Hayez.jpg"),
        makePainting("The Nightmare", "Henry Fuseli", "1781", "Oil on canvas", "A dramatic, dreamlike scene.", "images/Romanticism/‘The Nightmare’ by Henry Fuseli.jpg"),
        makePainting("The Ninth Wave", "Ivan Aivazovsky", "1850", "Oil on canvas", "A dramatic seascape of survivors among waves.", "images/Romanticism/‘The Ninth Wave’ by Ivan Aivazovsky.jpg"),
        makePainting("The Raft of the Medusa", "Théodore Géricault", "1818–1819", "Oil on canvas", "A monumental scene of shipwreck survivors.", "images/Romanticism/‘The Raft of the Medusa’ by Théodore Géricault.jpg")
    ],

    "Baroque": [
        makePainting("Domine, Quo Vadis?", "Annibale Carracci", "Unknown", "Unknown", "A biblical scene.", "images/Baroque/annibale-carracci-domine-quo-vadis.jpg"),
        makePainting("The Calling of Saint Matthew", "Caravaggio", "1599–1600", "Oil on canvas", "A biblical scene using dramatic light and shadow.", "images/Baroque/caravaggio the calling of saint matthew.jpg"),
        makePainting("David with the Head of Goliath", "Caravaggio", "c. 1610", "Oil on canvas", "A dramatic biblical scene.", "images/Baroque/caravaggio-david-with-the-head-of-goliath.jpg"),
        makePainting("Lamentation of Christ", "Verify attribution", "Unknown", "Unknown", "A devotional scene depicting Christ.", "images/Baroque/carracci-lamentation-of-christ.jpg"),
        makePainting("The Penitent Magdalene", "Georges de La Tour", "Unknown", "Unknown", "A contemplative scene illuminated by candlelight.", "images/Baroque/georges-de-la-tour-penitent-magdalene.jpg"),
        makePainting("Judith Beheading Holofernes", "Verify attribution", "Unknown", "Unknown", "A dramatic biblical scene.", "images/Baroque/judith-beheading-holofernes.jpg"),
        makePainting("The Rape of the Sabine Women", "Nicolas Poussin", "Unknown", "Unknown", "A complex historical scene.", "images/Baroque/nicolas-poussin-rape-of-the-sabine-women.jpg"),
        makePainting("The Night Watch", "Rembrandt van Rijn", "1642", "Oil on canvas", "A large group portrait of a civic guard.", "images/Baroque/the-night-watch.jpeg")
    ],

    "Pop Art": [
        makePainting("Campbell's Soup Cans", "Andy Warhol", "1962", "Synthetic polymer paint", "A famous series featuring soup cans.", "images/Pop-art/Campbells can soup.webp"),
        makePainting("Drowning Girl", "Roy Lichtenstein", "1963", "Oil and synthetic polymer paint", "A comic-inspired Pop Art image.", "images/Pop-art/Drowning girl - Roy Lichtenstein.webp"),
        makePainting("Flag", "Jasper Johns", "1954–1955", "Encaustic and collage", "An artwork exploring the American flag.", "images/Pop-art/Flag - Jasper Johns.webp"),
        makePainting("Girl with Ball", "Roy Lichtenstein", "1961", "Oil on canvas", "A Pop Art work inspired by comic imagery.", "images/Pop-art/Girl with ball - Roy Lichtenstein.webp"),
        makePainting("Marilyn", "Andy Warhol", "1967", "Screenprint", "A screen-print portrait of Marilyn Monroe.", "images/Pop-art/Marilyn Andy Warhol.webp"),
        makePainting("Pool with Two Figures", "David Hockney", "1972", "Acrylic on canvas", "A colourful scene by a swimming pool.", "images/Pop-art/Pool 2 figures - David Hockney.webp"),
        makePainting("Still Life No. 20", "Tom Wesselmann", "Unknown", "Unknown", "A Pop Art still-life composition.", "images/Pop-art/Still life no. 20 - Tom Wesselmann.webp"),
        makePainting("Whaam!", "Roy Lichtenstein", "1963", "Magna on canvas", "A dramatic comic-inspired diptych.", "images/Pop-art/Wham!.webp")
    ],

    "Portraits": [
        makePainting("American Gothic", "Grant Wood", "1930", "Oil on beaverboard", "A well-known portrait of two figures.", "images/Portraits/American Gothic by Grant Wood.jpg"),
        makePainting("Girl with a Pearl Earring", "Johannes Vermeer", "c. 1665", "Oil on canvas", "A famous portrait-like painting of a young woman.", "images/Portraits/Girl-with-a-Pearl-earring.jpg"),
        makePainting("Mona Lisa", "Leonardo da Vinci", "1503–1519", "Oil on poplar panel", "A celebrated Renaissance portrait.", "images/Portraits/Mona-Lisa-by-Leonardo-da-Vinci.jpg"),
        makePainting("Napoleon Crossing the Alps", "Jacques-Louis David", "1801", "Oil on canvas", "An idealised equestrian portrait of Napoleon.", "images/Portraits/Napoleon Crossing the Alps by Jacques-Louis David.jpg"),
        makePainting("Portrait of Adele Bloch-Bauer", "Gustav Klimt", "1907", "Oil and gold leaf", "A richly ornamented portrait.", "images/Portraits/Portrait of Adele Bloch-Bauer.jpg"),
        makePainting("Portrait of Dora Maar", "Pablo Picasso", "1937", "Oil on canvas", "A portrait of Dora Maar.", "images/Portraits/Portrait of Dora Maar by Pablo Picasso.jpg"),
        makePainting("The Arnolfini Portrait", "Jan van Eyck", "1434", "Oil on oak panel", "A detailed early Netherlandish portrait.", "images/Portraits/The Arnolfini Portrait by Jan van Eyck.jpg"),
        makePainting("Whistler's Mother", "James McNeill Whistler", "1871", "Oil on canvas", "A famous portrait of the artist's mother.", "images/Portraits/Whistler’s Mother by James McNeill Whistler.jpg")
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
    const input = document.getElementById("chatInput");
    const message = input.value.trim();

    if (message === "") {
        return;
    }

    const messages = document.getElementById("chatMessages");
    const newMessage = document.createElement("div");
    const sender = document.createElement("strong");

    newMessage.className = "message";
    sender.textContent = "You: ";

    newMessage.appendChild(sender);
    newMessage.appendChild(document.createTextNode(message));
    messages.appendChild(newMessage);

    messages.scrollTop = messages.scrollHeight;

    socket.emit("chat-message", message);

    input.value = "";
    input.focus();
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