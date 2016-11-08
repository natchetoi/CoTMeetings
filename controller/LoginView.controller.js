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

// -------------------------------------------------------------------------------------
		loadAppointments: function ( userName ) {

		  this.appointments = []; 
		  var date = "11/04";

		  if(window.coTShared.on) {	
			
			var room = "1a775e79-c1e1-479b-be90-6704d16b48b1"; // Adelaide
			this.loadMeetingsForRoom(room, date); 
			
			room = "2fb16a9c-c4b2-4fa8-a0bc-f81f189acdb8"; // Berkley
			this.loadMeetingsForRoom(room, date); 
			
			room = "adf3b026-9a85-494f-b69c-08e328ebdc8d"; // Duncan
			this.loadMeetingsForRoom(room, date); 
			
			room = "860ae2ee-2620-4035-b36b-c4ff67d1124a"; // Wellington
			this.loadMeetingsForRoom(room, date); 
			
			room = "e774d73c-ddbf-4195-8125-2077f005c2e4"; // Frederick
			this.loadMeetingsForRoom(room, date);
		  }

	        this.setAppointmentsModel( userName );
	
		},
		
		convertDT: function( epoch ) {
			  var d;
			  try {
				var utcSeconds = epoch.substring(6, 19);
				d = new Date(0);
				d.setUTCMilliseconds(utcSeconds);
	    	  } catch(err) {
	    		alert(err);
	    	  }
			  return d;
		},

	
		filterName: function( userName ) {
			var name = "Asad";
			if(userName === "testweb2" || userName === "hmatth") {
				name = "Horace";
			} 
			return name;
		},
		
		cleanMeeting: function( attendees ) {
			var attList = [];
			var att = attendees.split(",");
			for(var i=0; i<att.length; i++ ) {
				 var str = att[i].replace( "\"", "" );
				 str = att[i].replace( "\"", "" );
				 attList[i] = { "name" : str };
			}
			return attList;
		},
		
		
		filterMeetings: function(meetingList, userName) {
			var self = this;
			this.appointments = [];
			
			var name = this.filterName( userName);
			
			for(var i=0; i< meetingList.length; i++) {
                try {
					var meeting = meetingList[i];
					var att = meeting.Attendees;
					if(att.indexOf(name) >=0) {
		                  	  var appData = meeting;
		                  	  var epoch = appData.Start.substring(6, 19); 
		                  	  var start = self.convertDT( appData.Start );
		                  	  var end = self.convertDT( appData.End );
//		                  	  var date = start.getMonth() +  "/" + start.getDay() + "/" + start.getYear(); 
		                  	  var date =  start.toString().substring(4, 10);
		                  	  var attendees = this.cleanMeeting(appData.Attendees);
		                  	  start = start.getHours() + ":" + start.getMinutes();
		                  	  end = end.getHours() + ":" + end.getMinutes();
		                  	  
		                  	  
		                  	  var roomID = appData.RoomID;
		                  	  var roomImage = "Images/MH15/Adelaide.png";
		                  	  var roomPath = "Images/MH15/Adelaide1.png";
		                  	  
		                  	  if(window.coTRooms[roomID] != null) {
		                  	     roomImage = window.coTRooms[roomID].Image; 
		                  	     roomPath = window.coTRooms[roomID].Path2Room; 
		                  	  }
		                  	  
		                      var _appointment = {
		                      	  "AltID" : appData.RV_MeetingID,
		                      	  "MeetingSubject" : appData.MeetingSubject,
			                      "MeetingComment" : appData.MeetingComment,
			                      "Location" : appData.Location, 
			                      "Start" : start,
			                      "Epoch" : epoch,
			                      "End" : end,
			                      "Date": date,
			                      "Organizer" : appData.Organizer,
			                      "Image": roomImage,
			                      "Path2Room": roomPath,			                      
			                      "Attendees" : attendees
		                      };
		                      this.appointments.push(_appointment);
					}
	              } catch(err) {
	                  		alert(err);
	              }
				}
			
		},
		
		loadMeetingsForRoom: function ( room, date, userName ) {
		  var self = this;
  		  var name = this.filterName( userName);
			
		  var start = date + "/2016%203:30%20PM";
//			var room = "860ae2ee-2620-4035-b36b-c4ff67d1124a";
			
			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/appointments/?Start=" + 
			start + "&room=" + room + "&duration=200";

//			var url = "model/appointments.json";
			
			var headers = { "Content-Type": "application/json" };
			var aData = jQuery.ajax({
				              url: url,  
			                  type : "GET",
			            	  headers: headers,
			                  dateType: "text",
				              contentType : "application/json",
			                  async: false, 
			                  crossDomain : true,
//						beforeSend : function(jqXHR, settings) {
//									jqXHR.setRequestHeader('Access-Control-Allow-Origin', '*');
//									jqXHR.setRequestHeader('X-SUP-APPCID', this.appCID);
//									jqXHR.overrideMimeType('text/plain; charset=x-user-defined');
//								},		                  
			            success: function(data, textStatus, jqXHR) { 

					      var list = data.API_Appointments;
					      var n = list.length;

			                  for(var i = 0; i< n; i++) {
			                  	try {
			                  	  var appData = list[i];
			                  	  var epoch = appData.Start.substring(6, 19); 
			                  	  var start = self.convertDT( appData.Start );
			                  	  var end = self.convertDT( appData.End );
//			                  	  var date = start.getMonth() +  "/" + start.getDay() + "/" + start.getYear(); 
			                  	  var date =  start.toString().substring(4, 10);
			                  	  var attendees = appData.Attendees.split(",");
			                  	  start = start.getHours() + ":" + start.getMinutes();
			                  	  end = end.getHours() + ":" + end.getMinutes();
			                  	  
			                      var _appointment = {
			                      	  "AltID" : appData.RV_MeetingID,
			                      	  "MeetingSubject" : appData.MeetingSubject,
				                      "MeetingComment" : appData.MeetingComment,
				                      "Location" : appData.Location, 
				                      "Start" : start,
				                      "Epoch" : epoch,
				                      "End" : end,
				                      "Date": date,
				                      "Organizer" : appData.Organizer,
				                      "Attendees" : attendees
			                      };
			                      self.appointments.push(_appointment);
			                  	} catch(err) {
			                  		alert(err);
			                  	}
			                 } 
			                 
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
		
		setAppointmentsModel: function( userName ) {
			var self = this;
			var meetings = new sap.ui.model.json.JSONModel();
			
			if(window.coTShared.on) {              // this.appointments !== undefined && this.appointments.length > 0 ) {
				this.filterMeetings(this.appointments, userName);
				meetings.setData(this.appointments);
				sap.ui.getCore().setModel(meetings, "all_meetings");
				self.mainScreen();
			} else {
				meetings.loadData('model/appointments.json');
				meetings.attachRequestCompleted(function(oEvent) {
					var data = meetings.getData(); 
					var meetingList = data.API_Appointments;
					self.filterMeetings(meetingList, userName);
					meetings.setData(self.appointments);
					sap.ui.getCore().setModel(meetings, "all_meetings");
					self.mainScreen();
				});
			}
		},		
		
// -------------------------------------------------------------------------------------		
		
		loadRooms: function () {
		
			var self = this;
			var url = "model/rooms.json";			
			if(window.coTShared.on) {
			    url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/";
			}
			
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
			                 
//			                 self.mainScreen();
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
//				                    self.mainScreen();
								}			        	   
			                 });
			                 }
			            });		                 
		}, 
		
		mainScreen: function() {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("main", {}, true);
		},
		
		createSession: function() {
			var self = this;
		  
			var userName = this.getView().byId("username").getValue();
			var password = this.getView().byId("password").getValue();
			
			var param = //JSON.stringify(
		   			{ "user" : userName,
					  "pwd" : password, 
					  "app" : "deploy"
				    };
		 var url =  "https://was8-intra-dev.toronto.ca/cc_sr_admin_v1/session/";
		 jQuery.ajax({
	            url: url,  
				type : "POST",
				data: param,
  				dataType: "json",
				contentType : "application/x-www-form-urlencoded",
				async: true, 
				crossDomain : true,
	            success: function(data, textStatus, jqXHR) { // callback called when data is
	                var name = "Success";
	                if(data !== undefined && data.cotUser !== undefined) {
	        		   name = data.cotUser.firstName + " " +  data.cotUser.lastName;
	            	}
	    			var userData = {
	    					"userName" : userName
	    							};
	    	   	    var oModel = new sap.ui.model.json.JSONModel();
	    			oModel.setData(userData);  // fill the received data into the JSONModel
	    			sap.ui.getCore().setModel(oModel, "user");  // Store in the Model

				  sap.m.MessageToast.show("Hello " + name, {
					duration: "200",
					width: "15em",
					my: "center top",
					at: "center top",
					offset: "0 0",
					iNumber: 2,
					autoClose: true,
					onClose: function() {
						self.login(userName);
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
			window.coTShared.on = false;
			
			this.createSession();

			//	   	  this.getRouter().navTo("mymeetings", {}, true );

		}, 
		
		login: function( userName ) {
			this.loadRooms();		
			this.loadAppointments(userName);
			
		}
	});

});