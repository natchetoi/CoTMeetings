sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("fusion.controller.LoginView", {
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fusion.view.LoginView
		 */
		onInit: function() {
			//				this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			//				this.getRouter().getRoute("loginview").attachPatternMatched(this._onRouteMatched, this);

			//			$("sapMIBar").css("background-image", "");

		},

		_onRouteMatched: function() {

		},
		
		

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fusion.view.LoginView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fusion.view.LoginView
		 */
		onAfterRendering: function() {

			var loginButton = this.getView().byId("loginButtonId");
			loginButton.addEventDelegate({
				onAfterRendering: function() {
					loginButton.focus();
				}
			});
			
			jQuery.sap.delayedCall(500, this, function() {
				loginButton.focus();
			});

		},
		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fusion.view.LoginView
		 */
		//	onExit: function() {
		//
		//	}
		//-----------------------------------------------------------------------------
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		loadRooms: function () {
		
			var self = this;
//			var url = "model/rooms.json";			
			var url = "http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/";
			
			var headers = { "Content-Type": "application/json" };
			
			var aData = jQuery.ajax({
				              url: url,  
			                  type : "GET",
			            	  headers: headers,
			                  dateType: "text",
				              contentType : "application/json",
			                  async: true, 
			                  crossDomain : true,
			            success: function(data, textStatus, jqXHR) { // callback called when data is 

		                  var rooms = [];   
					      var list = data.API_Rooms;
					      var n = list.length;

			                  for(var i = 0; i< n; i++) {
			                  	try {
			                  	  var roomData = list[i];
			                      var RoomName = roomData.RoomName;
			                      var RoomID = roomData.RoomID;
			                      var _room = {
			                      	"RoomName" : RoomName,
			                      	"RoomID" : RoomID
			                      };
			                      rooms.push(_room);
			                  	} catch(err) {
			                  		alert(err);
			                  	}
			                 } 
			                 
			                 self.mainScreen();
			            },
			           error: function(data, textStatus, jqXHR) {
							sap.m.MessageToast.show("Error: " + data.statusText + " "  + textStatus, {
								duration: "200",
								width: "15em",
								my: "center top",
								at: "center top",
								offset: "0 0",
								iNumber: 2,
								autoClose: true,
								onClose: function() {
				                    self.mainScreen();
								}			        	   
			                 });
			                 }
			            });		                 
		}, 
		
		login: function(data) {
					var self = this;
			   	    var oModel = new sap.ui.model.json.JSONModel();
       			    oModel.setData(data);  // fill the received data into the JSONModel
       				sap.ui.getCore().setModel(oModel, "user");  // Store in the Model
					this.loadRooms();				 
		},
		
		mainScreen: function() {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("main", {}, true);
		},
		
		createSession: function() {
			var self = this;
		  
			var param = //JSON.stringify(
		   			{ "user" : "testweb1",
					  "pwd" : "toronto", 
					  "app" : "deploy"
				    };
		 var url =  "https://was8-intra-dev.toronto.ca/cc_sr_admin_v1/session/";
//	     var url =  "http://behealthymagazine.ca/session.php";
		 jQuery.ajax({
	            url: url,  
				type : "POST",
				data: param,
  				dataType: "json",
				contentType : "application/x-www-form-urlencoded",
				async: true, 
				crossDomain : true,
	            success: function(data, textStatus, jqXHR) { // callback called when data is 
	        		var name = data.cotUser.firstName + " " +  data.cotUser.lastName;
						sap.m.MessageToast.show("Hello " + name, {
						duration: "200",
					width: "15em",
					my: "center top",
					at: "center top",
					offset: "0 0",
					iNumber: 2,
					autoClose: true,
					onClose: function() {
						self.login();
					}
				});
	            },
	            
				error: function(data, textStatus, jqXHR) {
					sap.m.MessageToast.show("Error: " + data.statusText + " "  + textStatus, {
						duration: "200",
						width: "15em",
						my: "center top",
						at: "center top",
						offset: "0 0",
						iNumber: 2,
						autoClose: true,
						onClose: function() {
							self.login();
						}
					});
				}
			});
		}, 

		onLogin: function(oEvent) {
			this.createSession();

			//	   	  this.getRouter().navTo("mymeetings", {}, true );

		}, 
		
		getRooms: function() {
			
		}
	});

});