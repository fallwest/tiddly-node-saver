# tiddly-node-saver
Serves (and saves) your [Classic TiddlyWiki](https://classic.tiddlywiki.com/) from your Dropbox or other type of shared folder.

## Features  

- Supports viewing and saving multiple TiddlyWikis without browser plugins
- Protects against overwriting changes from other sources accessing the same wiki (e.g. phone apps, other browser windows)

## Prerequisites

Requires a recent version of Node and NPM.

## Install

### Clone repository:  

	git clone https://github.com/fallwest/tiddly-node-saver.git  

Alternatively, you can download files without Git.

### Install library dependencies  
Run the following command under the root directory:  
	
	npm install

## Configure

Replace ```config.json``` file values with your own: 

	{
	 "dropBoxFolder" : "C:\\Users\\user\\Dropbox\\Apps\\Quine",
	 "tiddlers" : ["worktiddlywiki.html", "perstiddlywiki.html"],
	 "port" : 8083
	}

Use the folder where your tiddlers live as the value for ```dropBoxFolder```  
Add all tiddlywiki files you want to be able to serve and save to the ```tiddlers``` array

## Run
Run command ```node server.js``` to start server  
Navigate to ```http://localhost:8083/worktiddlywiki.html``` to view your wiki  

## Run as a Windows service

1. Download [NSSM](https://nssm.cc/) or install with [Chocolatey](https://chocolatey.org/)  
1. Run command ```nssm install tiddlysaver```  
1. Fill in the form with the following values:  

<img src="https://github.com/fallwest/tiddly-node-saver/blob/master/nssm_config.png"></img>  
Click the "Install service" button and then start the "tiddlysaver" process. The process should henceforth start automatically as a service.  

## Troubleshooting  
- If the TiddlyWiki "save changes" button does not appear when you first navigate to your TiddlyWiki in your browser, try refreshing the page. The button should then always appear.