var nameToNode = [];
var new_node_cnt = 1;
var root_node;

function displayIndent(loc, num)
{
	for (i = 0; i< num; i++) {
		loc.append('<img src=img/40-40.bmp alt="-" height="5" width = "30">');
	}
}

function getNodeByName(name)
{
	return nameToNode[name];
}


function newNode(name, level) 
{
   // if another node with same name exists
   if (nameToNode[name]) {
      name = name + new_node_cnt++;
   }
   var new_node = new Object();
   new_node.name = name;
   new_node.type = "";
   new_node.level = level;
   new_node.children = 0;
   new_node.edit = false;
   new_node.expanded = false;
   nameToNode[name] = new_node;
   return new_node;
}

function setProtocolType(event)
{
   var prot_name = event.target.name;
   var node = getNodeByName(prot_name);

   node.type = event.target.value;
   showProtocolsScript();
}

function addAChild(event)
{
   var prot_name = event.target.name;
   var node = getNodeByName(prot_name);
   var new_node = newNode("new-node", node.level+1);
   var i = 0;
   
   node.children++;
   if(!node.pivots) {
      node.pivots = new Array();                    // create new pivot list
   }
   new_node.pivot_field = "";
   for(i=0; i < header_list.length; i++) {
       if(header_list[i].name == node.type) {
          fields = header_list[i].fields;
          for (j = 0; j < fields.length; j++) {
             if(fields[j].pivot_field == true) {
                new_node.pivot_name = fields[j].name;
             }
          }
       }
   }

   new_node.pivot_value = 0;
   new_node.parent = node.name;
   node.pivots.push(new_node);                      // insert new pivot
   node.expanded = true;
   refreshNodeHead(node);
   var loc = $('#'+prot_name+'_children_area');     // location of parent's children area
   loc.append('<div id = "' + new_node.name + '" >');
   prot_name = new_node.name;
   loc = $('#'+prot_name);
   loc.append($('<div id = "' + prot_name + "_head_area" + '" >'));
   loc.append($('<div id = "' + prot_name + "_edit_area" + '" >'));
   loc.append($('<div id = "' + prot_name + "_children_area" + '" >'));
   showNode(new_node);                     // display the pivot to be edited
   showProtocolsScript();                  // Update script for the whole tree
}

function getP4ProtDeclarations(node)
{
   var p4String = "";
   var i = 0;

   if (node.type == "")
      p4String += "header " + "<Type>_t " + node.name + ";\n";
   else
      p4String += "header " + node.type + "_t " + node.name + ";\n";
   for(i=0; i< node.children; i++)
      p4String = p4String + getP4ProtDeclarations(node.pivots[i]);
   return p4String;
}

function getP4OfProtNode(node)
{
   var p4String = "";
   var i = 0;
   var j = 0;
   var fields;
   var csum_field = "";
   var indent = "   ";

   // do checksum related verbage before the protocol
   // check if there is checksum field in the header
   for (i=0; i<header_list.length; i++) {
      if(header_list[i].name == node.type) {
         fields = header_list[i].fields;
         p4String += "field_list " + node.name + "_checksum_list {\n";
         for (j = 0; j < fields.length; j++) {
            if (fields[j].csum_field) {
               csum_field = fields[j].name;
            } else {
               p4String += indent + node.name + "." + fields[j].name + ";\n";
            }
         }
      }
   }
   if (csum_field != "") {
      p4String += "}\n\n";
      p4String += "field_list_calculation " + node.name + "_checksum {\n";
      p4String += indent + "input {\n";
      p4String += indent + indent + node.name + "_checksum_list;\n";
      p4String += indent + "}\n";
      p4String += indent + "algorithm : csum16;\n";
      p4String += indent + "output_width : 16;\n";
      p4String += "}\n\n";
      p4String += "calculated_field " + node.name + "." + csum_field + " {\n"
      p4String += indent + "verify " + node.name + "_checksum;\n";
      p4String += indent + "update " + node.name + "_checksum;\n";
      p4String += "}\n\n";
   }
   else
      p4String = "";         //reset the string

   p4String += "parser " + node.name + " {\n";
   p4String += "   extract(" + node.name + ");\n";  
   if (node.children) {
      if (node.pivots[0].pivot_name == undefined)
         p4String += "   return select(latest.<Field>) {\n";
      else
         p4String += "   return select(latest." + node.pivots[0].pivot_name + ") {\n";
      for(i=0; i < node.children; i++) {
        p4String += "      " + node.pivots[i].pivot_value + " : " + node.pivots[i].name + ";\n";
      }
      p4String += "      default : ingress;\n";
      p4String += "   }\n"
   }
   p4String += "}\n\n";

   // get P4 scripts of the chindren
   for(i=0; i < node.children; i++) {
      p4String += getP4OfProtNode(node.pivots[i]);
   }

   return p4String;
}

