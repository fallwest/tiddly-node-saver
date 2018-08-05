const getSaveScript = () => `
<script type="text/javascript">
var saveFile = function(fileUrl,content) {	
	jQuery.ajax({
		type: 'POST',    
		url: '/receive?loc=' + btoa(document.location.pathname.substring(1)) + '&lastSaved=' + window.wikiModified.toISOString(),
		data: content,
		success: function(msg) {
			window.wikiModified = new Date();
			console.log("Wiki saved.");
		},
		error: function(xhr, textStatus, errorThrown) {
			var saveFailedMessage = "Save failed";
			clearMessage();
			displayMessage(saveFailedMessage);
			alert(saveFailedMessage + ": " + xhr.responseText);
		}		
	});

	return true;
};

if(typeof config.options.chkHttpReadOnly === "boolean"){
	config.options.chkHttpReadOnly = false;
}

if(!window.wikiModified){
	window.wikiModified = new Date();
}
</script>`;

const getPostScript = () => "\n\n<!--POST-SCRIPT-END-->\n\n</body>\n</html>";

module.exports = {
  getSaveScript: getSaveScript,
  getPostScript: getPostScript
};
