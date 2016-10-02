
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (Controller, History, MessageToast, Filter, FilterOperator
//, formatter
){

	"use strict";

	return Controller.extend("fusion.controller.FindRoom", {
//        formatter : formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.FindRoom
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.FindRoom
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.FindRoom
		 */
			onAfterRendering: function() {
				var cell11 = this.byId("c11");
//				cell11.addStyleClass("background-color","blue");

				var oMap = this.createImageMap();
				 this.pressExpand();
				 
		    },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.FindRoom
		 */
		//	onExit: function() {
		//
		//	}
//---------------------------------------------------
    form: function() {

	var me = {
		delivery: function(sMeasure, iWeight) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
				sResult = "";

			if(sMeasure === "G") {
				iWeight = iWeight / 1000;
			}
			if (iWeight < 0.5) {
				sResult = oResourceBundle.getText("formatterMailDelivery");
			} else if (iWeight < 5) {
				sResult = oResourceBundle.getText("formatterParcelDelivery");
			} else {
				sResult = oResourceBundle.getText("formatterCarrierDelivery");
			}

			return sResult;
		},
		
	  formatMapUrl:	function (sName, sStreet, sNumber, sZip, sCity, sCountry) {
	  	var sResult1 = "";
		sResult1 = "http://maps.googleapis.com/maps/api/staticmap?center=" + sCity +",+" + sCountry 
		+ "&zoom=13&scale=false&size=600x300&maptype=roadmap&key=AIzaSyCqifMn0_bk8Vp_QXyfRSiS7GJcvhRwdm4&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C"
		+ sName + "+" + sNumber + "+" + sStreet + "+" + sZip + "+" + sCity + "+" + sCountry;
		return sResult1;
	    }		
	};
	return me;
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
        		router.navTo("NewMeeting", {}, true );
			//}
		},
        
        bookRoom: function(oEvent) {
        	var roomName = "Adelaide"; //  oEvent.
        	var meeting = {};
        	try {
        		meeting = this.getMeeting();
        		meeting.setProperty("RoomName", roomName);
        	} catch(err) {
        		roomName = "Adelaide"; 
        	}
        	var router = this.getRouter();
        	router.navTo("NewMeeting", {}, true );
        },
               
        changeCapacity: function() {
       	 var slider1 = this.byId("capacitySliderId");
         var text1   = this.byId("capacityTextId");
       	
       	 if(slider1 !== undefined) {
       		var value1 = slider1.getValue();
       		var t = value1 + " pers";
       		text1.setText(t);
       	 }
       },
       
       changeProximity : function() {
       	 var slider2 = this.byId("proximitySliderId");
         var text2   = this.byId("proximityTextId");
       	
       	 if(slider2 !== undefined) {
       		var value2 = slider2.getValue();
       		var t = value2 + " m";
       		text2.setText(t);
       	 }
       },
       
       createImageMap: function() {
/*       	var oMap = new sap.ui.commons.ImageMap();
		oMap.setName("Map1");
		var aArea1 = new sap.ui.commons.Area ("Area1", {shape: "rect", alt: "Adelaide", href: "http://www.sap.com", coords: "40,20,100,80"});
		var aArea2 = new sap.ui.commons.Area ("Area2", {shape: "circle", alt: "Jarvis", href: "http://www.sap.com", coords: "170,60,30"});
		oMap.addArea(aArea1);
		oMap.addArea(aArea2);
		oMap.placeAt("__filter5");
		return oMap; */
       },
       
       pressCollapse: function() {
       	   var foomFilter = this.byId("RoomFilterId");
       	   if(foomFilter.getVisible()) {
               foomFilter.setVisible(false);
               var expandButton = this.byId("expandButton");
               expandButton.setVisible(true);
               var collapseButton = this.byId("collapseButton");
               collapseButton.setVisible(false);
    	   }
       	  
       },
       
       pressExpand: function() {
       	   var foomFilter = this.byId("RoomFilterId");
            if(!foomFilter.getVisible()) {
               foomFilter.setVisible(true);
               var expandButton = this.byId("expandButton");
               expandButton.setVisible(false);
               var collapseButton = this.byId("collapseButton");
               collapseButton.setVisible(true);               
    	   }
       },
       
       	nav3DFloorPlan: function (oEvent) {
			// var oHistory, sPreviousHash;
			// oHistory = History.getInstance();
			// sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
        		var router = this.getRouter();
        		router.navTo("FloorPlan3d", {}, true );
			//}
		},		

       pressRoom11: function(oEvent) {
        		var router = this.getRouter();
				var oItem = oEvent.getSource();
//				var room = oItem.getBindingContext().getPath().substr(1);
//				var roomName = oItem.getBindingContext().getProperty("RoomName");
				var roomId = "1";
				window.coTShared.att = "Jarvis";
        		router.navTo("RoomDetails", { 
        			"room" :  roomId, 
        			"RoomName" : window.coTShared.att
        		}, true );
       },
       pressRoom12: function(oEvent) {
        		var router = this.getRouter();
        		var roomId = "2";
				window.coTShared.att = "Adelaide";
        		router.navTo("RoomDetails", { 
        			"room" :  roomId, 
        			"RoomName" : window.coTShared.att
        		}, true );
       },
       pressRoom21: function(oEvent) {
        		var router = this.getRouter();
        		var roomId = "3";
				window.coTShared.att = "Berkeley";
        		router.navTo("RoomDetails", { 
        			"room" :  roomId, 
        			"RoomName" : window.coTShared.att
        		}, true );
       },
       pressRoom22: function(oEvent) {
        		var router = this.getRouter();
        		var roomId = "4";
				window.coTShared.att = "Duncan";
        		router.navTo("RoomDetails", { 
        			"room" :  roomId, 
        			"RoomName" : window.coTShared.att
        		}, true );
       }
       
       
       
	});

});