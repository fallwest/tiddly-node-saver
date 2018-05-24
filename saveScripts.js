const getSaveScript = () => `
<script type="text/javascript">
if(!window.wikiModified){
	window.wikiModified = new Date();
}

var saveFile = function(fileUrl,content) {
	var saver = document.cookie.replace(/(?:(?:^|.*;\\s*)tiddlysaver\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1");
	if(saver === "yes") {
		jQuery.ajax({
			type: 'POST',    
			url: '/receive?loc=' + document.location.pathname.substring(1) + '&lastSaved=' + window.wikiModified.toISOString(),
			data: content,
			success: function(msg){
				console.log("Wiki saved.");
			},
			error: function(xhr, textStatus, errorThrown){
				alert("Save failed: " + xhr.responseText);
				}		
		});
		
		window.wikiModified = new Date();

    	return true;
	}else{
		r = ieSaveFile(fileUrl,content);
		if(!r)
			r = HTML5DownloadSaveFile(fileUrl,content);
		if(!r)
			r = manualSaveFile(fileUrl,content);
		return r;
	}
};

if(typeof config.options.chkHttpReadOnly === "boolean"){
	config.options.chkHttpReadOnly = false;
}
</script>`;

const getPostScript = () => "\n\n<!--POST-SCRIPT-END-->\n\n</body>\n</html>";

module.exports = {
  getSaveScript: getSaveScript,
  getPostScript: getPostScript
};
