// Debugging
var debug = 0;

// Headers, fields and attributes
var header_list = [];
var cur_header = {};
var cur_field = {};

// user interface elements 
var files_fs, headers_dl, header_grid, context;
var length_field_cb, csum_field_cb, pivot_field_cb, field_name_tb, field_width_tb;

// User interface events
var clickTimeoutId;
var num_clicks = 0;

// User interface properties
var cell_size = 32;
var bit_width = cell_size / 4;
var canvas_margin = 8; // hard coding - Learn CSS and move it to CSS
var font_size = 12;    // hard coding - move to CSS

function drawGrid() {
   // Check canvas width, height
   if (header_grid.get(0).width < 200 || header_grid.get(0).height < 200) {
      window.alert("Canvas size is not enough: Width " + header_grid.get(0).width +
         ", Height " + header_grid.get(0).height);           // TODO - Create required size instead
      return;
   }

   if (debug > 0)
      window.alert("Canvas width " + header_grid.get(0).width + ", Height " + header_grid.get(0).height);

   // clear canvas
   context.fillStyle = "#FFFFFF";
   context.fillRect(0, 0, cell_size * 8, header_grid.get(0).height);

   context.lineWidth = 1;
   context.strokeStyle = "#D1D0CE";

   // Draw horizontal lines
   for (i = 0; i < header_grid.get(0).height; i = i + cell_size) {
      context.moveTo(0, i);
      context.lineTo((header_grid.get(0).width < (8 * cell_size)) ? header_grid.get(0).width : (8 * cell_size), i);
      context.stroke();
   }

   // Draw vertical lines
   for (i = 0;
      ((i < header_grid.get(0).width) && (i < 8 * cell_size)); i = i + cell_size) {
      context.moveTo(i, 0);
      context.lineTo(i, header_grid.get(0).height);
      context.stroke();
      if (debug > 0)
         window.alert(i);
   }

   // Draw a black box around the grid
   context.lineWidth = 3;
   context.strokeStyle = "#000000";
   context.strokeRect(0, 0, cell_size * 8, header_grid.get(0).height);
}

function displayFldAttr() {
   if (cur_field) {
      with(cur_header) {
         for (i = 0; i < fields.length; i++) {
            if (cur_field == fields[i]) {
               $('#field_name' + i).focus();
               $('#field_name' + i).select(); // UX encourage user to name the new field
               return;
            }
         }
      }
   }
}

function getDisplayStr(name, width) {
   width = Math.floor(width * 1.3); // Avoid magic numbers
   return name.substring(0, width);
}

function drawField(name, width, offset) {
   var row = Math.floor(offset / 32);
   var start_col = offset % 32;
   var end_col = start_col + width;

   if (debug > 0)
      window.alert(name + " " + width + " " + offset);
   context.lineWidth = 2;
   context.strokeStyle = "#000000";
   context.fillStyle = "#FFFFFF";
   context.font = font_size + " Arial";


   if (end_col <= 32) {
      // fits in the same row
      context.fillRect(start_col * bit_width, row * cell_size, width * bit_width, cell_size);
      context.strokeRect(start_col * bit_width, row * cell_size, width * bit_width, cell_size);
      context.fillStyle = "#000000";
      name = getDisplayStr(name, width);
      context.fillText(name, (start_col * bit_width) + 2, (row * cell_size) + 11, width * bit_width);

   } else if (end_col <= 64) {
      // Split the field in to 2 rows
      context.fillRect(start_col * bit_width, row * cell_size, (32 - start_col) * bit_width, cell_size);
      context.fillRect(0, (row + 1) * cell_size, (end_col - 32) * bit_width, cell_size);
      context.fillStyle = "#000000";
      context.fillText(name.substring(0, (32 - start_col) / 2), (start_col * bit_width) + 2, (row * cell_size) + 11);
      name = name.substring((32 - start_col) / 2, name.length);
      context.fillText(name.substr(0, (end_col - 32) / 2), 0 + 2, ((row + 1) * cell_size) + 11);
      context.strokeRect(start_col * bit_width, row * cell_size, (32 - start_col) * bit_width, cell_size);
      context.strokeRect(0, (row + 1) * cell_size, (end_col - 32) * bit_width, cell_size);
   } else {}
}

function displayScript()
{
   var jsonAsString = " ";
   
   if ($("#header_script_format option:selected").text() == "JSON") {
      jsonAsString = JSON.stringify(header_list, null, " ");
      $('#script_tb').prop('value', jsonAsString);
   } 
   else
      $('#script_tb').prop('value', generateP4(header_list));
}

