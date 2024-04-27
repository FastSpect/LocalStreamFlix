let scrollContainer = document.querySelector(".video-list");
let selection = -1;

scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY * 8;
    scrollContainer.style.scrollBehavior = "smooth";
});

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        select(1);
    } else if (event.code === "ArrowLeft") {
        select(-1);
    } else if (event.code === "ArrowUp") {
        select(-3);
    } else if (event.code === "ArrowDown") {
        select(3);
    }
});

function select(value) {
    if (selection === -1) {
        const anchor = document.querySelector("a");
        anchor.classList.add("selected");
        selection = 0;
    } else {
        const anchors = document.querySelectorAll("a");
        anchors.item(selection).classList.remove("selected");
        selection += value;
        if (selection < 0) selection = anchors.length - 1;
        else if (selection >= anchors.length) selection = 0;
        const selectedAnchor = anchors.item(selection);
        selectedAnchor.classList.add("selected");
    }
}

function fetchVideosAndFolders(endpoint) {
    selection = 0;
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            const videoList = document.querySelector(".video-list");
            videoList.innerHTML = "";
            let div;
            let spanCount = 0;

            data.videos.forEach((file) => {
                if (spanCount % 3 === 0) {
                    div = document.createElement("div");
                    videoList.appendChild(div);
                }
                const link = document.createElement("a");
                link.textContent = file;
                link.href = `/video/${encodeURIComponent(data.path + file)}`;
                div.appendChild(link);
                spanCount++;
            });

            data.folders.forEach((folder) => {
                if (spanCount % 3 === 0) {
                    div = document.createElement("div");
                    videoList.appendChild(div);
                }
                const link = document.createElement("a");
                link.textContent = folder;

                link.onclick = (event) => {
                    event.preventDefault();
                    const folderPath = `${data.path}/${encodeURIComponent(
                        folder
                    )}`;
                    fetchVideosAndFolders(`/videos${folderPath}/`);
                };
                div.appendChild(link);
                spanCount++;
            });
            videoList.appendChild(div);
        })
        .catch((error) =>
            console.error("Error fetching videos and folders:", error)
        );
}

fetchVideosAndFolders("/videos/Movies/");
