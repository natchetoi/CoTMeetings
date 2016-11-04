sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	return Controller.extend("fusion.controller.Detail", {

		/**
		 * Called when the detail list controller is instantiated. 
		 */
		onInit: function() {
			// this.oInitialLoadFinishedDeferred = jQuery.Deferred();

			// if (sap.ui.Device.system.phone) {
			// 	//don't wait for the master on a phone
			// 	this.oInitialLoadFinishedDeferred.resolve();
			// } else {
			// 	this.getView().setBusy(true);
			// 	this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
			// }

			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
		},

		/**
		 * Master InitialLoadFinished event handler
		 * @param{String} sChanel event channel name
		 * @param{String}} sEvent event name
		 * @param{Object}} oData event data object
		 */
		onMasterLoaded: function(sChannel, sEvent, oData) {
			if (oData.oListItem) {
				this.bindView(oData.oListItem.getBindingContext().getPath());
				this.getView().setBusy(false);
				this.oInitialLoadFinishedDeferred.resolve();
			}
		},

		/**
		 * Detail view RoutePatternMatched event handler 
		 * @param{sap.ui.base.Event} oEvent router pattern matched event object
		 */
		onRouteMatched: function(oEvent) {
			var meetId = oEvent.getParameter("arguments").entity;
			this.loadMeet(meetId);

			this.byId("idIconTabBar").setSelectedKey("tabDetails");
		},

		loadMeet: function(meetId) {
			var meetModel = sap.ui.getCore().getModel("all_meetings");
			var meet = Enumerable
				.From(meetModel.getData())
				.Where(function(x) {
					return x.AltID === meetId;
				})
				.FirstOrDefault();
			if (meet !== undefined) {
				var model = new sap.ui.model.json.JSONModel();
				model.setData(meet);
				this.getView().setModel(model);
			}
		},

		getRoomName: function(roomId) {
			var roomsModel = this.getView().getModel("all_rooms");
			var room = Enumerable
				.From(roomsModel.getData())
				.Where(function(x) {
					return x.RoomID === roomId;
				})
				.FirstOrDefault();

			return room !== undefined ? room.RoomName : "-";
		},

		getRoomImage: function(roomId) {
			var roomsModel = this.getView().getModel("all_rooms");
			var room = Enumerable
				.From(roomsModel.getData())
				.Where(function(x) {
					return x.RoomID === roomId;
				})
				.FirstOrDefault();

			return room !== undefined ? room.Image : "-";
		},

		getRoomPath: function(roomId) {
			var roomsModel = this.getView().getModel("all_rooms");
			var room = Enumerable
				.From(roomsModel.getData())
				.Where(function(x) {
					return x.RoomID === roomId;
				})
				.FirstOrDefault();

			return room !== undefined ? room.Path2Room : "-";
		},

		/**
		 * Binds the view to the object path.
		 * @param {string} sEntityPath path to the entity
		 */
		bindView: function(sEntityPath) {
			var oView = this.getView();
			oView.bindElement(sEntityPath);

			var frag = this.byId("detailFragment");
			frag.bindElement(sEntityPath + "/API_Room");

			//Check if the data is already on the client
			if (!oView.getModel().getData(sEntityPath)) {

				// Check that the entity specified actually was found.
				oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = oView.getModel().getData(sEntityPath);
					if (!oData) {
						this.showEmptyView();
						this.fireDetailNotFound();
					} else {
						this.fireDetailChanged(sEntityPath);
					}
				}, this));

			} else {
				this.fireDetailChanged(sEntityPath);
			}

		},

		/**
		 * display NotFound view
		 */
		showEmptyView: function() {
			this.getRouter().myNavToWithoutHash({
				currentView: this.getView(),
				targetViewName: "fusion.view.NotFound",
				targetViewType: "XML"
			});
		},

		/**
		 * publish Detail Changed event
		 */
		fireDetailChanged: function(sEntityPath) {
			this.getEventBus().publish("Detail", "Changed", {
				sEntityPath: sEntityPath
			});
		},

		/**
		 * publish Detail NotFound event
		 */
		fireDetailNotFound: function() {
			this.getEventBus().publish("Detail", "NotFound");
		},

		/**
		 * Navigates back to main view
		 */
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("main", true);
			}
		},

		/**
		 * Detail view icon tab bar select event handler
		 */
		onDetailSelect: function(oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
				entity: oEvent.getSource().getBindingContext().getPath().slice(1),
				tab: oEvent.getParameter("selectedKey")
			}, true);
		},
		//-----------------------------------------------------------------------------

		addMeeting: function(oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("NewMeeting", {}, true);

			//		sap.ui.core.UIComponent.getRouterFor(this).navTo("loginview", {
			//			entity: oEvent.getSource().getBindingContext().getPath().slice(1),
			//			tab: oEvent.getParameter("selectedKey")
			//		}, true);
		}

	});
});