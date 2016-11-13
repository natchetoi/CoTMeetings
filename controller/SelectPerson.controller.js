sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter'
], function (Controller, Filter) {
    "use strict";

    return Controller.extend("fusion.controller.SelectPerson", {

        selectPeople: function (attendees) {
            var peopeList = this.byId("listAttendees");
            if(attendees.length === 0){
                peopeList.removeSelections(true);
            }
        },
        _onObjectMatched: function () {
            this.selectPeople(window.coTShared.NewMeeting.Attendees);
        },
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf fusion.view.SelectPerson
         */
        onInit: function () {
            var router = this.getRouter();
            router.getRoute("SelectPerson").attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf fusion.view.SelectPerson
         */
        onBeforeRendering: function () {
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

        getMeeting: function () {
            var view = this.getView();
            var oModel = view.getModel("new");
            var meeting = oModel.getData();
            return meeting;
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        addAttendees: function () {
            var oList = this.byId("listAttendees");
            var selectedItems = oList.getSelectedItems();

            if (window.coTShared === undefined) {
                window.coTShared = {};
            }
            if (window.coTShared.NewMeeting === undefined) {
                window.coTShared.NewMeeting = {};
            }

            var attendees = [];

            for (var i = 0; i < selectedItems.length; i++) {
                var selectedPerson = selectedItems[i].getBindingContext("people").getObject();
                attendees.push({
                    "name": selectedPerson.firstName + " " + selectedPerson.lastName
                });
            }

            window.coTShared.NewMeeting.attendees = attendees;

            this.getRouter().navTo("NewMeeting", {
                "empty": false
            }, true);
        },

        onNavBack: function (oEvent) {
            this.getRouter().navTo("NewMeeting", {
                "empty": false
            }, true);
        },

        loadPeople: function () {
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

        onSearch: function (oEvt) {
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