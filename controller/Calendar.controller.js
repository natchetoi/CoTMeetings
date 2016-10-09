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

		loadMeetings: function() {
			var meetModel = this.getView().getModel("all_meetings");

			var longList = Enumerable.From(meetModel.getData())
				.Where(function(x) {
					return x.Organizer === "Yuri" || Enumerable.From(x.Attendees).Any(function(y){return y.Name === "Yuri";});
				})
				.ToArray();

			var calendarModel = new sap.ui.model.json.JSONModel();
			calendarModel.setData({
				startDate: new Date("2016", "10", "1"),
				meetings: longList,
				people: [{
					name: "Me",
					appointments: longList,
					headers: longList
				}]
			});

			this.getView().setModel(calendarModel);
		}

	});

});