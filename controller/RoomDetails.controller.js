sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("fusion.controller.RoomDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.RoomDetails
		 */
		 onInit: function() {
			this.oInitialLoadFinishedDeferred = jQuery.Deferred();

			if (sap.ui.Device.system.phone) {
			//don't wait for the master on a phone
				this.oInitialLoadFinishedDeferred.resolve();
			} else {
				this.getView().setBusy(true);
				this.getEventBus().subscribe("FindRoom", "InitialLoadFinished", this.onMasterLoaded, this);
			}

			this.getRouter().attachRouteMatched(this.onRouteMatched, this);		 	
//			this._oRouter =sap.ui.core.UIComponent.getRouterFor(this);
//			this._oRouter.getRoute("RoomDetails").attachPatternMatched(this._onDetailMatched, this);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.RoomDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.RoomDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.RoomDetails
		 */
		//	onExit: function() {
		//
		//	}
//-----------------------------------------------------------------------------------------------
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
	
	_onObjectMatched: function(oEvent) {
			this.getView().bindElement({
				path: "rooms>/3/" + oEvent.getParameter("arguments").room + "/",          
				model: "rooms"
			});	
	},
	
	_onDetailMatched: function(oEvent) {
		var sObjectPath="room>/" +oEvent.getParameter("arguments").room;
		var oView=this.getView();
		oView.bindElement(sObjectPath);
	},
	
	/**
	 * Detail view RoutePatternMatched event handler 
	 * @param{sap.ui.base.Event} oEvent router pattern matched event object
	 */
	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
			var oView = this.getView();
			if (oParameters.name === "RoomDetails") {
				var roomID = oParameters.arguments.room;
				if(roomID !== undefined) {
					var oRoomModel = new sap.ui.model.json.JSONModel();
					var room = window.coTRooms[roomID];
					oRoomModel.setData( room );
					this.getView().setModel(oRoomModel);
// 				sap.ui.getCore().setModel(oRoomModel, "room");
//					this.bindView( "room>/" );	
				}
				return;
			}

			var sEntityPath = "rooms>/" + oEvent.getParameter("arguments").room + "/";
			this.bindView(sEntityPath);			

		}, this));

	},

	/**
	 * Binds the view to the object path.
	 * @param {string} sEntityPath path to the entity
	 */
	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

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

 		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		getMeeting: function () {
			var view = this.getView();
			var oModel = view.getModel("new");
			var meeting = oModel.getData();
			return meeting;
		},
		
		onNavBack: function (oEvent) {
			// var oHistory, sPreviousHash;
			// oHistory = History.getInstance();
			// sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
        		var router = this.getRouter();
        		router.navTo("FindRoom", {}, true );
			//}
		},
		bookRoom: function (oEvent) {
			// var oHistory, sPreviousHash;
			// oHistory = History.getInstance();
			// sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
        		this.onNavBack(oEvent);
			//}
		}
        


	});

});