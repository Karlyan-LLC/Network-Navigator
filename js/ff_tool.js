$(document).ready(function() {

   //Initialize tab states
   initTabs();

   initHeadersTab();
   initParserTab();
   initActionsTab();
   initLookupsTab();
   initFeaturesTab();
   initSwitchTab();
   
   // if (typeof WebSocket != 'undefined')
   //     alert("socket supported");
   //  else
   //   alert("sockets NOT supported");
});

function resetTabs() {
   $("#ff_tab > div").hide(); //Hide all content
   $("#tabs a").attr("id", ""); //Reset id's      
}

var myUrl = window.location.href; //get URL
var myUrlTab = myUrl.substring(myUrl.indexOf("#")); // For mywebsite.com/tabs.html#tab2, myUrlTab = #tab2     
var myUrlTabName = myUrlTab.substring(0, 4); // For the above example, myUrlTabName = #tab

function initTabs() {

   $("#ff_tab > div").hide(); // Initially hide all content
   $("#tabs li:first a").attr("id", "current"); // Activate first tab
   $("#ff_tab > div:first").fadeIn(); // Show first tab content

   $("#tabs a").on("click", function(e) {
      e.preventDefault();
      if ($(this).attr("id") == "current") { //detection for current tab
         return
      } else {
         resetTabs();
         $(this).attr("id", "current"); // Activate this
         $($(this).attr('name')).fadeIn(); // Show content for current tab
      }
   });
}

function saveStringToFile(jsonString, filename) {
   var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
        ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
        ieVer=(ie ? ie[1] : (ie11 ? 11 : -1));

   // var jsonAsString = JSON.stringify(header_list, null, " ");
   var textFileAsBlob = new Blob([jsonString], {
      type: 'text/plain'
   });

   if (ie || ie11) {
      window.navigator.msSaveOrOpenBlob(textFileAsBlob, filename);
    } else {
        var downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.innerHTML = "Download File";

        if (window.URL !== null) {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        } else {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
     }
   return;
}

function handleFileRead(event) {
   var files = event.target.files;

   if (event.target.value == "")
      return;
   for (i = 0; i < files.length; i++) {
      var reader = new FileReader();
      if (event.target.name == "headers")
         reader.onload = readHeadersFile;
      if (event.target.name == "protocols")
         reader.onload = readProtocolsFile;
      if (event.target.name == "features")
         reader.onload = readFeaturesFile;
      if (event.target.name == "lookups")
         reader.onload = readLookupsFile;
      reader.readAsText(files[0]);          // TODO - Read only first file for now
      event.target.value = "";
   }
}