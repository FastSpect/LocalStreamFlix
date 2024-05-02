// Server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

const domainName = "192.168.0.217";

app.use(express.static(path.join(__dirname, "index")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index", "index.html"));
});

app.get("/videos*", (req, res) => {
    const folder = path.join(req.params[0]);
    console.log("Current Folder:", folder);
    fs.readdir(folder, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error("Error reading directory:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const videoFiles = items
            .filter(
                (item) =>
                    item.isFile() &&
                    [".mp4", ".avi", ".mkv"].includes(
                        path.extname(item.name).toLowerCase()
                    )
            )
            .map((item) => item.name);
        const folders = items
            .filter((item) => item.isDirectory())
            .map((item) => item.name);
        console.log("Video files:", videoFiles);
        console.log("Folders:", folders);
        res.send({ videos: videoFiles, folders: folders, path: folder });
    });
});

app.get("/video*", (req, res) => {
    var filename = req.params[0].substring(1);

    if (!fs.existsSync(filename)) {
        res.status(404).send("File not found");
        return;
    }

    const stat = fs.statSync(filename);
    const fileSize = stat.size;

    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filename, { start, end });

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });

        file.pipe(res);
    } else {
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        });

        fs.createReadStream(filename).pipe(res);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://${domainName}:${port}`);
});
