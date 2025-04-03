//{{{
config.macros.DropContent = {

    handler: function (place, macroName, params, wikifier, paramString, tiddler) {
        var holder = createTiddlyElement(place, "div", "holder", null, "Drop your file here", {
            style: "border-style: dotted;width:150px;padding: 50px 0;text-align: center;"
        });

        createTiddlyElement(place, "input", "filename", null, null, { value: "calendar.ics" });
        select_el = createTiddlyElement(place, "select", "mimetype");
        createTiddlyElement(select_el, "option", null, null, "text/calendar");
        createTiddlyElement(select_el, "option", null, null, "text/plain");
        createTiddlyElement(select_el, "option", null, null, "application/json");
        createTiddlyElement(select_el, "option", null, null, "text/csv");
        createTiddlyElement(select_el, "option", null, null, "text/xml");

        filename = document.getElementById("filename");
        mimetype = document.getElementById("mimetype");
        filename.onclick = function (e) {
            e.target.value = '';
        }

        holder.ondragover = function () {
            this.className = 'hover';
            return false;
        };
        holder.ondragend = function () {
            this.className = '';
            return false;
        };
        holder.ondrop = function (e) {
            this.className = '';
            this.content = '';
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                console.log(event.target);
                this.content = "<script>\ndownload_content(\"" + filename.value + "\", ";
                this.content += "\`" + event.target.result + "\`, ";
                this.content += "\"" + mimetype.value + "\")\n</script>";
                var tiddlername = store.getTiddler(filename.value) == null ? filename.value : filename.value + "_" + Date.now()
                store.saveTiddler(tiddlername, tiddlername, this.content, config.options.txtUserName, new Date());
            };
            reader.readAsText(file);
            return false;
        }
    }
};

function download_content(filename, text, type = "text/plain") {
    // Create an invisible A element
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = window.URL.createObjectURL(
        new Blob([text], { type })
    );

    // Use download attribute to set set desired file name
    a.setAttribute("download", filename);

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}
//}}}
