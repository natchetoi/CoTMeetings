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
			"Location": "",
			"AltID": "",
			"MeetingComment": "",
			"Organizer": window.coTRooms.Organizer,
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

			var empty = oEvent.getParameter("arguments").empty;
			if (empty === "true") {
				this.initMeeting();
			}

			//add attendees result
			if (window.coTShared !== undefined && window.coTShared.meeting !== undefined && window.coTShared.meeting.attendees !== undefined) {
				if (window.coTShared.NewMeeting === undefined) {
					window.coTShared.NewMeeting = {};
				}
				window.coTShared.NewMeeting.Attendees = window.coTShared.meeting.attendees;
				this.newMeeting.Attendees = window.coTShared.meeting.attendees;
			}

			//find room results
			if (window.coTShared !== undefined && window.coTShared.meeting !== undefined) {
				window.coTShared.NewMeeting.RoomID = window.coTShared.meeting.roomId;
				this.newMeeting.RoomID = window.coTShared.meeting.roomId;
				this.fillRoomInfo(this.newMeeting.RoomID);
			}

			this.loadMeeting();
		},

		getFormattedDate: function(date) {
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : '0' + day;
			return month + '/' + day + '/' + year;
		},

		initMeeting: function() {
			var date = new Date();
			var dt = this.getFormattedDate(date);
			var organizer = window.coTRooms.Organizer;
			window.coTShared.meeting = {};
			window.coTShared.meeting.attendees = [];

			this.newMeeting = {
				"MeetingSubject": "",
				"Date": dt,
				"Start": "",
				"End": "",
				"RoomID": "",
				"AltID": "",
				"MeetingComment": "",
				"Organizer": organizer,
				"Attendees": [],
				"CallNumber": "",
				"Location": "",
				"Image": "",
				"Path2Room": ""
			};

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

		toDate: function(date, time) {
			var d = date.split("/");
			var t = time.split(":");
			var am = t[1].split(" ");
			var year = parseInt("20" + d[2]);
			var month = parseInt(d[0]) - 1;
			var day = parseInt(d[1]);
			var hr = parseInt(t[0]);
			if (am[1] === 'PM') {
				hr = hr + 12;
			}
			var min = parseInt(t[1]);
			var date = new Date(year, month, day, hr, min, 0, 0);
			return date;
		},

		postMeeting: function(newMeeting) {

			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/appointments/";

			var headers = {
				"Content-Type": "application/json"
			};

			var start = this.toDate(newMeeting.Date, newMeeting.Start).getTime();
			var end = this.toDate(newMeeting.Date, newMeeting.End).getTime();

			var startD = "\/Date(" + start.toString() + ")\/";
			var endD = "\/Date(" + end.toString() + ")\/";

			var attendees = "George Liu, Yuri Natchetoi";
			var organizer = window.coTRooms.Organizer;
			newMeeting.AltId = "String content12345";

			var payload = JSON.stringify({

				"AltID": newMeeting.AltId,
				"MeetingSubject": newMeeting.MeetingSubject,
				"MeetingComment": newMeeting.MeetingComment,
				"RoomID": newMeeting.RoomID,
				"End": endD,
				"Start": startD,
				"TimeZoneId": "Eastern Daylight Time",
				"Attendees": attendees,
				"Organizer": organizer
			});

			if (window.coTShared.on) {
				var aData = jQuery.ajax({
					url: url,
					type: "POST",
					headers: headers,
					data: payload,
					processData: false,
					//				dataType: "text",
					contentType: "application/json",
					async: false,
					crossDomain: true,
					success: function(data, textStatus) { // callback called when data is 
						//					alert('data=' + data);
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show("Meeting created" + data.responseText);

					},
					error: function(data, textStatus) {
						sap.m.MessageBox.show("Error occured" + data.responseText + textStatus);
					}
				});
			}

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

		showError: function(msg) {
			sap.m.MessageToast.show("Error: " + msg, {
				duration: "2000",
				width: "15em",
				my: "center top",
				at: "center top",
				offset: "0 0",
				iNumber: 2,
				autoClose: true
			});
		},

		validate: function() {
			var result = true;
			var attendees = window.coTShared.meeting.attendees;

			if (this.newMeeting.RoomID === "") {
				this.showError("Need a location");
			}
			if (attendees.length === 0) {
				this.showError("Meeting should have attendees");
				result = false;
			}
			if (this.newMeeting.Start === undefined || this.newMeeting.Start === "") {
				this.showError("Start time is empty");
				result = false;
			}
			if (this.newMeeting.End === undefined || this.newMeeting.End === "") {
				this.showError("Start time is empty");
				result = false;
			}
			if (result) {
				var start = this.toDate(this.newMeeting.Date, this.newMeeting.Start).getTime();
				var end = this.toDate(this.newMeeting.Date, this.newMeeting.End).getTime();
				if (end <= start) {
					this.showError("End time should be after Start time");
					result = false;
				}
			}
			return result;
		},
		fillRoomInfo: function(roomId) {
			var roomsModel = this.getView().getModel("all_rooms");
			var room = Enumerable.From(roomsModel.getData())
				.Where(function(x) {
					return x.RoomID === roomId;
				})
				.FirstOrDefault();
			if (room !== undefined) {
				this.newMeeting.Location = room.RoomName;
				this.newMeeting.Image = room.Image;
				this.newMeeting.Path2Room = room.Path2Room;
			}
		},
		saveMeeting: function() {
			if (this.validate()) {
				this.preSaveMeeting();
				var meetingsModel = sap.ui.getCore().getModel("all_meetings");
				var data = meetingsModel.getData();
				this.newMeeting.AltID = (data.length + 1).toString();
				data.push(this.newMeeting);
				meetingsModel.setData(data);

				if (window.coTShared.on) {
					this.postMeeting(this.newMeeting);
				}

				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("main", true);
			}
		}

	});

});