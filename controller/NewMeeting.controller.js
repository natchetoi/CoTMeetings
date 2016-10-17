sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("fusion.controller.NewMeeting", {

		newMeeting: {
			"MeetingSubject": "",
			"Start": {},
			"End": {},
			"RoomID": "",
			"RoomName": "",
			"AltID": "",
			"MeetingComment": "",
			"Organizer": "Yuri Natchetoi",
			"Attendees": [],
			"Date": "",
			"CallNumber": ""
		},

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.NewMeeting
		 */
		onInit: function() {

			var router = this.getRouter();
			router.getRoute("NewMeeting").attachPatternMatched(this._onObjectMatched, this);

			this.loadMeeting();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.NewMeeting
		 */
		onBeforeRendering: function() {},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.NewMeeting
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.NewMeeting
		 */
		//	onExit: function() {
		//
		//	}

		getMeeting: function() {
			var view = this.getView();
			var oModel = view.getModel("new");
			var meeting = oModel.getData();
			return meeting;
		},

		_onObjectMatched: function(oEvent) {
			//add attendees result
			if (window.coTShared !== undefined && window.coTShared.meeting !== undefined && window.coTShared.meeting.attendees !== undefined) {
				window.coTShared.NewMeeting.Attendees = window.coTShared.meeting.attendees;
				this.newMeeting.Attendees = window.coTShared.meeting.attendees;
			}

			//find room results
			if (window.coTShared !== undefined && window.coTShared.meeting !== undefined && window.coTShared.meeting.room !== undefined) {
				window.coTShared.NewMeeting.RoomID = window.coTShared.meeting.roomId;
				this.newMeeting.RoomName = window.coTShared.meeting.room;
				this.newMeeting.RoomID = window.coTShared.meeting.roomId;
			}

			this.loadMeeting();
		},

		addPerson: function() {
			this.preSaveMeeting();
			var newMeetingView = this.getView();
			sap.ui.core.UIComponent.getRouterFor(this).navTo("SelectPerson", {
				view: newMeetingView
			}, true);
		},

		pickTime: function() {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Scheduler", {}, true);
		},

		findRoom: function() {
			this.preSaveMeeting();
			sap.ui.core.UIComponent.getRouterFor(this).navTo("FindRoom", {}, true);
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		postMeeting: function() {

			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/appointments/";

			var payload = {
				"AltID": "String content7056",
				"MeetingSubject": "talk about mobile",
				"MeetingComment": "test сomment",
				"RoomID": "860ae2ee-2620-4035-b36b-c4ff67d1124a",
				"End": "\/Date(1476327600000)\/",
				"Start": "\/Date(1476324000000)\/",
				"TimeZoneId": "Eastern Daylight Time",
				"Attendees": "George liu, Yuri Natchetoi",
				"Organizer": "ynatche@toronto.ca"
			};

			var param = {
				"LastModified": 1473969772,
				"MeetingSubject": "talk about mobile",
				"Start": 1473962572,
				"Preset": [{
					"Enabled": false,
					"PresetFields": ""
				}],
				"GWMeetingID": [{
					"xsi:nil": true,
					"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
				}],
				"End": 1473969772,
				"RoomID": "860ae2ee-2620-4035-b36b-c4ff67d1124a",
				"IsPrivate": false,
				"RVMeetingID": [{
					"xsi:nil": true,
					"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
				}]
			};

			var aData = jQuery.ajax({
				url: url,
				type: "POST",
				data: payload,
				dataType: "json",
				contentType: "application/json",
				async: true,
				crossDomain: true,
				success: function(data, textStatus, jqXHR) { // callback called when data is 
					alert('data=' + data);
					jQuery.sap.require("sap.m.MessageBox");
					//sap.m.MessageBox.show("Hello from sap messagebox" + data);

				},
				error: function(data, textStatus, jqXHR) {
					alert("Error occured" + data.statusText + textStatus);
				}
			});

		},

		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("main", true);
			}
		},

		preSaveMeeting: function() {
			window.coTShared.NewMeeting = this.newMeeting;
		},

		loadMeeting: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(this.newMeeting);
			this.getView().setModel(oModel);
		},

		saveMeeting: function() {
			this.preSaveMeeting();
			var meetingsModel = this.getView().getModel("all_meetings");
			var data = meetingsModel.getData();
			this.newMeeting.AltID = (data.length + 1).toString();
			data.push(this.newMeeting);
			meetingsModel.setData(data);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main", true);
		}

	});

});