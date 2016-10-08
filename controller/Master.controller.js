// jQuery.sap.require("fusion.util.Formatter");
// jQuery.sap.require("fusion.util.Controller");

sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("fusion.controller.Master", {
		/**
		 * Called when the master list controller is instantiated. 
		 * It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 */
		onInit: function() {
			// this.oInitialLoadFinishedDeferred = jQuery.Deferred();

			// this.getView().byId("list").attachEventOnce("updateFinished", function() {
			// 	this.oInitialLoadFinishedDeferred.resolve();
			// 	oEventBus.publish("Master", "InitialLoadFinished", {
			// 		oListItem: this.getView().byId("list").getItems()[0]
			// 	});
			// }, this);

			// var oEventBus = this.getEventBus();
			// oEventBus.subscribe("Detail", "TabChanged", this.onDetailTabChanged, this);

			// //on phones, we will not have to select anything in the list so we don't need to attach to events
			// if (sap.ui.Device.system.phone) {
			// 	return;
			// }

			// this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

			// oEventBus.subscribe("Detail", "Changed", this.onDetailChanged, this);
			// oEventBus.subscribe("Detail", "NotFound", this.onNotFound, this);
		},

		onAfterRendering: function() {
			this.loadMeetings();
		},

		/**
		 * Master view RoutePatternMatched event handler 
		 * @param{sap.ui.base.Event} oEvent router pattern matched event object
		 */
		onRouteMatched: function(oEvent) {
			var sName = oEvent.getParameter("name");

			if (sName !== "main") {
				return;
			}

			//Load the detail view in desktop
			this.getRouter().myNavToWithoutHash({
				currentView: this.getView(),
				targetViewName: "fusion.view.Detail",
				targetViewType: "XML"
			});

			//Wait for the list to be loaded once
			this.waitForInitialListLoading(function() {

				//On the empty hash select the first item
				this.selectFirstItem();

			});

		},

		/**
		 * Detail changed event handler, set selected item
		 * @param{String} sChanel event channel name
		 * @param{String}} sEvent event name
		 * @param{Object}} oData event data object
		 */
		onDetailChanged: function(sChanel, sEvent, oData) {
			var sProductPath = oData.sProductPath;
			//Wait for the list to be loaded once
			this.waitForInitialListLoading(function() {
				var oList = this.getView().byId("list");

				var oSelectedItem = oList.getSelectedItem();
				// the correct item is already selected
				if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sProductPath) {
					return;
				}

				var aItems = oList.getItems();

				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].getBindingContext().getPath() === sProductPath) {
						oList.setSelectedItem(aItems[i], true);
						break;
					}
				}
			});
		},

		/**
		 * Detail TabChanged event handler
		 * @param{String} sChanel event channel name
		 * @param{String}} sEvent event name
		 * @param{Object}} oData event data object
		 */
		onDetailTabChanged: function(sChanel, sEvent, oData) {
			this.sTab = oData.sTabKey;
		},

		/**
		 * wait until this.oInitialLoadFinishedDeferred is resolved, and list view updated
		 * @param{function} fnToExecute the function will be executed if this.oInitialLoadFinishedDeferred is resolved
		 */
		waitForInitialListLoading: function(fnToExecute) {
			jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
		},

		/**
		 * Detail NotFound event handler
		 */
		onNotFound: function() {
			this.getView().byId("list").removeSelections();
		},

		/**
		 * set the first item as selected item
		 */
		selectFirstItem: function() {
			var oList = this.getView().byId("list");
			var aItems = oList.getItems();
			if (aItems.length) {
				oList.setSelectedItem(aItems[0], true);
			}
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 */
		onSearch: function() {
			// add filter for search
			var filters = [];
			var searchString = this.getView().byId("searchField").getValue();
			if (searchString && searchString.length > 0) {
				filters = [new sap.ui.model.Filter("MeetingSubject", sap.ui.model.FilterOperator.Contains, searchString)];
			}

			// update list binding
			this.getView().byId("list").getBinding("items").filter(filters);
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 */
		onSelect: function(oEvent) {
			// Get the list item, either from the listItem parameter or from the event's
			// source itself (will depend on the device-dependent mode).
			var list = oEvent.getParameter("listItem");
			var src = oEvent.getSource();
			this.showDetail(list || src);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 */
		showDetail: function(oItem) {
			// If we're on a phone, include nav in history; if not, don't.
			var bReplace = jQuery.device.is.phone ? false : true;
			this.getRouter().navTo("detail", {
				from: "master",
				entity: oItem.getBindingContext().getPath().substr(1),
				tab: this.sTab
			}, bReplace);
		},

		showMeeting: function(oEvent) {
			//		this.onSelect(oEvent);
			var bReplace = jQuery.device.is.phone ? false : true;

			var id = oEvent.getParameter("id");
			var i = id.substr(id.length - 1, 1);
			var path = "AppointmentSet('" + i + "')";
			//        var oItem = oEvent.getSource();
			//	  	  var ctx = oItem.getBindingContext();
			//        var path = ctx.getPath().substr(1);

			this.getRouter().navTo("detail", {
				from: "master",
				entity: path
			}, bReplace);

		},
		calendar: function() {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Calendar", {}, true);
		},

		addMeeting: function(oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("NewMeeting", {}, true);
		},

		loadMeetings: function() {
			var oModel = new sap.ui.model.json.JSONModel("model/AppointmentSet.json");
			this.getView().setModel(oModel, "meetings");
		},

		onMeetingSelected: function(oEvent) {
			var selectedMeet = oEvent.getSource().getBindingContext("meetings").getObject();
			
			var bReplace = jQuery.device.is.phone ? false : true;

			var id = selectedMeet.AltID;
			var path = "AppointmentSet('" + id + "')";
			
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("detail", {
				from: "master",
				entity: path
			}, bReplace);
		}
	});
});