function drawFieldList() {
   var offset = 0;
   if (header_list.length == 0)
      return;
   if (!cur_header.hasOwnProperty("fields"))
      return;
   if (!cur_header.fields)
      return;

   with(cur_header) {
      for (i = 0; i < fields.length; i++) {
         // window.alert( fields[i].name + "," + fields[i].width + "," + offset );
         drawField(fields[i].name, fields[i].width, offset);
         offset += fields[i].width;
      }
   }
   displayFields();
   displayScript();
}

// Event Handling

var EventUtil = {
   addHandler: function(element, type, handler) {

      $(element).on(type, handler); //Casting javascript variable to jquery object and bind event+handler

   },

   getEvent: function(event) {
      return event ? event : window.event;
   },

   getTarget: function(event) {
      if (event.preventDefault) {
         event.PreventDefault();
      } else {
         event.returnValue = false;
      }
   },

   removeHandler: function(element, type, handler) {
      if (element.removeEventListner) {
         element.removeEventListner(type, handler, false);
      } else if (element.detachEvent) {
         element.detachEvent("on" + type, handler);
      } else {
         element["on" + type] = null;
      }
   },

   getCharCode: function(event) {
      if (typeof event.charCode == "number") {
         return event.charCode;
      } else {
         return event.keyCode;
      }
   },

   stopPropagation: function(event) {
      if (event.stopPropagation) {
         event.stopPropagation();
      } else {
         event.cancelBubble = true;
      }
   }
};

function handleClick(event) {
   clickTimeoutId = setTimeout(clickOnGrid, 500, event);
   num_clicks++;
}

function clickOnGrid(event) {
   clearInterval(clickTimeoutId);

   if (num_clicks >= 2) { // triple click is same as double click
      dblClickOnGrid(event); // add a new field
      num_clicks = 0;
      return;
   }

   num_clicks = 0;

   // Single Click handling startes here

   // no header or fields to select
   if (header_list.length == 0)
      return;
   if (!cur_header.fields)
      return;

   var rect = header_grid.get(0).getBoundingClientRect();

   // continue as single click
   new_offset = Math.round((event.clientX - rect.left) / bit_width);
   new_offset += 32 * Math.floor((event.clientY - rect.top) / cell_size);
   var offset = 0;

   with(cur_header) { // clicked to set current field
      for (i = 0; i < fields.length; i++) {
         offset += fields[i].width;
         if (offset >= new_offset) {
            cur_field = fields[i];
            displayFldAttr();
            return;
         }
      }
   }
}

function dblClickOnGrid(event) {
   if (header_list.length == 0) {
      alert("Select a header first");
      return;
   }

   var rect = header_grid.get(0).getBoundingClientRect();

   // UX ignore if clicked too close to horizontal grid line
   var y_incell = (event.clientY - rect.top) % cell_size;
   if ((y_incell < 3) || (y_incell > (cell_size - 3)))
      return;

   var offset = 0;
   var new_width = -1;
   var new_field = new Object();

   new_offset = Math.round((event.clientX - rect.left) / bit_width);
   new_offset += 32 * Math.floor((event.clientY - rect.top) / cell_size);

   if (!cur_header.hasOwnProperty("fields")) {
      cur_header.fields = new Array(); // create new field list
      new_width = new_offset; // add first field
      i = 0;
   } else {
      with(cur_header) { // find location to insert new field
         for (i = 0; i < fields.length; i++) {
            offset += fields[i].width;
            if (offset > new_offset) {
               new_width = new_offset - (offset - fields[i].width);
               break;
            }
         }
      }
   }
   if (new_width == -1) // adding field at the end
      new_width = new_offset - offset;

   cur_header.fields.splice(i, 0, new_field);
   new_field.name = "Field Name";
   new_field.width = new_width; // set new field attributes
   new_field.length_field = false;
   new_field.csum_field = false;
   new_field.pivot_field = false;
   cur_field = new_field; // set current field
   drawFieldList();
   displayFldAttr();
}

