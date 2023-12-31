/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

// Dynamically load the Eruda script
var ePub = require('epubjs');
var erudaScript = document.createElement('script');
erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
erudaScript.async = true;
erudaScript.onload = function() {
    // Initialize Eruda after it's loaded
    if (window.eruda) {
        window.eruda.init();
    }
};
document.head.appendChild(erudaScript);

document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('DOMContentLoaded', function() {
//    document.querySelector('button').addEventListener('click', chooseAndReadFile);

    document.querySelector('button').addEventListener('click', listEPUBFiles);
});

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

/*
function chooseAndReadFile() {  
    fileChooser.open(function (uri) {
        window.resolveLocalFileSystemURL(uri, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function() {
                    var book = ePub(this.result);
                    var rendition = book.renderTo("area", {width: 600, height: 400});
                    book.renderTo("area_to_render_book");
                };

                reader.readAsArrayBuffer(file);
            }, errorHandler);
        }, errorHandler);
    }, errorHandler); 
}
*/

function listEPUBFiles() {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(directoryEntry) {
        scanDirectory(directoryEntry);
    }, errorHandler);
}

function scanDirectory(directoryEntry) {
    var directoryReader = directoryEntry.createReader();
    directoryReader.readEntries(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isDirectory) {
                scanDirectory(entry); // Recursively scan subdirectories
            } else if (entry.isFile && entry.name.endsWith('.epub')) {
                console.log(entry.fullPath); // Log the path of each EPUB file
            }
        });
    }, errorHandler);
}

function errorHandler(error) {
    console.error("Error accessing file system: " + error.code);
}

