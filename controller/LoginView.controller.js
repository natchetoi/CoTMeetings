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
		
		convertDT: function( epoch ) {
		  var d;
		  try {
//			var re = new RegExp("\/Date\(\d+\)");			
//			var gr = re.exec(epoch);			
			var msec = epoch.substring(6, 19);
			d = new Date(msec);
      	  } catch(err) {
      		alert(err);
      	  }
		  return d;
		},
		
		attendeeList: function() {
			
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
			var url = "model/rooms.json";			
//			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/";
			
			var headers = { "Content-Type": "application/json" };
			
			var aData = jQuery.ajax({
				              url: url,  
			                  type : "GET",
			            	  headers: headers,
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
							sap.m.MessageToast.show("Error: " + data.statusText + " "  + textStatus, {
								duration: "200",
								width: "15em",
								my: "center top",
								at: "center top",
								offset: "0 0",
								iNumber: 2,
								autoClose: true,
								onClose: function() {
				                    self.loadAppointments();
								}			        	   
			                 });
			                 }
			            });		                 
		}, 
		
		loadAppointments: function () {
			var self = this;
			var url = "model/appointments.json";
			
			var start = "7/27/2016%203:30%20PM";
			var room = "860ae2ee-2620-4035-b36b-c4ff67d1124a";
			
//			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/appointments/?Start=" + 
//			start + "&room=" + room + "&duration=30";
			
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

		                  var appointments = [];   
					      var list = data.API_Appointments;
					      var n = list.length;

			                  for(var i = 0; i< n; i++) {
			                  	try {
			                  	  var appData = list[i];
			                  	  var start = self.convertDT( appData.Start );
			                  	  var end = self.convertDT( appData.End );
			                  	  var attendees = appData.Attendees.split(",");
			                  	  
			                      var _appointment = {
			                      	"AltID" : appData.AltID,
			                      	"MeetingSubject" : appData.MeetingSubject,
				                      "MeetingComment" : appData.MeetingComment,
				                      "Location" : appData.Location, 
				                      "Start" : start,
				                      "End" : end,
				                      "Organizer" : appData.Organizer,
				                      "Attendees" : attendees
			                      };
			                      appointments.push(_appointment);
			                  	} catch(err) {
			                  		alert(err);
			                  	}
			                 } 
		                     self.mainScreen();
			                 
			            },
			           error: function(data, textStatus, jqXHR) {
							sap.m.MessageToast.show("Error: " + data.statusText + " "  + textStatus, {
								duration: "200",
								width: "15em",
								my: "center top",
								at: "center top",
								offset: "0 0",
								iNumber: 2,
								autoClose: true,
								onClose: function() {
				                    self.mainScreen();
								}			        	   
			                 });
			                 }
			            });		                 
		},
		
		loadData: function() {

//			var url = "model/API_Rooms.xml"; 
			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/";
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
		
		login: function(data) {
					var self = this;
			   	    var oModel = new sap.ui.model.json.JSONModel();
       			    oModel.setData(data);  // fill the received data into the JSONModel
       				sap.ui.getCore().setModel(oModel, "user");  // Store in the Model
					this.loadRooms();				 
		},
		
		mainScreen: function() {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("main", {}, true);
		},
		
		createSession: function() {
			var self = this;
		  
			var param = //JSON.stringify(
		   			{ "user" : "testweb1",
					  "pwd" : "toronto", 
					  "app" : "deploy"
				    };
		 var url =  "https://was8-intra-dev.toronto.ca/cc_sr_admin_v1/session/";
//	     var url =  "http://behealthymagazine.ca/session.php";
		 jQuery.ajax({
	            url: url,  
				type : "POST",
				data: param,
  				dataType: "json",
				contentType : "application/x-www-form-urlencoded",
				async: true, 
				crossDomain : true,
	            success: function(data, textStatus, jqXHR) { // callback called when data is 
	        		var name = data.cotUser.firstName + " " +  data.cotUser.lastName;
						sap.m.MessageToast.show("Hello " + name, {
						duration: "200",
					width: "15em",
					my: "center top",
					at: "center top",
					offset: "0 0",
					iNumber: 2,
					autoClose: true,
					onClose: function() {
						self.login();
					}
				});
	            },
	            
				error: function(data, textStatus, jqXHR) {
					sap.m.MessageToast.show("Error: " + data.statusText + " "  + textStatus, {
						duration: "200",
						width: "15em",
						my: "center top",
						at: "center top",
						offset: "0 0",
						iNumber: 2,
						autoClose: true,
						onClose: function() {
							self.login();
						}
					});
				}
			});
		}, 

		onLogin: function(oEvent) {
			this.createSession();

			//	   	  this.getRouter().navTo("mymeetings", {}, true );

		}, 
		
		getRooms: function() {
			
		}
	});

});