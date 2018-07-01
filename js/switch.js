var vne_list = [];
var port_list = [];
var num_ports = 24;

function changePortsVne(event)
{
	var id = event.target.id;
	var port_num = Number(id.substr("port".length, id.length));
   	port_list[port_num].vne = event.target.value;
   	displayVnes();
}

function changeVneName(event)
{
   var id = event.target.id;
   var vne_number = Number(id.substr("vne".length, id.length));
   vne_list[vne_number].name = event.target.value;
   displayPorts();
   $('#'+id).focus();
}

function displayVnes()
{
	var i = 0;
	var j = 0;
	var loc = $('#vne_area');
	var first_port = true;

	loc.empty();
	for (i = 0; i< vne_list.length; i++) {
		loc.append('<input type="textbox" id="vne' +i+ '">');
		loc.append('<br>');
		$('#vne' + i).prop("value", vne_list[i].name);
		$('#vne' + i).on('keyup', changeVneName);

		for (j=0; j< num_ports; j++) {
			if (port_list[j].vne == i) {
				if (first_port == true)
					first_port = false;
				else
					loc.append(', ');
				loc.append(port_list[j].name);
			}
		}
		if (first_port == false)
			loc.append('<br>');
		first_port = true;
	}
}

function displayPorts()
{    
    loc = $('#left_ports');
    loc.empty();
	for( i=0; i< num_ports/2; i++) {
		loc.append(port_list[i].name + " ");
		loc.append('<select id="port'+i+'"</select>');
		$('#port'+i).on("change", changePortsVne);
		for(j=0; j<vne_list.length; j++) {
			$('#port'+i).append($('<option>', {value: j, text: vne_list[j].name}));
		}
		$('#port'+i).val(port_list[i].vne);
		loc.append('<br>')
	}

	loc = $('#right_ports');
    loc.empty();
	for( ; i< num_ports; i++) {
		
		loc.append(port_list[i].name + " ");
		loc.append('<select id="port'+i+'"</select>');
		$('#port'+i).on("change", changePortsVne);
		for(j=0; j<vne_list.length; j++) {
			$('#port'+i).append($('<option>', {value: j, text: vne_list[j].name}));
		}
		$('#port'+i).val(port_list[i].vne);
		loc.append('<br>');
	}
}

function addVne()
{
	var new_vne = new Object();

    if (vne_list.length > 7)
    	return;
    new_vne.name = "vne" + vne_list.length + "_name";
	vne_list[vne_list.length] = new_vne;
	
	displayVnes();
	displayPorts();
}

function initSwitchTab () {
   $("#switch_files").hide(); 
   $('#display_switch_script').prop("checked", true);
   $('#add_switch').on("click", addVne);
   vne_list[0] = new Object();
   vne_list[0].name = "vne0_name";
   for (i=0; i< num_ports; i++) {
      port_list[i] = new Object();
      port_list[i].name = "Port" + i;
      port_list[i].vne = 0;
   }
   displayVnes();
   displayPorts();
}
