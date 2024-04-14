function fetchVideosAndFolders(endpoint) {
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            const videoList = document.getElementById("video-list");

            videoList.innerHTML = "";

            console.log("Current Path:", data.path);

            data.videos.forEach((file) => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.textContent = file;
                link.href = `/video/${encodeURIComponent(data.path + file)}`;
                listItem.appendChild(link);
                videoList.appendChild(listItem);
            });

            data.folders.forEach((folder) => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.textContent = folder;

                link.onclick = (event) => {
                    event.preventDefault();
                    const folderPath = `${data.path}/${encodeURIComponent(
                        folder
                    )}`;
                    fetchVideosAndFolders(`/videos${folderPath}/`);
                };
                listItem.appendChild(link);
                videoList.appendChild(listItem);
            });
        })
        .catch((error) =>
            console.error("Error fetching videos and folders:", error)
        );
}

fetchVideosAndFolders("/videos/Movies/");
