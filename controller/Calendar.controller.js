sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/ui/unified/DateTypeRange'
], function(Controller, History, DateTypeRange) {
	"use strict";

	return Controller.extend("fusion.controller.Calendar", {

        meetingStartDateFormat: "HH:mm",

		//event handlers
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.Calendar
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.Calendar
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.Calendar
		 */
		onAfterRendering: function() {
			this.loadMeetings();
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.Calendar
		 */
		//	onExit: function() {
		//
		//	}

		drillDown: function(oEvent) {
			this.getRouter().navTo("Detail", {
				ID: "1"
			}, true);
		},

		onSelectedDateChanged: function(oEvent) {
			var selectedDate = oEvent.getParameter("value");
			this.showDailyMeetings(new Date(selectedDate));
		},

		onCalendarSelected: function(oEvent) {
			var oCalendar = oEvent.oSource;
			var startDate = oCalendar.getStartDate();
			this.showWeekMeetings(startDate);
		},

		onMonthCalendarDaySelected: function(oEvent) {
			var selectedDate = oEvent.getSource().getSelectedDates()[0].getStartDate();
			this.showDayMeetings(new Date(selectedDate));
		},

		onMonthCalendarChanged: function(oEvent) {
			var calendar = oEvent.getSource();
			this.showMonthMeetings(calendar.getStartDate());
		},

		onNavBack: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main", true);
		},

		//end of event handlers

		showDayMeetings: function(oDate) {
			var dayMeetings =
				Enumerable.From(this.getMyMeetings())
					.Where(function(x) {
						var d1 = Date.parse(x.Date);
						return d1.equals(oDate);
					})
					.ToArray();
			var selectedMonthDayModel = new sap.ui.model.json.JSONModel();
			selectedMonthDayModel.setData(dayMeetings);
			this.getView().setModel(selectedMonthDayModel, "selectedMonthDay");
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		loadMeetings: function() {
			var myMeetings = this.getMyMeetings();
			var calendarModel = new sap.ui.model.json.JSONModel();
            var date = Date.today();
			calendarModel.setData({
				today: date,
				meetings: myMeetings
			});

			this.getView().setModel(calendarModel);


			this.showDailyMeetings(date);
			this.showWeekMeetings(date);
			this.showMonthMeetings(date);
		},

		onMeetingSelected: function(oEvent) {
			var bindingContext = oEvent.getSource().getBindingContext();
			if (bindingContext === undefined) {
				bindingContext = oEvent.getSource().getBindingContext("dayMeetings");
			}
			var selectedMeet = bindingContext.getObject();
			if(selectedMeet === undefined){
				return;
			}
			var id = selectedMeet.AltID;
			if(id === undefined){
				return;
			}

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
		},

		showDailyMeetings: function(date) {
			var myMeetings = this.getMyMeetings();

			var tommorrow = new Date(date.getTime()).add(1).day();
			var dateMeetings = Enumerable
				.From(myMeetings)
				.Where(function(x) {
					var d1 = new Date(+x.Epoch);
					return d1.between(date, tommorrow);
				})
				.ToArray();

			var dayModel = new sap.ui.model.json.JSONModel();
			var daysData = Enumerable
				.RangeTo(7, 23, 1)
				.Select(function(x) {
					var result = new Date(date.getTime());
					result.setHours(x, 0, 0);
					return {
						"Epoch" : result.getTime().toString()
					};
				})
				.Union(dateMeetings)
				.OrderBy(function(x) {
					return new Date(+x.Epoch);
				})
				.ToArray();
			dayModel.setData(daysData);
			this.getView().setModel(dayModel, "dayMeetings");
		},

		showWeekMeetings: function(date) {
			var weekMeetings =
				Enumerable.From(this.getMyMeetings())
				.Where(function(x) {
					var d1 = Date.parse(x.Date);
					var from = new Date(date);
					var to = new Date(date).add({
						days: 7
					});
					return d1.between(from, to);
				})
				.ToArray();
			var groupedWeekMeetings = Enumerable
				.From(weekMeetings)
				.GroupBy("x => x.Date");
			var maxDsyMeetsCount = 0;
			if (groupedWeekMeetings.Any()) {
				maxDsyMeetsCount = groupedWeekMeetings.Max("x => x.Count()");
			}

			var rows = [];
			for (var i = 0; i < maxDsyMeetsCount; i++) {
				var row = {};
				for (var j = 0; j < 7; j++) {
					var d = (new Date(date).add(j).days()).toString("MM/dd/yy");
					var currentDayMeeting = groupedWeekMeetings
						.Where(function(x) {
							return x.Key() == d;
						})
						.FirstOrDefault();
					if (currentDayMeeting !== undefined) {
						var meet = currentDayMeeting.ElementAtOrDefault(i);
						if (meet !== undefined) {
							row[j] = meet;
						} else {
							row[j] = {};
						}

					} else {
						row[j] = {};
					}
				}
				rows[i] = row;
			}

			var weeklyMeetingsModel = new sap.ui.model.json.JSONModel();
			weeklyMeetingsModel.setData({
				rows: rows,
				today: date
			});
			this.getView().setModel(weeklyMeetingsModel, "weekMeetings");
			this.byId("weeklyTable").setProperty("visibleRowCount", rows.length);
		},

		showMonthMeetings: function(date) {
			var monthMeetings =
				Enumerable.From(this.getMyMeetings())
				.Where(function(x) {
					var d1 = Date.parse(x.Date);
					var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
					var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					return d1.between(firstDay, lastDay);
				})
				.ToArray();
			var calendar = this.byId("calendarMonth");
			for (var i = 0; i < monthMeetings.length; i++) {
				calendar.addSpecialDate(new DateTypeRange({
					startDate: Date.parse(monthMeetings[i].Date),
					type: "Type01"
				}));
			}
		},

		getMyMeetings: function() {
			var meetModel = sap.ui.getCore().getModel("all_meetings");

			var myMeetings = Enumerable.From(meetModel.getData())
				.OrderBy(function(x) {
					return x.Epoch;
				})
				.ToArray();

			return myMeetings;
		},

        formatStart: function (oDate) {
            var date = new Date(+oDate);
            return date.toString(this.meetingStartDateFormat);
        }
	});

});