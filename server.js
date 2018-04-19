const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();
const path = require("path");

const config = require("./config.json");
let tiddlerFileName;

const getWhiteListIndex = url => {
  return config.tiddlers.indexOf(url.substring(1)); // Remove leading slash
};

const setTiddlerFileName = url => {
  let index = getWhiteListIndex(url);
  if (index > -1) {
    tiddlerFileName = config.tiddlers[index];
  }
};

app.use((req, res, next) => {
  setTiddlerFileName(req.url);

  if (getWhiteListIndex(req.url) > -1) {
    // Set a client cookie if we server a whitelist tiddlywiki
    res.cookie("tiddlysaver", "yes", {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: false
    });
  }

  next(); // <-- important!
});

app.use(express.static(config.dropBoxFolder));
app.use(express.static(config.dropBoxFolder + "/files"));

app.post("/receive", (request, respond) => {
  let body = "";
  let filePath = path.join(config.dropBoxFolder, tiddlerFileName);

  if (!filePath || filePath.indexOf(".html") < 0) {
    throw new Error("Failed to get tiddler file path.");
  }

  request.on("data", data => {
    body += data.toString();
  });

  request.on("end", () => {
    fs.writeFile(filePath, body, "utf8", () => {
      respond.end();
    });
  });
});

const server = http.createServer(app);
server.listen(config.port, "localhost"); //restrict to localhost
server.on("listening", () => {
  console.log(
    "Tiddly server started on port %s at %s",
    server.address().port,
    server.address().address
  );
});