// Handle text input in all taxt boxes
function handleText(event) {
   var identifier = event.keyCode;
   // no header or fields to select
   if (header_list.length == 0)
      return;
   if (!cur_header.fields)
      return;
   var element_name = event.target.id;

   if (element_name.substr(0,10) == "field_name") {
      if ((identifier == 13) && (cur_field !== NaN)) {
         var i = Number(element_name.substring(10));
         cur_header.fields[i].name = event.target.value;
         drawFieldList();
      }
      return;
   }
   if (element_name.substr(0,11) == "field_width") {
      if ((identifier == 13) && (cur_field !== NaN)) {
         if (Number(event.target.value) != event.target.value) {
            // retrieve from cur_field.width
            event.target.value = event.target.oldValue;
         } else {
            var i = Number(element_name.substring(11));
            cur_header.fields[i].width = Number(event.target.value);
         }
         drawGrid();
         drawFieldList();
      }
      return;
   }
}

// Allow numbers only in some text boxes
function numbersOnly(event) {
   var identifier = event.key || event.keyIdentifier;

   // no header or fields to select
   if (header_list.length == 0)
      return;
   if (!cur_header.fields)
      return;

   switch (identifier) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "Backspace":
      case "Enter":
         return;
      default:
         // Overwrite with old value
         event.stopImmediatePropagation();
         if (event.target.value != "")
            event.target.oldValue = parseInt(event.target.value);
         else
            event.target.oldValue = 0;
   }
}

function handlePivotText(event)
{
   // do nothing for now, we can add checks and copy headers as needed
}

function insertPivot(field_num, value, name)
{
   var new_pivot = {};
   cur_field = cur_header.fields[field_num];
   if(!cur_field.pivots) {
      cur_field.pivots = new Array(); // create new pivot list
   }
   new_pivot.value = value;
   new_pivot.name = name;
   cur_field.pivots.push(new_pivot);
}

// Handle check boxes
function handleCheckBox(event) {
   // no header or fields to select
   if (header_list.length == 0)
      return;
   if (!cur_header.fields)
      return;
   
   var element_name = event.target.id;
   if (element_name.substr(0,"length_fld".length) == "length_fld") { 
      var i = Number(element_name.substring("length_fld".length));
      cur_header.fields[i].length_field = event.target.checked;
      displayScript();
      return;
   }
   if (element_name.substr(0,"csum_fld".length) == "csum_fld") { 
      var i = Number(element_name.substring("csum_fld".length));
      cur_header.fields[i].csum_field = event.target.checked;
      displayScript();
      return;
   }
   if (element_name.substr(0,"pivot_fld".length) == "pivot_fld") { 
      var i = Number(element_name.substring("pivot_fld".length));
      cur_header.fields[i].pivot_field = event.target.checked;
   // TODO - Pivot support in headers
   //   var i = Number(element_name.substring(9));
   //   cur_header.fields[i].pivot_field = event.target.checked;
   //  cur_field = cur_header.fields[i];
   //   insertPivot(i, 0, "NextHeader");                   // Insert first pivot
   //   drawFieldList();
   //   var j = cur_header.fields[i].pivots.length - 1;
   //  $('#pivot_value' + i + '_'+j).focus();
   //  $('#pivot_value' + i + '_'+j).select(); // UX encourage user to set the pivot
      return;
   }
}

// Selecting header from a list
function handleSelect(event) {
   var header_name = headers_dl.get(0).options[headers_dl[0].selectedIndex].value;
   if (header_name == "Create New Header") {
      var new_header_name = prompt("Enter New Header Name", "");
      if (new_header_name != null) {
         var new_element = document.createElement("option");
         new_element.text = new_header_name;
         headers_dl.get(0).add(new_element);
         headers_dl.get(0).selectedIndex = headers_dl.get(0).length - 1;

         // Remove prompt, when first header is created
         if (headers_dl.get(0).options[0].text == "Select a Header") {
            headers_dl.get(0).remove(0);
         }

         var new_header = new Object();
         var new_field = new Object();
         new_header.name = new_header_name;
         cur_header = new_header;
         header_list[headers_dl.get(0).selectedIndex - 1] = new_header;
         drawGrid();
         $('#fields_area').empty();                       // Empty Fields area for new header
         cur_header.fields = new Array();                 // create new field list with 1 field
         cur_header.fields.splice(0, 0, new_field);
         new_field.name = "Field Name";
         new_field.width = 8; 
         new_field.length_field = false;
         new_field.csum_field = false;
         new_field.pivot_field = false;
         cur_field = new_field; // set current field
         drawFieldList();
         displayFldAttr();
      }
   } else {
      cur_header = header_list[headers_dl.get(0).selectedIndex - 1];
      if (cur_header.hasOwnProperty("fields")) {
         cur_field = cur_header.fields;
         drawGrid();
         drawFieldList();
      } else {
         drawGrid();
         $('#fields_area').empty();
      }
   }
}

