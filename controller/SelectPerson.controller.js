sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/ui/model/Filter'
], function(Controller, History, Filter) {
	"use strict";

	return Controller.extend("fusion.controller.SelectPerson", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.SelectPerson
		 */
		onInit: function() {

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.SelectPerson
		 */
		onBeforeRendering: function() {
			this.loadPeople();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.SelectPerson
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.SelectPerson
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

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		addAttendees: function() {
			var oList = this.byId("listAttendees");
			var selectedItems = oList.getSelectedItems();

			if (window.coTShared === undefined) {
				window.coTShared = {};
			}
			if (window.coTShared.meeting === undefined) {
				window.coTShared.meeting = {};
			}
			window.coTShared.meeting.attendees = [];
			for (var i = 0; i < selectedItems.length; i++) {
				var selectedPerson = selectedItems[i].getBindingContext("people").getObject();
				window.coTShared.meeting.attendees.push({
					"name": selectedPerson.firstName + " " + selectedPerson.lastName
				});
			}
			
			var empty = false;

			this.getRouter().navTo("NewMeeting", {
				"empty" : empty
			}, true);
		},

		onNavBack: function(oEvent) {
			// var oHistory, sPreviousHash;
			// oHistory = History.getInstance();
			// sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
			this.getRouter().navTo("NewMeeting", {
					"empty" : false
			}, true);
			//}
		},

		loadPeople: function() {
			var peopleModel = this.getView().getModel("all_people");
			var sortedPeople = Enumerable
				.From(peopleModel.getData())
				.OrderBy("x => x.firstName")
				.ThenBy("x => x.lastName")
				.ToArray();

			var model = new sap.ui.model.json.JSONModel();
			model.setData(sortedPeople);
			this.getView().setModel(model, "people");
		},

		onSearch: function(oEvt) {
			var sQuery = oEvt.getSource().getValue();
			var list = this.getView().byId("listAttendees");
			var binding = list.getBinding("items");

			binding.filter(new sap.ui.model.Filter([
				new sap.ui.model.Filter("firstName", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, sQuery)
			], false));
		}
	});

});