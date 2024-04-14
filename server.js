const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

// Set the domain name
const domainName = "192.168.0.217"; // Change this to your desired domain name
const videoFolderPath = path.join("D:\\Movies");

app.use(express.static(path.join(__dirname, "public")));

// Basic route handling
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/videos", (req, res) => {
    fs.readdir(videoFolderPath, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error("Error reading directory:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const videoFiles = items
            .filter(item => item.isFile() && [".mp4", ".avi", ".mkv"].includes(path.extname(item.name).toLowerCase()))
            .map(item => item.name);
        const folders = items
            .filter(item => item.isDirectory())
            .map(item => item.name);
        console.log("Video files:", videoFiles);
        console.log("Folders:", folders);
        res.send({ videos: videoFiles, folders: folders });
    });
});


app.get("/videos/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(videoFolderPath, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        res.status(404).send("File not found");
        return;
    }

    // Get file stats
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Parse range header to support partial content requests
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });

        // Set response headers for partial content
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });

        // Stream the file
        file.pipe(res);
    } else {
        // Set response headers for full content
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        });

        // Stream the file
        fs.createReadStream(filePath).pipe(res);
    }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running at http://${domainName}:${port}`);
});
