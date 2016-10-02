sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("fusion.controller.SelectPerson", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.SelectPerson
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.SelectPerson
		 */
		//	onBeforeRendering: function() {
		//
		//	},

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
		
				
		getMeeting: function () {
			var view = this.getView();
			var oModel = view.getModel("new");
			var meeting = oModel.getData();
			return meeting;
		},
		
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		addAttendees: function() {
			var view = this.getView();
//			var model = view.getModel("att");
			var attendees = [] ; //model.getProperty("/AttendeeSet");
			
			var oModel = view.getModel();
		    var list = "";
			var checks = $("input[type='CheckBox']");
			var n = checks.length - 1;
			for(var i = 0; i<n; i++) {
				var checkBox = checks[i];
				var selected = checkBox.checked;
				var j = i;
				var path = "/AttendeeSet('" + j + "')/";
				var PersonID = oModel.getProperty(path + "PersonID");
				var firstName = oModel.getProperty(path + "firstName");
				var lastName = oModel.getProperty(path + "lastName");
//				var wasSelected = oModel.getProperty(path + "selected");
//					model.setProperty(path, true);
					var guest = {
                		"PersonID" : PersonID,
                		"selected" : selected,
                		"firstName": firstName,
                		"lastName" : lastName
            		};
					if(selected) {
					  attendees.push(guest);
					  if(i > 0) {
					  	list += ",";
					  }	
					  list += PersonID;
					}
			}

			window.coTShared.att =  attendees;    
			
//			model.setData(attendees);
//            this.setModel(model, "att");
			this.getRouter().navTo("NewMeeting", { "list": list }, true );
		},
		
		onNavBack: function (oEvent) {
			// var oHistory, sPreviousHash;
			// oHistory = History.getInstance();
			// sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
				this.getRouter().navTo("NewMeeting", {}, true );
			//}
		}

	});

});