function generateP4Protocols()
{
   var p4String = "";
   var indent = "   ";

   p4String += getP4ProtDeclarations(root_node);
   p4String += "\n";
   p4String += "parser start {\n";
   p4String += indent + "return " + root_node.name + ";\n";
   p4String += "}\n\n";

   p4String += getP4OfProtNode(root_node);
   return p4String;
}

function showProtocolsScript()
{
   var jsonAsString = " ";
   
   if ($("#protocol_script_format option:selected").text() == "JSON") {
      jsonAsString = JSON.stringify(root_node, null, " ");
      $('#prot_script_tb').prop('value', jsonAsString);
   } 
   else
      $('#prot_script_tb').prop('value', generateP4Protocols());
}

function refreshNodeHead(node)
{
   var prot_name = node.name;
   var loc = $('#'+prot_name+'_head_area');

   loc.empty();
   showNodeHead(node);
   showProtocolsScript();
}

function refreshNode(node)
{
   var prot_name = node.name;
   var loc = $('#'+prot_name+'_head_area');
   loc.empty();
   loc = $('#'+prot_name+'_edit_area');
   loc.empty();
   loc = $('#'+prot_name+'_children_area');
   loc.empty();
   showNode(node);
} 

function showNode(node)
{
   showNodeHead(node);
   showNodeFields(node);
   showNodeChildren(node);

   // TODO - Update script after a timeout, so that we do not do it for each node
   showProtocolsScript();
}

function showNodeHead(node)
{
  var prot_name = node.name;
  var i=0;

  loc = $('#'+prot_name+'_head_area');
  displayIndent(loc, node.level);
   if(node.children) {
      if (node.expanded) {
         loc.append($('<img onclick=expandNode(event) id="' +prot_name+"_expanded"+ '" src="img/open_folder.png" alt="+" ></img>'));
      } else {
         loc.append($('<img onclick=expandNode(event) id="' +prot_name+"_expanded"+ '" src="img/closed_folder.png" alt="-" ></img>'));
      }
   } else {
      loc.append('<img src="img/file.png" alt="." ></img>');
   }

   loc.append('<a class="nodes">'+ node.name +'</a>');
   loc.append($('<select name = "' +prot_name+ '" id=' + prot_name + "_type" + '></select>'));
   $('#'+prot_name+'_type').append($('<option>', {
      value: " ",
      text: "Select Protocol Type"
   }));
   for (i = 0; i < header_list.length; i++) {
       $('#'+prot_name+'_type').append($('<option>', {
           value: header_list[i].name,
           text: header_list[i].name
       }));
   }
   if (node.edit)
      loc.append($('<img onclick=editNode(event) id="' +prot_name+"_edit"+ '" src="img/close_edit.png"></img>'));
   else
      loc.append($('<img onclick=editNode(event) id="' +prot_name+"_edit"+ '" src="img/edit_folder.png"></img>'));
   loc.append($('<img src="img/add_child.png" onclick="addAChild(event)" name = "' +prot_name+ '" id=' + prot_name + "_children" + '></img>'));
   loc.append('<br>');
   $('#'+prot_name+'_type').val(node.type);
   $('#'+prot_name+"_edit").prop('name', prot_name);
   $('#'+prot_name+"_expanded").prop('name', prot_name);
   $('#'+prot_name+'_type').on('change', setProtocolType);
}