function readHeadersFile(event) {
   var jsonAsString;

   if (typeof event === 'string') {
      header_list = pre_loaded_headers;
   }
   else {
      jsonAsString = event.target.result;       // Read PDL file in json format
      header_list = JSON.parse(jsonAsString);
   }
   
   drawGrid();
   headers_dl.get(0).length = 0;                 // Remove all old headers - garbage collector
   if (header_list.length != 0) {
      cur_header = header_list[0];               // Set current header and field
      if (cur_header.fields) {
         cur_field = cur_header.fields[0]; 
         drawFieldList();
      }
      var new_element = document.createElement("option");
      new_element.text = "Create New Header";
      headers_dl.get(0).add(new_element);
      for (i = 0; i < header_list.length; i++) { // update header drop down list
         new_element = document.createElement("option");
         new_element.text = header_list[i].name;
         headers_dl.get(0).add(new_element);
      }
      headers_dl.get(0).selectedIndex = 1;       // Select and show first Header 
   } else {                                      // Add 2 default elements
      var new_element = document.createElement("option");
      new_element.text = "Select a Header";
      headers_dl.get(0).add(new_element);
      new_element = document.createElement("option");
      new_element.text = "Create New Header";
      headers_dl.get(0).add(new_element);
   }
   
   if ($("#header_script_format option:selected").text() == "JSON")
      $('#script_tb').prop('value', jsonAsString);  // Update script textbox
   else
      $('#script_tb').prop('value', generateP4(header_list));
}

function loadHeadersFile(event)
{
   $("#header_files").trigger("click");
}

function saveHeadersFile(event)
{
   var jsonAsString = JSON.stringify(header_list, null, " ");  
   saveStringToFile(jsonAsString, "ff_headers.txt"); 
}

function newPivot(event)
{
   var element_name = event.target.id;
   var i = Number(element_name.substring(9));
   if (element_name.substr(0,9) == "add_pivot")
      insertPivot(i, 0, "NextHeader");
   drawFieldList();
   var j = cur_header.fields[i].pivots.length - 1;
   $('#pivot_value' + i + '_'+j).focus();
   $('#pivot_value' + i + '_'+j).select(); // UX encourage user to set the pivot
}

function appendPivots(field_num)
{
   var i = field_num;
   if(cur_header.fields[i].hasOwnProperty("pivots")) {
      $('#fields_area').append('Value, Next Header <br>');
      for (j = 0; j < cur_header.fields[i].pivots.length; j++) {
         if (j == 0) {
            $('#fields_area').append('<input type="button" id="add_pivot' + i + '" value="+">  </button>');
         } else {
            $('#fields_area').append('<img src=img/40-40.bmp alt="-" height="5" width = "35">');
         }
         $('#fields_area').append('<input type="textbox" id="pivot_value' + i + '_' + j + '" size="3">');
         $('#fields_area').append('<input type="textbox" id="pivot_name'  + i + '_' + j + '" size="20">');
         $('#fields_area').append('<br>');
      }
   }
}

function setPivotValues(field_num) 
{
   var i = field_num;
   if(cur_header.fields[i].hasOwnProperty("pivots")) {
      for (j = 0; j < cur_header.fields[i].pivots.length; j++) {
         $('#pivot_value'+i+'_'+j).val(cur_header.fields[i].pivots[j].value);
         $('#pivot_name' +i+'_'+j).val(cur_header.fields[i].pivots[j].name);
      }
   }
}

function setPivotHandlers(field_num)
{
   var i = field_num;
   if(cur_header.fields[i].hasOwnProperty("pivots")) {
      $('#add_pivot'  + i).on("click", newPivot);
      for (j = 0; j < cur_header.fields[i].pivots.length; j++) {
         $('#pivot_value' + i +'_'+j).on("keyup", handlePivotText);
         $('#pivot_name'  + i +'_'+j).on("keyup", handlePivotText);
         // $('#pivot_value' + i +'_'+j).on("keydown", numbersOnly);
      }
   }
}
              
