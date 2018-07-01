var features_list = [];

function generateP4Features()
{
   return "Test P4 string";
}

function showFeaturesScript()
{
   var jsonAsString = " ";
   
   if ($("#features_script_format option:selected").text() == "JSON") {
      jsonAsString = JSON.stringify(features_list, null, " ");
      $('#features_script_tb').prop('value', jsonAsString);
   } 
   else
      $('#features_script_tb').prop('value', generateP4Features());
}

function readFeaturesFile(event)
{
   var jsonAsString;

   if (typeof event === 'string') {
      features_list = pre_loaded_features;
   }
   else {
      jsonAsString = event.target.result;       // Read PDL file in json format
      features_list = JSON.parse(jsonAsString);
   }
   displayFeatures();
}

function loadFeaturesFile(event)
{
   $("#features_files").trigger("click");
}

function saveFeaturesFile(event)
{
   var jsonAsString = JSON.stringify(features_list, null, " ");
   saveStringToFile(jsonAsString, "ff_features.txt");
}

function changeFeatureName(event)
{
   var identifier = event.keyCode;
   var element_name = event.target.id;
   var i = Number(element_name.substring("feature_name".length));
   features_list[i].name = event.target.value;
   showFeaturesScript();
}

function addLookupTypeOptions(loc)
{
   var i = 0;
   var lookup_name = "";

   loc.append($('<option>', { value: "nop", text: "Add a block" }));
   loc.append($('<option>', { value: "Learn", text: "Learn" }));
   loc.append($('<option>', { value: "Switch", text: "Switch" }));
   loc.append($('<option>', { value: "Enforce", text: "Enforce" }));
   loc.append($('<option>', { value: "Policy", text: "Policy" }));
   loc.append($('<option>', { value: "Translate", text: "Translate" }));
   loc.append($('<option>', { value: "Encap", text: "Encap" }));
   loc.append($('<option>', { value: "Decap", text: "Decap" }));
   for( i =0; i < lookups_list.length ; i++) {
      loc.append($('<option>', {value: lookups_list[i].name, text: lookups_list[i].name}));
   }
}

function changeFblock(event)
{
   var id = event.target.id;

   id = id.substring("fblock_name".length);
   var index = id.indexOf("_");
   var i = id.substr(0, index);
   var j = Number(id.substring(index+1));
   features_list[i].fblocks[j].name = event.target.value;

   if ((event.target.value != "nop") && (j == features_list[i].fblocks.length-1)) { 
      switch (event.target.value) {
         case "Learn" :
         case "Switch" :
         case "Enforce" :
         case "Policy" :
         case "Translate" :
         case "Encap" :
         case "Decap" :
            addLookupByName(features_list[i].name + "-" + features_list[i].fblocks[j].name);  
            break;
      }   
      var new_fblock = new Object();
      new_fblock.name = "nop";
      features_list[i].fblocks[features_list[i].fblocks.length] = new_fblock;

      // display to avoid refreshing the whole thing
      var loc = $('#fblock_name'+i+"_"+j);
      j = j + 1;                   // be explicit
      loc.after($('<select id = "fblock_name' +i+"_"+j+ '"></select>'));
      $('#fblock_name'+i+"_"+j).on("change", changeFblock);
      loc = $('#fblock_name'+i+"_"+j);
      addLookupTypeOptions(loc);
   }
   showFeaturesScript();
}

function displayFeatures()
{
   var loc = $('#features_area');
   var select_loc;
   var i = 0;
   var j = 0;

   if (features_list.length == 0)
      return;
   loc.empty();
   for (i=0; i< features_list.length ; i++) {
      loc.append('<input type="textbox"  name="feature_name' + i + '" id="feature_name'  + i + '" size="20">');
      $('#feature_name'+i).prop('value', features_list[i].name);
      $('#feature_name'+i).focus();
      $('#feature_name'+i).select();
      $('#feature_name'+i).on("keyup", changeFeatureName);
      for (j = 0; j < features_list[i].fblocks.length; j++) {
         loc.append($('<select id = "fblock_name' +i+"_"+j+ '"></select>'));
         $('#fblock_name'+i+"_"+j).on("change", changeFblock);
         select_loc = $('#fblock_name'+i+"_"+j);
         addLookupTypeOptions(select_loc);
         $('#fblock_name'+i+"_"+j).val(features_list[i].fblocks[j].name);
      }
      loc.append('<br>');
   }
}

function addFeature()
{
   var new_feature = new Object();
   var new_fblock = new Object();

   new_feature.name = "new feature";
   new_feature.fblocks = new Array(); // create new feature blocks list
   new_feature.fblocks[0] = new_fblock;
   new_fblock.name = "nop";
   features_list[features_list.length] = new_feature;
   displayFeatures();
   showFeaturesScript();
}

function initFeaturesTab()
{
   // Display and hide elements
   $("#features_files").hide(); 
   $('#display_features_script').prop("checked", true);

   // Set up handlers
   $('#features_files').on("change", handleFileRead);
   $("#display_features_script").on("click", function(e) {
      if ($('#display_features_script').prop('checked')) {
         $("#features_script_tb").show("slow", "swing");
         $("#features_script_area").show("slow", "swing");
      } else {
         $("#features_script_tb").hide();
         $("#features_script_area").hide();
      }
   });
   $('#features_script_format').on("change", showFeaturesScript);
   $('#add_feature').on("click", addFeature);

   // Initialize
   readFeaturesFile("use pre loaded features to start");  // send a string instead of file read event

   displayFeatures();
}
