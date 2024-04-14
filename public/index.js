fetch("/videos")
    .then((response) => response.json())
    .then((data) => {
        const videoList = document.getElementById("video-list");
        data.videos.forEach((file) => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.textContent = file;
            link.href = `/videos/${encodeURIComponent(file)}`;
            listItem.appendChild(link);
            videoList.appendChild(listItem);
        });
        data.folders.forEach((folder) => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.textContent = folder;
            link.href = `/videos/${encodeURIComponent(folder)}`;
            listItem.appendChild(link);
            videoList.appendChild(listItem);
        });
    })
    .catch((error) => console.error("Error fetching videos:", error));
