var lookups_list = [];
var cur_lookup;
var cur_lookup_num = 0;

function generateP4Lookups()
{
   return "Test P4 string";
}

function showLookupsScript()
{
   var jsonAsString = " ";
   
   if ($("#lookups_script_format option:selected").text() == "JSON") {
      jsonAsString = JSON.stringify(lookups_list, null, " ");
      $('#lookups_script_tb').prop('value', jsonAsString);
   } 
   else
      $('#lookups_script_tb').prop('value', generateP4Lookups());
}

function readLookupsFile(event)
{
   var jsonAsString;

   if (typeof event === 'string') {
      lookups_list = pre_loaded_lookups;
   }
   else {
      jsonAsString = event.target.result;       // Read PDL file in json format
      lookups_list = JSON.parse(jsonAsString);
   }
   displayAllFields();
}

function loadLookupsFile(event)
{
   $("#lookups_files").trigger("click");
}

function saveLookupsFile(event)
{
   var jsonAsString = JSON.stringify(lookups_list, null, " ");
   saveStringToFile(jsonAsString, "ff_lookups.txt");
}

function clickOnHeaderName(event)
{
   var header_name = event.target.id;

   $('#'+header_name).css({"background-color":"black"});
   $('#'+header_name).css({"color":"white"});
}

function clickOnFieldName(event)
{
   var field_name = event.target.id;
     
   $('#'+field_name).css({"background-color" : "black"});
   $('#'+field_name).css({"color" : "white"});
   // field_name starts with "header-" and has "__" between headername and field name
   field_name = field_name.substr("fl-".length, field_name.length);
   cur_lookup.selected_fields[cur_lookup.selected_fields.length] = field_name;
}

function clickOnOutputField(event)
{
   var field_name = event.target.id;
     
   $('#'+field_name).css({"background-color" : "black"});
   $('#'+field_name).css({"color" : "white"});
   // field_name starts with "header-" and has "__" between headername and field name
   field_name = field_name.substr("of-".length, field_name.length);
   cur_lookup.selected_outfields[cur_lookup.selected_outfields.length] = field_name;
}

function clickOnInputField(event)
{
   var field_name = event.target.id;
     
   $('#'+field_name).css({"background-color" : "black"});
   $('#'+field_name).css({"color" : "white"});
   // field_name starts with "header-" and has "__" between headername and field name
   field_name = field_name.substr("of-".length, field_name.length);
   cur_lookup.selected_infields[cur_lookup.selected_infields.length] = field_name;
}

function clickOnLookup(event)
{
   var id = event.target.id;

   cur_lookup_num = Number(id.substr("lookup-".length, id.length));
   cur_lookup = lookups_list[cur_lookup_num];
   $('#lookup_name').prop("value", cur_lookup.name);
   displayAllFields();
   displayInputFields();
   displayOutputFields();
   showLookupsScript();
}

function add_input_fields(event)
{   
   var i = 0;
   for (i=0; i< cur_lookup.selected_fields.length; i++) {
      cur_lookup.in_fields.push(cur_lookup.selected_fields[i]);
      $('#fl-' + cur_lookup.selected_fields[i]).css({"background-color":"white"});
      $('#fl-' + cur_lookup.selected_fields[i]).css({"color":"black"});
   }
   cur_lookup.selected_fields.length = 0;
   displayInputFields();
}

function remove_input_fields(event)
{
   var i = 0;
   var j = 0;
   for (i=0; i< cur_lookup.selected_infields.length; i++) {
      $('#fl-' + cur_lookup.selected_infields[i]).css({"background-color":"white"});
      $('#fl-' + cur_lookup.selected_infields[i]).css({"color":"black"});
      for (j=0; j< cur_lookup.in_fields.length; j++) {
         if (cur_lookup.in_fields[j] == cur_lookup.selected_infields[i]) {
            cur_lookup.in_fields.splice(j, 1);
            break;
         }
      }
   }
   cur_lookup.selected_infields.length = 0;
   displayInputFields();
}

function add_output_fields(event)
{
   var i = 0;
   for (i=0; i< cur_lookup.selected_fields.length; i++) {
      cur_lookup.out_fields.push(cur_lookup.selected_fields[i]);
      $('#fl-' + cur_lookup.selected_fields[i]).css({"background-color":"white"});
      $('#fl-' + cur_lookup.selected_fields[i]).css({"color":"black"});
   }
   cur_lookup.selected_fields.length = 0;
   displayOutputFields();
}

function remove_output_fields(event)
{
   var i = 0;
   var j = 0;
   for (i=0; i< cur_lookup.selected_outfields.length; i++) {
      $('#fl-' + cur_lookup.selected_outfields[i]).css({"background-color":"white"});
      $('#fl-' + cur_lookup.selected_outfields[i]).css({"color":"black"});
      for (j=0; j< cur_lookup.out_fields.length; j++) {
         if (cur_lookup.out_fields[j] == cur_lookup.selected_outfields[i]) {
            cur_lookup.out_fields.splice(j, 1);
            break;
         }
      }
   }
   cur_lookup.selected_outfields.length = 0;
   displayOutputFields();
}

