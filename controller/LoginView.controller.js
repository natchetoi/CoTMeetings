sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("fusion.controller.LoginView", {
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.LoginView
		 */
		onInit: function() {
			//				this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			//				this.getRouter().getRoute("loginview").attachPatternMatched(this._onRouteMatched, this);

			//			$("sapMIBar").css("background-image", "");

		},

		_onRouteMatched: function() {

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.LoginView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.LoginView
		 */
		onAfterRendering: function() {

			var loginButton = this.getView().byId("loginButtonId");
			loginButton.addEventDelegate({
				onAfterRendering: function() {
					loginButton.focus();
				}
			});
			
			jQuery.sap.delayedCall(500, this, function() {
				loginButton.focus();
			});

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.LoginView
		 */
		//	onExit: function() {
		//
		//	}
		//-----------------------------------------------------------------------------
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		loadRooms: function () {
		
		var self = this;
			var url = "model/rooms.json"; // http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/
			var param = { "Content-Type": "application/json" };
			var aData = jQuery.ajax({
				              url: url,  
			                  type : "GET",
//			            	  data: param,
			                  dateType: "text",
				              contentType : "application/json",
			                  async: true, 
			                  crossDomain : true,
			            success: function(data, textStatus, jqXHR) { // callback called when data is 

		                  var rooms = [];   
					      var list = data.API_Rooms;
					      var n = list.length;

			                  for(var i = 0; i< n; i++) {
			                  	try {
			                  	  var roomData = list[i];
			                      var RoomName = roomData.RoomName;
			                      var RoomID = roomData.RoomID;
			                      var _room = {
			                      	"RoomName" : RoomName,
			                      	"RoomID" : RoomID
			                      };
			                      rooms.push(_room);
			                  	} catch(err) {
			                  		alert(err);
			                  	}
			                 } 
			                 
			                 self.loadAppointments();
			            },
			           error: function(data, textStatus, jqXHR) {
			                    alert("Error occured"+data.statusText + textStatus);
			                 }
			            });		                 
		}, 
		
		loadAppointments: function () {
			var url = "model/appointments.json"; // http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/
			var param = { "Content-Type": "application/json" };
			var aData = jQuery.ajax({
				              url: url,  
			                  type : "GET",
//			            	  data: param,
			                  dateType: "text",
				              contentType : "application/json",
			                  async: true, 
			                  crossDomain : true,
			            success: function(data, textStatus, jqXHR) { 

		                  var rooms = [];   
					      var list = data.API_Appointments;
					      var n = list.length;

			                  for(var i = 0; i< n; i++) {
			                  	try {
			                  	  var roomData = list[i];
			                      var RoomName = roomData.RoomName;
			                      var RoomID = roomData.RoomID;
			                      var _room = {
			                      	"RoomName" : RoomName,
			                      	"RoomID" : RoomID
			                      };
			                      rooms.push(_room);
			                  	} catch(err) {
			                  		alert(err);
			                  	}
			                 } 
			            },
			           error: function(data, textStatus, jqXHR) {
			                    alert("Error occured"+data.statusText + textStatus);
			                 }
			            });		                 
		},
		
		loadData: function() {

			var url = "model/API_Rooms.xml"; // http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/
			var param = //JSON.stringify(
				{};
			//	  	var jqXHR = new Array();

			/*
				  	var aData = jQuery.ajax({
				              url: url,  
			                  type : "GET",
			            //    data: param,
			                  dataType: "xml",
			                  //dateType: "json",
			                  //dataType: 'jsonp',
			//                contentType : "application/json",
			                  async: true, 
			                  crossDomain : true,
			            success: function(data, textStatus, jqXHR) { // callback called when data is 
			        
			                        jQuery.sap.require("sap.m.MessageBox");
			//                      alert("Success now!!");
			                        //sap.m.MessageBox.show("Hello from sap messagebox" + data);
			                        
			                  var rooms = [];   
			                  var list = $(data).find('API_Rooms');

			                  var n = list.childNodes().length;
			                  
			                  for(var i = 0; i< n; i++) {
			                    var room = list.getElementsByTagName("API_Room")[i];
			                    var roomName = room.childNodes[0].text;
			                    rooms.push(roomName);
			                 } 
			                  
			                        
			                        
			                var oModel = new sap.ui.model.xml.XMLModel();
			//             oModel.setData(data);  // fill the received data into the JSONModel
			//               sap.ui.getCore().setModel(oModel, "glRooms");  // Store in the Model
			                  
			//                var testStr = oModel.getProperty("/API_Rooms");
			//                alert("attr value OF ROOM NAME is: "+testStr);
			//                if(appC.restrictions === undefined) {
			//                        appC.restrictions = new Array();
			//                  } 
			                              
			            },
			                  error: function(data, textStatus, jqXHR) {
			                    alert("Error occured"+data.statusText + textStatus);
			//                     sap.m.MessageBox.show("Error");
			                 }
			            });
			*/
		},
		onLogin: function(oEvent) {
			var self = this;
			sap.m.MessageToast.show("Logging in..", {
				duration: "200",
				width: "15em",
				my: "center top",
				at: "center top",
				offset: "0 0",
				iNumber: 2,
				autoClose: true,
				onClose: function() {
					var router = sap.ui.core.UIComponent.getRouterFor(self);
					router.navTo("main", {}, true);
				}
			});
			
			this.loadRooms();

			//	   	  this.getRouter().navTo("mymeetings", {}, true );

		}, 
		
		getRooms: function() {
			
		}
	});

});