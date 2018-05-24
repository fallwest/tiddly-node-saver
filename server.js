const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();
const path = require("path");
const moment = require("moment");
const connectInject = require("./connect-inject");
const saveScripts = require("./saveScripts");

const config = require("./config.json");

const postScriptPattern = /<\!--POST-SCRIPT-START-->/;
const postScriptTagLength = 24;

// Remove leading slash
const getWhiteListIndex = url => config.tiddlers.indexOf(url.substring(1)); 

app.use((req, res, next) => {
  if (getWhiteListIndex(req.url) > -1) {
    // Set a client cookie if we serve a whitelist tiddlywiki
    res.cookie("tiddlysaver", "yes", {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: false
    });
  }

  next(); // <-- important!
});

app.use(
  connectInject({
    include: config.tiddlers,
    rules: [
      {
        match: postScriptPattern,
        fn: function(w, s) {
          return w + s;
        }
      }
    ],
    snippet: saveScripts.getSaveScript()
  })
);

app.use(express.static(config.dropBoxFolder));
app.use(express.static(config.dropBoxFolder + "/files"));

app.post("/receive", (request, respond) => {
  let body = "";
  const tiddlyFile = request.query.loc;

  if (!getWhiteListIndex(tiddlyFile)) {
    throw new Error("Tried to save tiddler not in white list.");
  }

  const filePath = path.join(config.dropBoxFolder, tiddlyFile);

  if (!filePath || filePath.indexOf(".html") < 0) {
    throw new Error("Failed to get tiddler file path.");
  }

  const fileTime = fs.statSync(filePath).mtime;
  const lastSaved =  moment.utc(fileTime);
  const senderLastSaved = moment.utc(request.query.lastSaved);
  const conflict = lastSaved.isAfter(senderLastSaved, "second");
  
  if(conflict){
    const saveConflictMessage = `Dropbox file is newer. Local: ${senderLastSaved}. Server: ${lastSaved}`;
    console.error(saveConflictMessage);
    respond.status(500).send(saveConflictMessage);
    
    return;
  }    

  request.on("data", data => {
    body += data.toString();
  });

  request.on("end", () => {    
    const insertPoint =
      body.search(postScriptPattern) + postScriptTagLength;

    //Remove save script when saving
    let content = body.substring(0, insertPoint);
    content += saveScripts.getPostScript();

    fs.writeFile(filePath, content, "utf8", () => {
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
