sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("fusion.controller.RoomDetails", {

        model: {},
        meetId: "",
        room: {},
        navigateBack: "",

        meetingStartDateFormat: "MMM dd HH:mm",

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf fusion.view.RoomDetails
         */
        onInit: function () {
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
        onAfterRendering: function () {
            //this.set3dModel();
        },

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
        onMasterLoaded: function (sChannel, sEvent, oData) {
            if (oData.oListItem) {
                this.bindView(oData.oListItem.getBindingContext().getPath());
                this.getView().setBusy(false);
                this.oInitialLoadFinishedDeferred.resolve();
            }
        },

        set3dModel: function () {
            //				var iframe = this.getView().byId("floor");
            var src = this.room.Path3D;
            src = src + ".html";
            this.room.iFrame = '<iframe id="floor" src="' + src + '" width="100%" height="530px" class="coTMapIframe" />';
            this.byId("map3d").setDOMContent(this.room.iFrame);
//            var floorId = sap.ui.getCore().byId("floor");
//            var floor = jQuery( floorId );
//            floor.attr("src", src);

//            var floor = $("#__xmlview6--floor");
//            floor.attr("src", src);
        },

        _onDetailMatched: function (oEvent) {
            var sObjectPath = "room>/" + oEvent.getParameter("arguments").room;
            var oView = this.getView();
            oView.bindElement(sObjectPath);
        },

        /**
         * Detail view RoutePatternMatched event handler
         * @param{sap.ui.base.Event} oEvent router pattern matched event object
         */
        onRouteMatched: function (oEvent) {
            var oParameters = oEvent.getParameters();

            jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function () {
                var oView = this.getView();
                if (oParameters.name === "RoomDetails") {
                    var roomID = oParameters.arguments.room;
                    if (roomID !== undefined) {
                        this.model = new sap.ui.model.json.JSONModel();
                        this.room = window.coTRooms[roomID];
                        this.meetId = oParameters.arguments.entity;
                        this.set3dModel();
                        this.model.setData(this.room);
                        oView.setModel(this.model, "room");
                        sap.ui.getCore().setModel(this.model, "room");
                        //this.bindView(this.model);

                        var appointments = this.room.Appointments;
                        var appmodel = new sap.ui.model.json.JSONModel();
                        appmodel.setData(appointments);
                        sap.ui.getCore().setModel(appmodel, "appointments");

                        this.navigateBack = oEvent.getParameter("arguments").back;
                    }
                    return;
                }

//			var sEntityPath = "rooms>/" + oEvent.getParameter("arguments").room + "/";
//			this.bindView(sEntityPath);			

            }, this));

        },

        /**
         * Binds the view to the object path.
         * @param {string} sEntityPath path to the entity
         */
        bindView: function (oRoomModel) {
            var oView = this.getView();
            oView.setModel(oRoomModel);

            //Check if the data is already on the client
            if (!oView.getModel().getData()) {

                // Check that the entity specified actually was found.
                oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function () {
                    var oData = oRoomModel.getData();
                    if (!oData) {
                        this.showEmptyView();
                        this.fireDetailNotFound();
                    } else {
//					this.fireDetailChanged(sEntityPath);
                    }
                }, this));

            } else {
//			this.fireDetailChanged(sEntityPath);
            }
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
            router.navTo(this.navigateBack, {"entity": this.meetId}, true);
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
        },

        formatStart: function (oDate) {
            var date = new Date(+oDate.replace(/\/Date\((\d+)\)\//, '$1'));
            return date.toString(this.meetingStartDateFormat);
        }
    });

});