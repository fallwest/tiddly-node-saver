## Installation

### Add saver code to your TiddlyWiki	

Create a new tiddler with the following code:

	//{{{
	var saveFile = function(fileUrl,content) {
		var saver = document.cookie.replace(/(?:(?:^|.*;\s*)tiddlysaver\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if(saver === "yes") {
	        jQuery.ajax({
	            type: 'POST',    
	            url: '/receive',
	    		data: content,
	            success: function(msg){
	                console.log(msg);
	            }
	        });
	    	console.log("sent");
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
	
	//}}}

Tag with SystemConfig and save. This code will only override default saving behaviour if your tiddlywiki i served by tiddly-node-saver.

### Configure and install server 

Clone or download tiddly-node-saver

Replace config file values with your own in config.json: 

	{
	 "dropBoxFolder" : "C:\\Users\\user\\Dropbox\\Apps\\Quine",
	 "tiddlers" : ["worktiddlywiki.html", "perstiddlywiki"],
	 "port" : 8083
	}

Use the folders where your tiddlers live for ```dropBoxFolder```  
Add all tiddlywiki files you want to be able to serve and save to the ```tiddlers``` array  
Run command ```npm install``` to install dependencies

### Run server
Run command ```node server.js``` to start server  
Navigate to ```http://localhost:8083/worktiddlywiki.html``` to view your wiki  
You probably need to set ```config.options.chkHttpReadOnly``` to false in order to enable saving 

## Running as a service with NSSM

Download NSSM from <https://nssm.cc/> or install with Chocolatey  
Run command ```nssm install tiddlysaver```  
Fill in the form with the following values:  
  - Path: node  
  - C:\path\tiddly-node-saver  
  - server.js
  
Click the "Install service" button and then start the "tiddlysaver" process. The process should henceforth start automatically as a service.  