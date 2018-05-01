const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();
const path = require("path");
const connectInject = require("connect-inject");
const saveScripts = require("./saveScripts");
 
const config = require("./config.json");
 
const getWhiteListIndex = url => {
  return config.tiddlers.indexOf(url.substring(1)); // Remove leading slash
};
 
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
 
app.use(connectInject({
    rules: [{
       match: /<\!--POST-SCRIPT-START-->/,
        fn: function(w, s) {
          return w + s;
      }
    }],
    snippet: saveScripts.getSaveScript()
}));
 
app.use(express.static(config.dropBoxFolder));
app.use(express.static(config.dropBoxFolder + "/files"));
 
app.post("/receive", (request, respond) => {
  let body = "";
  const tiddlyFile = request.query.loc;
 
  if(!getWhiteListIndex(tiddlyFile)) {
    throw new Error("Tried to save tiddler not in white list.");  
  }
 
  let filePath = path.join(config.dropBoxFolder, tiddlyFile);
 
  if (!filePath || filePath.indexOf(".html") < 0) {
    throw new Error("Failed to get tiddler file path.");
  }
 
  request.on("data", data => {
    body += data.toString();
  });
 
  request.on("end", () => {    
    const postScriptMarker = "<!--POST-SCRIPT-START-->";
    const insertPoint = body.indexOf(postScriptMarker) + postScriptMarker.length;
    
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