function displayFields()
{
   if (header_list.length == 0)
      return;
   if (!cur_header.hasOwnProperty("fields"))
      return;
   if (!cur_header.fields)
      return;
   $('#fields_area').empty();         // Remove old fields and build everything again - TODO optimize
   with(cur_header) {
      $('#fields_area').append('<div id ="field_list">');
      $('#fields_area').append('Fields in header ' + cur_header.name + ' <br>');
      $('#fields_area').append('Name, Width, Length, CSUM, Pivot<br>');
                                     // TODO connect input element to the objects using name tag
      for (i = 0; i < fields.length; i++) {
         $('#fields_area').append('<input type="textbox"  name="field_name' + i + '" id="field_name'  + i + '" size="20">');
         $('#fields_area').append('<input type="number"   name="field_width'+ i + '" id="field_width' + i + '" size="3">');
         $('#fields_area').append('<input type="checkbox" name="length_fld' + i + '" id="length_fld'  + i + '" >');
         $('#fields_area').append('<input type="checkbox" name="csum_fld'   + i + '" id="csum_fld'    + i + '" >');
         $('#fields_area').append('<input type="checkbox" name="pivot_fld'  + i + '" id="pivot_fld'   + i + '" ><br>');
         appendPivots(i);    
      }
      $('#fields_area').append('</div>');
      for (i = 0; i < fields.length; i++) {
         $('#field_name'+i).val(fields[i].name);
         $('#field_width'+i).val(fields[i].width); 
         if (fields[i].length_field)
            $('#length_fld'+i).prop('checked', true);
         else
            $('#length_fld'+i).prop('checked', false);
         if (fields[i].csum_field)
            $('#csum_fld'+i).prop('checked', true);
         else
            $('#csum_fld'+i).prop('checked', false);
         if (fields[i].pivot_field)
            $('#pivot_fld'+i).prop('checked', true);
         else
            $('#pivot_fld'+i).prop('checked', false);
         setPivotValues(i);
      } 
      // set handlers
      for (i = 0; i < fields.length; i++) {
         $('#field_name'  + i).on("keyup", handleText);
         $('#field_width' + i).on("keyup", handleText);
         $('#field_width' + i).on("keydown", numbersOnly);
         $('#length_fld'  + i).on("click", handleCheckBox);
         $('#csum_fld'    + i).on("click", handleCheckBox);
         $('#pivot_fld'   + i).on("click", handleCheckBox);
         setPivotHandlers(i);
      }
   }
}

function generateP4(header_list)
{
   var p4String = "";
   var i=0;
   var j=0;
   var indent = "   ";  // make it a parameter later
   var length_field = "";
   var fields;

   for (i=0; i<header_list.length; i++) {
      p4String = p4String + "header_type " + header_list[i].name + "_t { \n";
      fields = header_list[i].fields;
      p4String = p4String + indent + "fields {\n"
      for (j = 0; j < fields.length; j++) {
         p4String = p4String + indent + indent + fields[j].name + " : " + fields[j].width + ";\n";
         if (fields[j].length_field)
            length_field = fields[j].name;
      }
      p4String = p4String + indent + "}\n"
      if (length_field != "") {
         p4String = p4String + indent + "length : " + length_field + " * 4;\n";
         length_field = "";
      }
      p4String = p4String + "}\n\n";
   }
   return p4String;
}

function initHeadersTab()
{
   // initialize user interface elements 
   
   $("#header_files").hide();           // Hide immediately
   headers_dl = $("#headers_dl");
   header_grid = $('#header_grid');
   context = header_grid.get(0).getContext("2d");
   length_field_cb = $("#length_field_cb");
   csum_field_cb = $("#csum_field_cb");
   pivot_field_cb = $("#pivot_field_cb");
   field_name_tb = $("#field_name_tb");
   field_width_tb = $("#field_width_tb");
   
   EventUtil.addHandler(header_grid.get(0), "click", handleClick);
   EventUtil.addHandler(headers_dl, "change", handleSelect);
   $('#header_files').on("change", handleFileRead);
   $('#header_script_format').on("change", displayScript);
   
   drawGrid();

   // Display Grid, text, script areas
   $('#display_grid_cb').prop("checked", true);
   $('#display_text_cb').prop("checked", true);
   $('#display_script_cb').prop("checked", true);
   $("#display_grid_cb").on("click", function(e) {
      if ($('#display_grid_cb').prop('checked'))
         $("#grid_area").show("slow", "swing");
      else
         $("#grid_area").hide();
   });
   $("#display_text_cb").on("click", function(e) {
      if ($('#display_text_cb').prop('checked'))
         $("#text_edit_area").show("slow", "swing");
      else
         $("#text_edit_area").hide();
   });
   $("#display_script_cb").on("click", function(e) {
      if ($('#display_script_cb').prop('checked'))
         $("#script_edit_area").show("slow", "swing");
      else
         $("#script_edit_area").hide();
   });

   readHeadersFile("load_pre_defined_headers"); // needs a string instead of a file read event
}