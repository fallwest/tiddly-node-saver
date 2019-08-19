# tiddly-node-saver
Serves (and saves) your [Classic TiddlyWiki](https://classic.tiddlywiki.com/) from your Dropbox or other type of shared folder.

## Features  

- Supports viewing and saving multiple TiddlyWikis without browser plugins
- Protects against overwriting changes from other sources accessing the same wiki (e.g. phone apps, other browser windows)
- Should run on any OS with Node support

## Prerequisites

- Requires a recent version of Node and NPM.
- Only works with [Classic TiddlyWiki](https://classic.tiddlywiki.com/). Latest version available on [Git](https://github.com/TiddlyWiki/TiddlyWiki).

## Install

### Clone repository:  

	git clone https://github.com/fallwest/tiddly-node-saver.git  

Alternatively, you can download files without Git.

### Install library dependencies  
Run the following command under the root directory:  
	
	npm install

## Configure

Replace the Dropbox (or other kind of shared folder) path in ```config.json``` with the path to the folder where your Tiddlywiki html files live: 

	{
	 "dropBoxFolder" : "C:\\Users\\user\\Dropbox\\Apps\\Quine",
	 "extraFolders" : ["images", "files"],
	 "port" : 8083
	}
### Advanced configuration
- Add any extra folders for files or images that you reference in your wiki to the ```extraFolders``` array
- Change the port number this server runs on if you need to.

## Run
1. Run command ```node server.js``` to start server  
1. Navigate to ```http://localhost:8083/yourtiddlywiki.html``` to view your wiki (be sure to use the name of your own tiddlywiki instead of ```yourtiddlywiki.html```)

## Run as a Windows service

1. Download [NSSM](https://nssm.cc/) or install with [Chocolatey](https://chocolatey.org/)  
1. Run command ```nssm install tiddlysaver```  
1. Fill in the form with the following values:  

<img src="https://github.com/fallwest/tiddly-node-saver/blob/master/nssm_config.png"></img>  
Click the "Install service" button and then start the "tiddlysaver" process. The process should henceforth start automatically as a service.

## Run as a Linux service

- Use pm2 to set up Node to automatically start server.js. Follow directions here: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04  

## Troubleshooting  
- If the TiddlyWiki "save changes" button does not appear when you first navigate to your TiddlyWiki in your browser, try refreshing the page. The button should then always appear.
- The first time you load, try loading your wiki with browser caching turned off (easiest way, have developer console open - F12 key) to ensure that you get a fresh copy of your wiki back from the server.