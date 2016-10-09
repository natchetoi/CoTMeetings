sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("fusion.controller.Calendar", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.Calendar
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.Calendar
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.Calendar
		 */
		onAfterRendering: function() {
			this.loadMeetings();
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.Calendar
		 */
		//	onExit: function() {
		//
		//	}

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function(oEvent) {
			// var oHistory, sPreviousHash;
			// oHistory = History.getInstance();
			// sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
			this.getRouter().navTo("NewMeeting", {}, true);
			// }
		},

		drillDown: function(oEvent) {
			this.getRouter().navTo("Detail", {
				ID: "1"
			}, true);
		},

		onSelectedDateChanged: function(oEvent) {
			var selectedDate = oEvent.getParameter("value");
			this.showDayliMeetings(new Date(selectedDate));
		},

		loadMeetings: function() {
			var myMeetings = this.getMyMeetings();
			var calendarModel = new sap.ui.model.json.JSONModel();
			calendarModel.setData({
				today: (new Date()).toLocaleDateString(),
				meetings: myMeetings,
				people: [{
					name: "Me",
					appointments: myMeetings,
					headers: myMeetings
				}]
			});

			this.getView().setModel(calendarModel);

			var date = new Date(2016, 9, 5);
			date.setHours(0, 0, 0, 0);
			this.showDayliMeetings(date);
		},

		onMeetingSelected: function(oEvent) {
			var bindingContext = oEvent.getSource().getBindingContext();
			if (bindingContext === undefined) {
				bindingContext = oEvent.getSource().getBindingContext("dayMeetings");
			}
			var selectedMeet = bindingContext.getObject();
			var id = selectedMeet.AltID;
			this.navigateToMeetingView(id);
		},

		navigateToMeetingView: function(id) {
			var bReplace = jQuery.device.is.phone ? false : true;
			var path = "AppointmentSet('" + id + "')";

			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("detail", {
				from: "master",
				entity: path
			}, bReplace);
		},

		showDayliMeetings: function(date) {
			var myMeetings = this.getMyMeetings();

			var dateMeetings = Enumerable
				.From(myMeetings)
				.Where(function(x) {
					var d1 = new Date(x.Date);
					return d1.getFullYear() === date.getFullYear() && d1.getMonth() === date.getMonth() && d1.getDate() === date.getDate();
				})
				.ToArray();

			var dayModel = new sap.ui.model.json.JSONModel();
			var daysData = Enumerable
				.RangeTo(7, 23, 1)
				.Select(function(x) {
					var result = date;
					result.setHours(x, 0, 0);
					return {
						"Date": result.toLocaleDateString(),
						"Start": result.toLocaleTimeString()
					};
				})
				.Union(dateMeetings)
				.OrderBy(function(x) {
					return new Date(Date.parse(x.Date + " " + x.Start));
				})
				.ToArray();
			dayModel.setData(daysData);
			this.getView().setModel(dayModel, "dayMeetings");
		},

		getMyMeetings: function() {
			var meetModel = this.getView().getModel("all_meetings");

			var myMeetings = Enumerable.From(meetModel.getData())
				.Where(function(x) {
					return x.Organizer === "Yuri" || Enumerable.From(x.Attendees).Any(function(y) {
						return y.Name === "Yuri";
					});
				})
				.OrderBy(function(x) {
					return new Date(Date.parse(x.Date + " " + x.Start));
				})
				.ToArray();

			return myMeetings;
		}

	});

});