const getSaveScript = () => {
return `
<script type="text/javascript">
var saveFile = function(fileUrl,content) {
	var saver = document.cookie.replace(/(?:(?:^|.*;\\s*)tiddlysaver\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1");
	if(saver === "yes") {
        jQuery.ajax({
            type: 'POST',    
            url: '/receive?loc=' + document.location.pathname.substring(1),
    		data: content,
            success: function(msg){
                console.log("Wiki saved.");
            }
        });
    	
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
</script>`;

};

const getPostScript = () => {return "\n\n<!--POST-SCRIPT-END-->\n\n</body>\n</html>";
};

module.exports = {getSaveScript: getSaveScript,
                  getPostScript: getPostScript };