/***
|Description|Insert text documents as new tiddlers that download content when opened. Note: requires the [[InlineJavascriptPlugin|https://tiddlytools.com/Classic/#InlineJavascriptPlugin]].|
|Source     |https://github.com/fallwest/tiddlynodesaver/blob/james.westfall/drop_content_plugin/tiddlywikiplugins/dropcontent/DropContentMacro.js|
|Version    |0.0.1|
|Author     |James Westfall|
|License    |[[MIT|https://github.com/fallwest/tiddlynodesaver/blob/james.westfall/drop_content_plugin/LICENSE]]|
!!!Usage
Insert the {{{<<DropContent>>}}} macro in a tiddler and drag text files onto the drop zone:

<<DropContent>>
***/
//{{{
    config.macros.DropContent = {

        handler: function (place, macroName, params, wikifier, paramString, tiddler) {
            var holder = createTiddlyElement(place, "div", "holder", null, "Drop your file here", {
                style: "border-style: dotted;width:150px;padding: 50px 0;text-align: center;"
            });
    
            holder.ondragover = function () {
                return false;
            };
            holder.ondragend = function () {
                return false;
            };
    
            holder.ondrop = function (e) {
                this.className = "";
                this.content = "";
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    this.content = "<script>\nHTML5DownloadSaveFile(\"" + file.name + "\", ";
                    this.content += "\`" + event.target.result + "\`)\n</script>";
                    const tiddlername = store.tiddlerExists(file.name) ? file.name + "_" + Date.now() : file.name;
                    store.saveTiddler(tiddlername, tiddlername, this.content, config.options.txtUserName, new Date());
                };
                reader.readAsText(file);
                return false;
            }
        }
    };
    //}}}
