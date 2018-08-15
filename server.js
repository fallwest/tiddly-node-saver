const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();
const path = require("path");
const atob = require("atob");
const moment = require("moment");
const connectInject = require("./connect-inject");
const saveScripts = require("./saveScripts");

const config = require("./config.json");

const postScriptPattern = /<\!--POST-SCRIPT-START-->/;
const postScriptTagLength = 24;

app.use(
  connectInject({
    include: ".htm",
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

app.use(express.static(config.dropBoxFolder, {
        etag: false
}));

config.extraFolders.forEach((folder) => {
  app.use(express.static(`${config.dropBoxFolder}/${folder}`));  
});

app.use(express.static(config.dropBoxFolder + "/files"));

app.post("/receive", (request, respond) => {
  let body = "";
  const tiddlyFileBase64 = request.query.loc;
  const tiddlyFile = atob(tiddlyFileBase64);
  const filePath = path.join(config.dropBoxFolder, tiddlyFile);

  if (!filePath || filePath.indexOf(".html") < 0) {
    const failedToGetPathMessage = "Failed to get tiddler file path.";
    console.error(failedToGetPathMessage);
    respond.status(500).send(failedToGetPathMessage);
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
