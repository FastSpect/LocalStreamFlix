let scrollContainer = document.querySelector(".video-list");

scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY*8;
    scrollContainer.style.scrollBehavior = "smooth";
});

function fetchVideosAndFolders(endpoint) {
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
                // const span = document.createElement("span");
                const link = document.createElement("a");
                link.textContent = file;
                link.href = `/video/${encodeURIComponent(data.path + file)}`;
                // span.appendChild(link);
                div.appendChild(link);
                spanCount++;
            });

            data.folders.forEach((folder) => {
                if (spanCount % 3 === 0) {
                    div = document.createElement("div");
                    videoList.appendChild(div);
                }
                // const span = document.createElement("span");
                const link = document.createElement("a");
                link.textContent = folder;

                link.onclick = (event) => {
                    event.preventDefault();
                    const folderPath = `${data.path}/${encodeURIComponent(
                        folder
                    )}`;
                    fetchVideosAndFolders(`/videos${folderPath}/`);
                };
                // span.appendChild(link);
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
