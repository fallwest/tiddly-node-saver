/***
|Description|Insert text documents as new tiddlers that download content when opened|
|Source     |https://github.com/fallwest/tiddly-node-saver/blob/james.westfall/drop_content_plugin/tiddlywiki-plugins/drop-content/DropContentMacro.js|
|Version    |0.0.1|
|Author     |James Westfall|
|License    |[[MIT|https://github.com/fallwest/tiddly-node-saver/blob/james.westfall/drop_content_plugin/LICENSE]]|
!!!Usage
Insert the {{{<<DropContent>>}}} macro in a tiddler and drag text files onto the drop zone. Chose the appropriate mime-type before drag-and-dropping:

<<DropContent>>
***/
//{{{
    config.macros.DropContent = {

        handler: function (place, macroName, params, wikifier, paramString, tiddler) {
            const holder = createTiddlyElement(place, "div", "holder", null, "Drop your file here", {
                style: "border-style: dotted;width:150px;padding: 50px 0;text-align: center;"
            });
    
            const mimetype = createTiddlyElement(place, "select", "mimetype");
    
            createTiddlyElement(mimetype, "option", null, null, "text/calendar");
            createTiddlyElement(mimetype, "option", null, null, "text/plain");
            createTiddlyElement(mimetype, "option", null, null, "application/json");
            createTiddlyElement(mimetype, "option", null, null, "text/csv");
            createTiddlyElement(mimetype, "option", null, null, "text/xml");
    
            holder.ondrop = function (e) {
                this.className = "";
                this.content = "";
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    this.content = "<script>\ndownload_content(\"" + file.name + "\", ";
                    this.content += "\`" + event.target.result + "\`, ";
                    this.content += "\"" + mimetype.value + "\")\n</script>";
                    const tiddlername = store.tiddlerExists(file.name) ? file.name + "_" + Date.now() : file.name;
                    store.saveTiddler(tiddlername, tiddlername, this.content, config.options.txtUserName, new Date());
                };
                reader.readAsText(file);
                return false;
            }
        }
    };
    
    function download_content(filename, text, type = "text/plain") {
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
    
        a.href = window.URL.createObjectURL(
            new Blob([text], { type })
        );
    
        a.setAttribute("download", filename);
        a.click();
    
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }
    //}}}
