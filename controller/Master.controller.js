// jQuery.sap.require("fusion.util.Formatter");
// jQuery.sap.require("fusion.util.Controller");

sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("fusion.controller.Master", {
		onInit: function() {
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
		},

		onAfterRendering: function() {

		},

		/**
		 * Master view RoutePatternMatched event handler 
		 * @param{sap.ui.base.Event} oEvent router pattern matched event object
		 */
		onRouteMatched: function(oEvent) {
			// var sName = oEvent.getParameter("name");

			// if (sName !== "main") {
			// 	return;
			// }

			// //Load the detail view in desktop
			// sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			// 	currentView: this.getView(),
			// 	targetViewName: "fusion.view.Detail",
			// 	targetViewType: "XML"
			// });

			// //Wait for the list to be loaded once
			// this.waitForInitialListLoading(function() {

			// 	//On the empty hash select the first item
			// 	this.selectFirstItem();

			// });
			this.loadMeetings();
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
			var meetModel = this.getView().getModel("all_meetings");

			var currentDate = Date.today().add(-20).days();
			var pendingMeetings = Enumerable
				.From(meetModel.getData())
				.Where(function(x) {
					return Date.parse(x.Date).compareTo(currentDate) >= 0;
				})
				.OrderBy(function(x) {
					return Date.parse(x.Date + " " + x.Start);
				});

			var pendingMeetingsPairsCount = Math.ceil(pendingMeetings.ToArray().length / 2);

			var pendingMeetingsPairs = [];
			for (var i = 0; i < pendingMeetingsPairsCount; i++) {
				var pair = {
					"0": pendingMeetings.ElementAtOrDefault(i * 2),
					"1": pendingMeetings.ElementAtOrDefault(i * 2 + 1),
					"css1": i % 2 === 0 ? "coTBlueSquare" : "coTWhiteSquare",
					"css2": i % 2 !== 0 ? "coTWhiteSquare" : "coTBlueSquare"
				};
				pendingMeetingsPairs[i] = pair;
			}

			var model = new sap.ui.model.json.JSONModel();
			model.setData({
				rows: pendingMeetingsPairs,
				rowsCount: pendingMeetingsPairsCount
			});
			this.getView().setModel(model);
		},

		buildDate: function(oTime, oDate) {
			var result = new Date(Date.parse(oDate + " " + oTime));
			return result;
		},

		onMeetingSelected: function(oEvent) {
			var selectedMeet = oEvent.getSource().getBindingContext("meetings").getObject();
			var id = selectedMeet.AltID;
			this.navigateToMeetingView(id);
		},

		onAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment").getBindingContext().getObject();
			var id = oAppointment.AltID;
			this.navigateToMeetingView(id);
		},

		onMeetingCellSelected: function(oEvent) {
			var selectedRow = oEvent.getParameters().rowBindingContext.getObject();
			var selectedMeet = selectedRow[oEvent.getParameters().columnIndex];
			var id = selectedMeet.AltID;
			this.navigateToMeetingView(id);
		},

		navigateToMeetingView: function(id) {
			var bReplace = jQuery.device.is.phone ? false : true;
			var path = id;

			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("detail", {
				from: "master",
				entity: path
			}, bReplace);
		}
	});
});