sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function (Controller, History, MessageToast, Filter, FilterOperator
             //, formatter
) {
    "use strict";

    return Controller.extend("fusion.controller.FindRoom", {
        //        formatter : formatter,

        FilterConfig: {
            distance: 500,
            capacity: 1,
            equipment: false,
            wifi: false,
            projector: false,
            computer: false
        },

        selectedRoom: {
            RoomID: "",
        },

        _onObjectMatched: function () {
            this.byId("findRoomTabBar").setSelectedKey("findFIlter");
            this.selectRoom(window.coTShared.NewMeeting.RoomID);
        },
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf fusion.view.FindRoom
         */
        onInit: function () {
            var router = this.getRouter();
            router.getRoute("FindRoom").attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf fusion.view.FindRoom
         */
        //	onBeforeRendering: function() {
        //
        //	},

        selectRoom: function (roomId) {
            var filteredList = this.byId("listFilteredRooms");
            if (roomId === undefined || roomId === "") {
                filteredList.removeSelections(true);
            }
            else {
                var items = filteredList.getItems();
                for (var i = 0; i < items.length; i++) {
                    var room = items[i].getBindingContext("rooms").getObject();
                    if (room.RoomID === roomId) {
                        filteredList.setSelectedItem(items[i], true);

                        this.byId("_listFavorites").removeSelections(true);
                        return;
                    }
                }

                //if no items selected then clear previous selection
                filteredList.removeSelections(true);
            }
        },
        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf fusion.view.FindRoom
         */

        onAfterRendering: function () {
            this.createImageMap();
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
        form: function () {

            var me = {
                delivery: function (sMeasure, iWeight) {
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
                        sResult = "";

                    if (sMeasure === "G") {
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

                formatMapUrl: function (sName, sStreet, sNumber, sZip, sCity, sCountry) {
                    var sResult1 = "";
                    sResult1 = "http://maps.googleapis.com/maps/api/staticmap?center=" + sCity + ",+" + sCountry +
                        "&zoom=13&scale=false&size=600x300&maptype=roadmap&key=AIzaSyCqifMn0_bk8Vp_QXyfRSiS7GJcvhRwdm4&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C" +
                        sName + "+" + sNumber + "+" + sStreet + "+" + sZip + "+" + sCity + "+" + sCountry;
                    return sResult1;
                }
            };
            return me;
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        getMeeting: function () {
            var view = this.getView();
            var oModel = view.getModel("new");
            var meeting = oModel.getData();
            return meeting;
        },

        onNavBack: function (oEvent) {
            var router = this.getRouter();
            var empty = false;
            router.navTo("NewMeeting", {
                "empty": empty
            }, true);
        },

        bookRoom: function (oEvent) {
            window.coTShared.NewMeeting.RoomID = this.selectedRoom.RoomID;

            var router = this.getRouter();
            router.navTo("NewMeeting", {
                "empty": false
            }, true);
        },

        changeCapacity: function () {
            var sliderCapacity = this.byId("capacitySliderId");
            var lblCapacity = this.byId("capacityTextId");

            if (sliderCapacity !== undefined) {
                var capacity = sliderCapacity.getValue();
                var t = capacity + " pers";
                lblCapacity.setText(t);
            }
        },

        onCapacityChanged: function () {
            var sliderCapacity = this.byId("capacitySliderId");

            if (sliderCapacity !== undefined) {
                var capacity = sliderCapacity.getValue();
                this.FilterConfig.capacity = capacity;
                this.findRooms();
            }
        },

        changeProximity: function () {
            var sliderDistance = this.byId("proximitySliderId");
            var lblDistance = this.byId("proximityTextId");

            if (sliderDistance !== undefined) {
                var dist = sliderDistance.getValue();
                var t = dist + " m";
                lblDistance.setText(t);

                this.FilterConfig.distance = dist;
            }
        },

        onProximityChanged: function () {
            var sliderDistance = this.byId("proximitySliderId");

            if (sliderDistance !== undefined) {
                var dist = sliderDistance.getValue();
                this.FilterConfig.distance = dist;
                this.findRooms();
            }
        },

        onConfEquipmentSelected: function (oControlEvent) {
            var chkConfEquipment = this.byId("chkConfEquipment");
            if (chkConfEquipment !== undefined) {
                this.FilterConfig.equipment = chkConfEquipment.getSelected();
                this.findRooms();
            }
        },

        onWifiSelected: function (oControlEvent) {
            var chkWifi = this.byId("chkBoxWifi");
            if (chkWifi !== undefined) {
                this.FilterConfig.wifi = chkWifi.getSelected();
                this.findRooms();
            }
        },

        onProjectorSelected: function (oControlEvent) {
            var chkProjector = this.byId("chkBoxProject");
            if (chkProjector !== undefined) {
                this.FilterConfig.projector = chkProjector.getSelected();
                this.findRooms();
            }
        },

        onComputerSelected: function (oControlEvent) {
            var chkComputer = this.byId("chkBoxComputer");
            if (chkComputer !== undefined) {
                this.FilterConfig.computer = chkComputer.getSelected();
                this.findRooms();
            }
        },

        onFavoritesSelectionChanged: function (oControlEvent) {
            var oList = oControlEvent.getSource();
            var selectedRoom = oList.getSelectedItem().getTitle();
            //some hardcoded values:

            if (selectedRoom === "Simcoe") {
                this.selectedRoom.RoomID = "28cb401b-2ddc-4dec-84c4-70e425460e10";
            } else if (selectedRoom === "Adelaide") {
                this.selectedRoom.RoomID = "1a775e79-c1e1-479b-be90-6704d16b48b1";
            } else if (selectedRoom === "Jarvis") {
                this.selectedRoom.RoomID = "ba5d6332-92ac-4324-a62e-fe7164514407";
            }
        },

        onFilteredRoomsSelectionChanged: function (oControlEvent) {
            var oList = oControlEvent.getSource();
            var selectedRoom = oList.getSelectedItem().getBindingContext("rooms").getObject();
            this.selectedRoom.RoomID = selectedRoom.RoomID;
        },

        onQuickFilter: function (oEvent) {
            var sKey = oEvent.getParameter("key"),
                oFilter = this._mFilters[sKey],
                oTable = this.byId("table"),
                oBinding = oTable.getBinding("items");
            if (oFilter) {
                oBinding.filter(oFilter);
            } else {
                oBinding.filter([]);
            }

        },

        required: function (req, has) {
            if (req && !has) {
                return false;
            } else {
                return true;
            }
        },

        findRooms: function () {
            var shortList = [];
            var roomModel = this.getView().getModel("all_rooms");
            var longList = roomModel.getData();

            for (var i = 0; i < longList.length; i++) {
                var room = longList[i];
                var capacity = room.Capacity >= this.FilterConfig.capacity;
                var distance = room.Distance <= this.FilterConfig.distance;
                var equipment = this.required(this.FilterConfig.equipment, room.Conference);
                var wifi = this.required(this.FilterConfig.wifi, room.WiFi);
                var projector = this.required(this.FilterConfig.projector, room.Projector);
                var computer = this.required(this.FilterConfig.computer, room.Computer);

                if (capacity && distance && equipment && wifi && projector && computer) {
                    shortList.push(room);
                }
            }

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(shortList);
            this.getView().setModel(oModel, "rooms");
        },
		
		showRoom: function( oEvent ) {
			var router = this.getRouter();
			var roomID = this.selectedRoom.RoomID;
			if( roomID === undefined ) {
				roomID = "1a775e79-c1e1-479b-be90-6704d16b48b1";   // Adelaide
			}
//			var roomName = this.selectedRoom.RoomName;
			router.navTo("RoomDetails", {
					"room" : roomID
//					"roomName" : roomName
			}, true);
		},

        createImageMap: function () {
            /*       	var oMap = new sap.ui.commons.ImageMap();
             oMap.setName("Map1");
             var aArea1 = new sap.ui.commons.Area ("Area1", {shape: "rect", alt: "Adelaide", href: "http://www.sap.com", coords: "40,20,100,80"});
             var aArea2 = new sap.ui.commons.Area ("Area2", {shape: "circle", alt: "Jarvis", href: "http://www.sap.com", coords: "170,60,30"});
             oMap.addArea(aArea1);
             oMap.addArea(aArea2);
             oMap.placeAt("__filter5");
             return oMap; */
        },

        pressCollapse: function () {
            var foomFilter = this.byId("RoomFilterId");
            if (foomFilter.getVisible()) {
                foomFilter.setVisible(false);

                var expandButton = this.byId("expandButton");
                expandButton.setVisible(true);
                var lblShowFilter = this.byId("lblShowFilter");
                lblShowFilter.setVisible(true);

                var collapseButton = this.byId("collapseButton");
                collapseButton.setVisible(false);
                var lblHideFilter = this.byId("lblHideFilter");
                lblHideFilter.setVisible(false);
            }

        },

        pressExpand: function () {
            var foomFilter = this.byId("RoomFilterId");
            if (!foomFilter.getVisible()) {
                foomFilter.setVisible(true);

                var expandButton = this.byId("expandButton");
                expandButton.setVisible(false);
                var lblShowFilter = this.byId("lblShowFilter");
                lblShowFilter.setVisible(false);

                var collapseButton = this.byId("collapseButton");
                collapseButton.setVisible(true);
                var lblHideFilter = this.byId("lblHideFilter");
                lblHideFilter.setVisible(true);
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
            router.navTo("FloorPlan3d", {}, true);
            //}
        },

	});

});
