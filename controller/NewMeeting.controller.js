sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("fusion.controller.NewMeeting", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.NewMeeting
		 */
		onInit: function() {
			
			var router = this.getRouter();
			router.getRoute("NewMeeting").attachPatternMatched(this._onObjectMatched, this);
			

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.NewMeeting
		 */
		onBeforeRendering: function() {
		    this.createMeeting();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.NewMeeting
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.NewMeeting
		 */
		//	onExit: function() {
		//
		//	}
		
		
		getMeeting: function () {
			var view = this.getView();
			var oModel = view.getModel("new");
			var meeting = oModel.getData();
			return meeting;
		},

		createMeeting: function() {
			var d = new Date();
			var start = d.getHours() + 1;
			var end = d.getHours() + 2;
			start = start + ":00";
			end = end + ":00";
			var today = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();

			var attendees = {
			"AttendeeSet": [{
				PersonID: "1",
				selected: true,
				firstName: "Yuri",
				lastName: "Natchetoi",
				Position: "Mobility Consultant",
				workEmail: "ynatche@toronto.ca"
			}]
		};

		var meeting = {
			"MeetingSubject": "",
			"Start": start,
			"End": end,
			"Date": today,
			"RoomName": "Adelaide",
			"AltID": "1",
			"MeetingComment": "",
			"Organizer": "Yuri Natchetoi",
			"Attendees": [{
				PersonID: "1",
				selected: true,
				firstName: "Yuri",
				lastName: "Natchetoi",
				Position: "Mobility Consultant",
				workEmail: "ynatche@toronto.ca"
			}]

		};

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(meeting);
		// sap.ui.getCore()
		this.setModel(oModel, "new");


		var oAttendeesModel = new sap.ui.model.json.JSONModel();
		oAttendeesModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		oAttendeesModel.setData(attendees);
		this.setModel(oAttendeesModel, "att");

	},
	

		_onObjectMatched: function(oEvent) {
			var attendees = window.coTShared.att;
			if(attendees !== undefined &&  attendees.length > 0)  {
				var oModel = new sap.ui.model.json.JSONModel();
    			oModel.setData(attendees);
    			var list = this.getView().byId("attListId");
				list.setModel(oModel);

				for(var i = 0; i<attendees.length; i++) {
					var t = attendees[i].firstName + " " + attendees[i].lastName;
					var oListItem = new sap.m.StandardListItem({
					   "title": t
				     });
				     list.addItem(oListItem);
				}
			}
			var room = window.coTShared.att;
			if(room !== undefined) {
				this.getView().byId("roomSelectBox").setValue(room);
			}

		},

		
		addPerson: function() {

			var newMeetingView = this.getView();
			sap.ui.core.UIComponent.getRouterFor(this).navTo("SelectPerson", {  view : newMeetingView }, true);
    
		},
		
		pickTime: function() {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("Scheduler", {}, true);
		},
		
		findRoom: function() {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("FindRoom", {}, true);
		},
		
		calendar: function() {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("Calendar", {}, true);
		},
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		postMeeting: function() {
		
		var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/appointments/";  


		var payload = { 
    		"AltID": "String content7056",
    		"MeetingSubject": "talk about mobile",
    		"MeetingComment": "test сomment",
    		"RoomID":"860ae2ee-2620-4035-b36b-c4ff67d1124a",
    		"End":"\/Date(1476327600000)\/", 
    		"Start":"\/Date(1476324000000)\/",
    		"TimeZoneId": "Eastern Daylight Time",
    		"Attendees" : "George liu, Yuri Natchetoi",
    		"Organizer": "ynatche@toronto.ca"
		};
  
		var param ={"LastModified":1473969772,"MeetingSubject":"talk about mobile","Start":1473962572,"Preset":[{"Enabled":false,"PresetFields":""}],"GWMeetingID":[{"xsi:nil":true,"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"}],"End":1473969772,"RoomID":"860ae2ee-2620-4035-b36b-c4ff67d1124a","IsPrivate":false,"RVMeetingID":[{"xsi:nil":true,"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"}]};

         var aData = jQuery.ajax({
                  url: url,  
                  type : "POST",
                  data: payload,
                  dataType: "json",
                  contentType : "application/json",
                  async: true, 
                  crossDomain : true,
            success: function(data, textStatus, jqXHR) { // callback called when data is 
                        alert('data='+data);
                        jQuery.sap.require("sap.m.MessageBox");
                        //sap.m.MessageBox.show("Hello from sap messagebox" + data);
                              
            },
                  error: function(data, textStatus, jqXHR) {
                    alert("Error occured"+data.statusText + textStatus);
                 }
            });
	
		},
		
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		}
		

	});

});