function showNodeFields(node)
{
   var prot_name = node.name;
   var indent = 2 + node.level;

   if(!node.edit)
      return;

   loc = $('#'+prot_name+'_edit_area');
   displayIndent(loc, indent);
   loc.append($('<input>', {
      type : "textbox",
      id : prot_name + "_name",
      size : 20
   }));
   loc.append('Protocol Name<br>');

   // Set values of displayed fields from the node
   $('#'+prot_name+'_name').val(node.name);
   
   // set event handlers, identifiers
   $('#'+prot_name+'_name').prop('name', node.name);
   $('#'+prot_name+'_name').on('keyup', changeProtocolName);

   if (node != root_node) { 
     displayIndent(loc, indent);
     loc.append($('<input>', {
        type : "textbox",
        id : prot_name + "_pivot_name",
        size : 15
     }));
     loc.append('Pivot Name<br>');
     displayIndent(loc, indent);
     loc.append($('<input>', {
        type : "textbox",
        id : prot_name + "_pivot_value",
        size : 15
     }));
     loc.append('Pivot Value<br>');

     // Set values of displayed fields from the node
     $('#'+prot_name+'_pivot_name').val(node.pivot_name);
     $('#'+prot_name+'_pivot_value').val(node.pivot_value);
     // Map the Divs to name
     $('#'+prot_name+'_pivot_name').prop('name', node.name);
     $('#'+prot_name+'_pivot_value').prop('name', node.name);
     // set event handlers, identifiers
     $('#'+prot_name+'_pivot_name').on('keyup', changePivotName);
     $('#'+prot_name+'_pivot_value').on('keyup', changePivotValue);
  }
}

function showNodeChildren(node)
{
   var prot_name = node.name;
   var parent_loc = $('#'+prot_name+'_children_area');
   var i = 0;

   if(!node.expanded)
      return;
   
   for (i=0; i< node.children; i++) {
      // newly shown children will not be expanded, or being edited
      var child = node.pivots[i];
      child.expanded = false;
      child.edit = false;
      // add divs for each child in the parent's children_area
      parent_loc.append('<div id = "' + child.name + '" >');
      prot_name = child.name;
      var loc = $('#'+prot_name);
      loc.append($('<div id = "' + prot_name + "_head_area" + '" >'));
      loc.append($('<div id = "' + prot_name + "_edit_area" + '" >'));
      loc.append($('<div id = "' + prot_name + "_children_area" + '" >'));
      showNode(child);
   }
}

function editNode(event)
{
	var prot_name = event.target.name;
	var node = getNodeByName(prot_name);
  
	node.edit = node.edit ? false : true; 
  if (node.edit) {  
    showNodeFields(node);
  }
  else {
     $('#'+prot_name+'_edit_area').empty();
  }
  refreshNodeHead(node);       // To get the icons right
}

function expandNode(event)
{
	var prot_name = event.target.name;
	var node = getNodeByName(prot_name);
	
	node.expanded = node.expanded ? false : true;
  if(node.expanded)
	   showNodeChildren(node);
  else
     $('#'+prot_name+'_children_area').empty();
   refreshNodeHead(node);      // To get the icons right
}

function changePivotName(event)
{
  var prot_name = event.target.name;
  var node = getNodeByName(prot_name);
  var parent_node = getNodeByName(node.parent);
  var identifier = event.keyCode;
  var i = 0;
  var j = 0;
  var fields;

  if(identifier == 13) {
    for(i=0; i < header_list.length; i++) {
       if(header_list[i].name == parent_node.type) {
          fields = header_list[i].fields;
          for (j = 0; j < fields.length; j++) {
             if(fields[j].name == event.target.value) {
                node.pivot_name = event.target.value;
                $(this).css({ 'color': 'black'});
                showProtocolsScript();
                return;
             }
          }
       }
    }
    alert("Field does not exist in parent");
    $(this).css({ 'color': 'red'});
  }
}