function displayAllFields()
{
   var i =0;
   var j = 0;
   var field_name;
   var full_name;
   var loc = $('#all_fields');

   loc.empty();
   loc.append('<ul id="headers_ul">');
   for (i=0; i<header_list.length; i++) {
      loc = $('#headers_ul');
      loc.append('<li onclick=clickOnHeaderName(event) id="header-' + header_list[i].name + '">'+header_list[i].name);
      loc.append('<ul id="' + header_list[i].name + "_ul" + '">');
      loc = $('#'+header_list[i].name+'_ul');
      for (j = 0; j < header_list[i].fields.length; j++) {
         field_name = header_list[i].fields[j].name;
         full_name = "fl-" + header_list[i].name + "__" + field_name;    // double underscore to differentiate
         loc.append('<li onclick=clickOnFieldName(event) id="'+ full_name + '">' + field_name);
      }
   }
   showLookupsScript();
}

function displayInputFields()
{
   var loc = $('#input_fields');
   var field_name;

   loc.empty();
   loc.append('<ul id="input_fields_ul">');
   loc = $('#input_fields_ul');
   for (i=0; i<cur_lookup.in_fields.length; i++) {
      field_name = cur_lookup.in_fields[i];
      field_name = field_name.replace("__", ".");
      loc.append('<li onclick=clickOnInputField(event) id="if-' + cur_lookup.in_fields[i] + '">'+field_name);
   }
   showLookupsScript();

}

function displayOutputFields()
{
   var loc = $('#output_fields');
   var field_name;

   loc.empty();
   loc.append('<ul id="output_fields_ul">');
   loc = $('#output_fields_ul');
   for (i=0; i<cur_lookup.out_fields.length; i++) {
      field_name = cur_lookup.out_fields[i];
      field_name = field_name.replace("__", ".");
      loc.append('<li onclick=clickOnOutputField(event) id="of-' + cur_lookup.out_fields[i] + '">'+field_name);
   }
   showLookupsScript();
}

function addLookup(event)
{
   var new_lookup = new Object();

   $('#lookup_name').prop("value", "New_Lookup");
   $('#lookup_name').focus();
   $('#lookup_name').select();
   lookups_list[lookups_list.length] = new_lookup;
   cur_lookup = new_lookup;
   cur_lookup_num = lookups_list.length - 1;
   cur_lookup.name = "New_Lookup";
   cur_lookup.type = "nop";
   cur_lookup.in_fields = [];
   cur_lookup.out_fields = [];
   cur_lookup.selected_fields = [];
   cur_lookup.selected_infields = [];
   cur_lookup.selected_outfields = [];
   
   // TODO : good to auto generate the HTML from data structures
   $('#lookups_menu').append('<li id=lookup-' + cur_lookup_num + ' onclick="clickOnLookup(event)" >' + cur_lookup.name);

   displayAllFields();
   displayInputFields();
   displayOutputFields();
   showLookupsScript();
}

function addLookupByName(name)
{
   var new_lookup = new Object();

   lookups_list[lookups_list.length] = new_lookup;
   cur_lookup = new_lookup;
   cur_lookup_num = lookups_list.length - 1;
   cur_lookup.name = name;
   cur_lookup.type = "nop";
   cur_lookup.in_fields = [];
   cur_lookup.out_fields = [];
   cur_lookup.selected_fields = [];
   cur_lookup.selected_infields = [];
   cur_lookup.selected_outfields = [];

   $('#lookups_menu').append('<li id=lookup-' + cur_lookup_num + ' onclick="clickOnLookup(event)" >' + cur_lookup.name);
   showLookupsScript();
}

function displayAllLookups()
{
   var loc = $('#lookups_menu');
   var i = 0;

   loc.empty();
   loc.append('<li onclick="addLookup()">Add Lookup</li>');
   for (i=0; i< lookups_list.length; i++) {
      loc.append('<li id=lookup-' + i + ' onclick="clickOnLookup(event)" >' + lookups_list[i].name);
   }
   cur_lookup_num = 0;
   cur_lookup = lookups_list[0];
   if (lookups_list.length > 0 ) {
      $('#lookup_name').prop("value", cur_lookup.name);
      $('#lookup_type').val(cur_lookup.type);
   }
}

function changeLookupName(event)
{
   cur_lookup.name = event.target.value;
   $('#lookup-'+cur_lookup_num).prop("innerHTML", cur_lookup.name);
   showLookupsScript();
   // new lookup name needs to be added to feature block type in Feature Designer
   displayFeatures();
}

function changeLookupType()
{
   cur_lookup.type = event.target.value;
   showLookupsScript();
}

function initLookupsTab()
{
   // Display and hide elements
   $("#lookups_files").hide(); 
   $('#display_lookups_script').prop("checked", true);
   $('#lookups_menu').append('<li onclick="addLookup()">Add Lookup</li>');
   addLookupTypeOptions($('#lookup_type'));
   $('#lookup_name').on("keyup", changeLookupName);
   $('#lookup_type').on("change", changeLookupType);


   // Set up handlers
   $('#lookups_files').on("change", handleFileRead);
   $("#display_lookups_script").on("click", function(e) {
      if ($('#display_lookups_script').prop('checked')) {
         $("#lookups_script_tb").show("slow", "swing");
         $("#lookups_script_area").show("slow", "swing");
      } else {
         $("#lookups_script_tb").hide();
         $("#lookups_script_area").hide();
      }
   });
   $('#lookups_script_format').on("change", showLookupsScript)

   // Initialize
   readLookupsFile("use pre loaded lookups to start");  // send a string instead of file read event

   // display everything after loading pre-loaded-data
   displayAllLookups();
   displayAllFields();
   displayInputFields();
   displayOutputFields();
   showLookupsScript();
}