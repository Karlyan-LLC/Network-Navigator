var actions_list = [];

function generateP4Actions()
{
   return "Test P4 string";
}

function showActionsScript()
{
   var jsonAsString = " ";
   
   if ($("#actions_script_format option:selected").text() == "JSON") {
      jsonAsString = JSON.stringify(actions_list, null, " ");
      $('#actions_script_tb').prop('value', jsonAsString);
   } 
   else
      $('#actions_script_tb').prop('value', generateP4Actions());
}

function loadActionsFile(event)
{
   
}

function saveActionsFile(event)
{
   alert("saveActionsFile");
}

function displayActions()
{
   var loc = $('#actions_area');
   var i = 0;

   if (actions_list.length == 0)
      return;
   loc.empty();
   for (i=0; i< actions_list.length ; i++) {
      loc.append('<input type="textbox" id="action_' + i + '" size="20">');
      $('#action_'+i).val(actions_list[i].name);
   
      loc.append($('<select id="ops_' + i + '"></select>'));
      $('#ops_'+i).on("change", AddOperation);
      loc = $('#ops_'+i);
      loc.append($('<option>', { value: "AddOperation", text: "Add Operation" }));
      loc.append($('<option>', { value: "SetField", text: "Set Field" }));
      loc.append($('<option>', { value: "DecrementBy1", text: "Decrement By 1" }));
      loc.append($('<option>', { value: "AddField", text: "Add Field" }));
      loc.append($('<option>', { value: "RemoveField", text: "Remove Field" }));
      loc.append($('<option>', { value: "nop", text: "Nop" }));
   }
}

function AddOperation(event)
{
   var i = Number(event.target.id.substring("ops_".length));
   var j = 0;

   switch (event.target.value) {
      case "SetField" :
         loc = $('#ops_'+i);
         loc.append("<br>");
         loc.append(" ");
         j = actions_list[i].ops.length;
         actions_list[i].ops[j].type = "SetField";
         actions_list[i].ops[j].field = "";
         actions_list[i].ops[j].value = "";
         loc.append('<input type="textbox" id="ops_field' + i + "_" + j + '" size="20">');
         loc.append('<input type="textbox" id="ops_value' + i + "_" + j + '" size="20">');
      case "DecrementBy1" :
      case "nop" :
         break;
   }   
}

function addAction()
{
   var new_action = new Object();

   new_action.name = "new_action";
   new_action.ops = new Array;
   actions_list[actions_list.length] = new_action;
   displayActions();
}

function initActionsTab()
{
   // Display and hide elements
   $("#actions_files").hide(); 
   $('#display_actions_script').prop("checked", true);

   // Set up handlers
   $('#actions_files').on("change", handleFileRead);
   $("#display_actions_script").on("click", function(e) {
      if ($('#display_actions_script').prop('checked')) {
         $("#actions_script_tb").show("slow", "swing");
         $("#actions_script_area").show("slow", "swing");
      } else {
         $("#actions_script_tb").hide();
         $("#actions_script_area").hide();
      }
   });
   $('#actions_script_format').on("change", showActionsScript);
   $('#add_action').on("click", addAction);

   // Initialize
   loadActionsFile("use pre loaded actions to start");  // send a string instead of file read event
}