function changePivotValue(event)
{
  var prot_name = event.target.name;
  var node = getNodeByName(prot_name);
  var identifier = event.keyCode;
  
  if(identifier == 13) {
     node.pivot_value = event.target.value;
     showProtocolsScript();
  }
}

function changeProtocolName(event)
{
	var old_name = event.target.name;
  var new_name = event.target.value;
	var node = getNodeByName(old_name);
	var identifier = event.keyCode;
  var div;

  if(identifier == 13) {
  	if (old_name != event.target.value) {  // if name changed
  		// nameToNode[node.name] = node;
      div = $('#'+old_name);
      div.prop('id', new_name);
      div = $('#'+old_name+'_head_area');
      div.prop('id', new_name+'_head_area');
      div = $('#'+old_name+'_edit_area');
      div.prop('id', new_name+'_edit_area');
      div = $('#'+old_name+'_children_area');
      div.prop('id', new_name+'_children_area');

      // clearn any references to old name
      $('#'+new_name+'_head_area').empty();
      $('#'+new_name+'_edit_area').empty();

      node.name = new_name;
      nameToNode[node.name] = node;
      showNodeHead(node);
      showNodeFields(node);
      showNodeChildren(node);
      showProtocolsScript();
  	}
  }
}

function mapNamesToNode(node)
{
   var i = 0;
   nameToNode[node.name] = node;
   for(i=0; i< node.children; i++)
      mapNamesToNode(node.pivots[i]);
}

function readProtocolsFile(event)
{
   var old_name = "root";

   var jsonAsString = "";

   if ( typeof event === 'string') {
      root_node = pre_loaded_protocols;
   } else {
      old_name = root_node.name;
      jsonAsString = event.target.result;       // Read PDL file in json format
      root_node = JSON.parse(jsonAsString);
   }
   
   nameToNode.splice(0, nameToNode.length);
   mapNamesToNode(root_node);

   // clean up display of old root node
   $('#'+old_name+'_head_area').empty();
   $('#'+old_name+'_edit_area').empty();
   $('#'+old_name+'_children_area').empty();

   div = $('#'+old_name);
   new_name = root_node.name;
   div.prop('id', new_name);
   div = $('#'+old_name+'_head_area');
   div.prop('id', new_name+'_head_area');
   div = $('#'+old_name+'_edit_area');
   div.prop('id', new_name+'_edit_area');
   div = $('#'+old_name+'_children_area');
   div.prop('id', new_name+'_children_area');

   showNodeHead(root_node);
   showNodeFields(root_node);
   showNodeChildren(root_node);
   showProtocolsScript();
}

function saveProtocolsFile(event)
{
   var jsonAsString = JSON.stringify(root_node, null, " ");
   saveStringToFile(jsonAsString, "ff_protocols.txt");
}

function loadProtocolsFile(event)
{
   $("#protocol_files").trigger("click");
}

function initParserTab()
{
   // Display and hide elements
   $("#protocol_files").hide(); 
   $('#display_prot_script').prop("checked", true);

   // Set up handlers
   $('#protocol_files').on("change", handleFileRead);
   $("#display_prot_script").on("click", function(e) {
      if ($('#display_prot_script').prop('checked')) {
         $("#prot_script_tb").show("slow", "swing");
         $("#prot_script_area").show("slow", "swing");
      } else {
         $("#prot_script_tb").hide();
         $("#prot_script_area").hide();
      }
   });
   $('#protocol_script_format').on("change", showProtocolsScript);

   // Initialize
   root_node = newNode("root", 0);                          // need this for divs
   showNode(root_node);                                     // TODO - may not need this, remove to optimize
   readProtocolsFile("use pre loaded protocols to start");  // send a string instead of file read event
}

// $(this).css({ 'color': 'red', 'font-size': '150%' });