var pre_loaded_headers = 
[
 {
  "name": "SwitchHeader",
  "fields": [
   {
    "name": "Port",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "VLAN",
    "width": 12,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "VNE",
    "width": 4,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "Result",
  "fields": [
   {
    "name": "Type",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "val1",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "val1",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "val3",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "DerivedFields",
  "fields": [
   {
    "name": "UserGrp",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "AppGroup",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "DeviceGroup",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "Ethernet",
  "fields": [
   {
    "name": "Dest_MAC",
    "width": 48,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Src_MAC",
    "width": 48,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Ether_Type",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": true
   }
  ]
 },
 {
  "name": "IPv4",
  "fields": [
   {
    "name": "version",
    "width": 4,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "HLen",
    "width": 4,
    "length_field": true,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "TOS",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Total_Length",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Identification",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "flags",
    "width": 4,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Frag_Offset",
    "width": 12,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "TTL",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "L3Protocol",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": true
   },
   {
    "name": "HeaderChecksum",
    "width": 16,
    "length_field": false,
    "csum_field": true,
    "pivot_field": false
   },
   {
    "name": "SrcAddr",
    "width": 32,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "DestAddr",
    "width": 32,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "ARP",
  "fields": [
   {
    "name": "Hardware_Type",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Protocol_Type",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "HLen",
    "width": 8,
    "length_field": true,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "PLen",
    "width": 8,
    "length_field": true,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Operation",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Sender_Mac_Address",
    "width": 48,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Sender_IP_Address",
    "width": 32,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Target_Mac_Address",
    "width": 48,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Target_IP_Address",
    "width": 32,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "IPv6",
  "fields": [
   {
    "name": "Version",
    "width": 4,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "TrafficClass",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Flowable",
    "width": 20,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "PayloadLength",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "NextHeader",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "HopLimit",
    "width": 8,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Src_Addr",
    "width": 128,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Dest_Addr",
    "width": 128,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "TCP",
  "fields": [
   {
    "name": "Src_Port",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Dest_Port",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Sequence_Number",
    "width": 32,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Ack_Number",
    "width": 32,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "HLen",
    "width": 4,
    "length_field": true,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Reserved",
    "width": 6,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "URG",
    "width": 1,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "ACK",
    "width": 1,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "PSH",
    "width": 1,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "RST",
    "width": 1,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "SYN",
    "width": 1,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "FIN",
    "width": 1,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Window",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "CheckSum",
    "width": 16,
    "length_field": false,
    "csum_field": true,
    "pivot_field": false
   },
   {
    "name": "UrgentPointer",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Options",
    "width": 24,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   }
  ]
 },
 {
  "name": "UDP",
  "fields": [
   {
    "name": "Src Port",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Dest_Port",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "Length",
    "width": 16,
    "length_field": false,
    "csum_field": false,
    "pivot_field": false
   },
   {
    "name": "CheckSum",
    "width": 16,
    "length_field": false,
    "csum_field": true,
    "pivot_field": false
   }
  ]
 }
]
;

var pre_loaded_protocols = 
{
 "name": "Ethernet",
 "type": "Ethernet",
 "level": 0,
 "children": 3,
 "edit": false,
 "expanded": true,
 "pivots": [
  {
   "name": "IPv4",
   "type": "IPv4",
   "level": 1,
   "children": 0,
   "edit": false,
   "expanded": false,
   "pivot_field": "",
   "pivot_value": "0x0800",
   "parent": "Ethernet",
   "pivot_name": "Ether_Type"
  },
  {
   "name": "IPv6",
   "type": "IPv6",
   "level": 1,
   "children": 0,
   "edit": true,
   "expanded": false,
   "pivot_field": "",
   "pivot_value": "0x86DD",
   "parent": "Ethernet",
   "pivot_name": "Ether_Type"
  },
  {
   "name": "ARP",
   "type": "ARP",
   "level": 1,
   "children": 0,
   "edit": true,
   "expanded": false,
   "pivot_field": "",
   "pivot_value": "0x0806",
   "parent": "Ethernet",
   "pivot_name": "Ether_Type"
  }
 ]
};
var pre_loaded_features = 
[
 {
  "name": "ARPInspection",
  "fblocks": [
   {
    "name": "ARPLearn"
   },
   {
    "name": "MAC-IP-Binding"
   },
   {
    "name": "nop"
   }
  ]
 },
 {
  "name": "L2Switch",
  "fblocks": [
   {
    "name": "LearnL2"
   },
   {
    "name": "SwitchL2"
   },
   {
    "name": "nop"
   }
  ]
 },
 {
  "name": "IPv4ACL",
  "fblocks": [
   {
    "name": "v4ACL"
   },
   {
    "name": "nop"
   }
  ]
 }
]
;

var pre_loaded_lookups =
[
 {
  "name": "ARPLearn",
  "type": "Learn",
  "in_fields": [
   "SwitchHeader__Port",
   "ARP__Sender_Mac_Address",
   "ARP__Sender_IP_Address"
  ],
  "out_fields": [],
  "selected_fields": [],
  "selected_infields": [],
  "selected_outfields": []
 },
 {
  "name": "MAC-IP-Binding",
  "type": "nop",
  "in_fields": [
   "SwitchHeader__Port",
   "Ethernet__Src_MAC",
   "IPv4__SrcAddr"
  ],
  "out_fields": [],
  "selected_fields": [],
  "selected_infields": [],
  "selected_outfields": []
 },
 {
  "name": "LearnL2",
  "type": "nop",
  "in_fields": [
   "SwitchHeader__VLAN",
   "Ethernet__Src_MAC"
  ],
  "out_fields": [
  "SwitchHeader__Port"
  ],
  "selected_fields": [],
  "selected_infields": [],
  "selected_outfields": []
 },
 {
  "name": "SwitchL2",
  "type": "nop",
  "in_fields": [
   "Ethernet__Dest_MAC",
   "SwitchHeader__VLAN"
  ],
  "out_fields": [
   "Result__Type",
   "Result__val1"
  ],
  "selected_fields": [],
  "selected_infields": [],
  "selected_outfields": []
 },
 {
  "name": "v4ACL",
  "type": "nop",
  "in_fields": [
   "SwitchHeader__Port",
   "IPv4__SrcAddr",
   "IPv4__DestAddr",
   "IPv4__L3Protocol"
  ],
  "out_fields": [],
  "selected_fields": [],
  "selected_infields": [],
  "selected_outfields": []
 }
];