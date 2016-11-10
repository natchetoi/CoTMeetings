sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("fusion.controller.Scheduler", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.Scheduler
		 */
		onInit: function() {
			var router = this.getRouter();
			router.getRoute("NewMeeting").attachPatternMatched(this._onObjectMatched, this);
	
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.Scheduler
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.Scheduler
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.Scheduler
		 */
		//	onExit: function() {
		//
		//	}
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		_onObjectMatched: function(oEvent) {
			var list = oEvent.getParameter("listItem");

		},


		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("NewMeeting", {
					"empty" : false
				}, true /*no history*/);
			}
		},
		
		pickTime: function(oEvent) {
			var src = oEvent.getSource();
			var pickedTime = "9am";
			var scheduler = this;
			window.coTShared.startTime = pickedTime;
					sap.m.MessageToast.show("Meeting Time Selected: " + pickedTime, {
						duration: "3000",
						width: "15em",
						my: "center top",
						at: "center top",
						offset: "0 0",
						autoClose: true,
						onClose: function() {
							sap.m.MessageToast.show("Back to the Meeting", {
								width: "100%",
								my: "center top",
								at: "center top"
							});
							scheduler.onNavBack(oEvent);
/*							var router = sap.ui.core.UIComponent.getRouterFor(this);
							if(router !== undefined) {
								router.navTo("NewMeeting", { 
									"empty" : false
								}, true);
							}
*/							
						}
					});

				}

	});

});