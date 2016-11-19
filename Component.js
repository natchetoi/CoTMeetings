jQuery.sap.declare("fusion.Component");
jQuery.sap.require("fusion.dev.devapp");
jQuery.sap.require("fusion.MyRouter");

jQuery.sap.registerModulePath("js", "/js/");

sap.ui.core.UIComponent.extend("fusion.Component", {
	metadata: {
		name: "Meeting planning App",
		version: "1.0",
		includes: ["js/linq.min.js", "js/date.js", "js/en-US.js"],
		dependencies: {
			libs: ["sap.m", "sap.ui.layout"],
			components: []
		},

		rootView: "fusion.view.App",

		config: {
			resourceBundle: "i18n/messageBundle.properties",
			serviceConfig: {
				name: "",
				serviceUrl: ""
			}
		},

		routing: {
			config: {
				routerClass: "fusion.MyRouter",
				viewType: "XML",
				viewPath: "fusion.view",
				targetAggregation: "detailPages",
				clearTarget: false,
				transition: "flip",
				bypassed: {
					target: "NewMeeting"
				}
			},
			routes: [{
				pattern: "",
				name: "login",
				view: "LoginView",
				targetAggregation: "masterPages",
				targetControl: "idAppControl",
				subroutes: [{
					pattern: "Master",
					name: "main",
					view: "Master",
					viewLevel: "1",
					targetAggregation: "masterPages"
				}, {
					pattern: "myMeetings",
					name: "mymeetings",
					view: "myMeetings",
					viewLevel: "2",
					targetAggregation: "detailPages"
				}, {
					pattern: "NewMeeting/{empty}",
					name: "NewMeeting",
					view: "NewMeeting",
					viewLevel: "3",
					targetAggregation: "detailPages"
				}, {
					pattern: "FindRoom",
					name: "FindRoom",
					view: "FindRoom",
					viewLevel: "4",
					targetAggregation: "detailPages"
				}, {
					pattern: "RoomDetails/{room}/{back}",
					name: "RoomDetails",
					view: "RoomDetails",
					viewLevel: "5",
					targetAggregation: "detailPages"
				}, {
					pattern: "FloorPlan3d",
					name: "FloorPlan3d",
					view: "FloorPlan3d",
					viewLevel: "5",
					targetAggregation: "detailPages"
				}, {
					pattern: "SelectPerson",
					name: "SelectPerson",
					view: "SelectPerson",
					viewLevel: "4",
					targetAggregation: "detailPages"
				}, {
					pattern: "Calendar",
					name: "Calendar",
					view: "Calendar",
					viewLevel: "4",
					targetAggregation: "detailPages"
				}, {
					pattern: "Scheduler",
					name: "Scheduler",
					view: "Scheduler",
					viewLevel: "4",
					targetAggregation: "detailPages"
						//				targetControl: "idAppControl"
				}, {
					pattern: "{entity}/:tab:",
					name: "detail",
					view: "Detail"
				}]
			}, {
				pattern: "LoginView",
				name: "LoginView",
				view: "LoginView",
				viewLevel: "1",
				targetAggregation: "masterPages",
				subroutes: [{
					pattern: "App",
					name: "App",
					view: "App",
					viewLevel: "1",
					targetAggregation: "masterPages"
				}]
			}, {
				name: "catchallMaster",
				view: "Master",
				targetAggregation: "masterPages",
				targetControl: "idAppControl",
				subroutes: [{
					pattern: ":all*:",
					name: "catchallDetail",
					view: "NotFound",
					transition: "show"
				}],
				targets: {
					mymeetings: {
						viewName: "App",
						viewId: "mymeetings",
						viewLevel: "1"
					},
					loginview: {
						viewName: "LoginView",
						viewId: "loginview",
						viewLevel: "1"
					},
					NewMeeting: {
						viewName: "NewMeeting",
						viewId: "NewMeeting",
						viewLevel: "1"
					}
				}
			}]
		}
	},

	/**
	 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
	 * In this method, the resource and application models are set and the router is initialized.
	 */
	init: function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("fusion");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var oModel;
		var externalURL = fusion.dev.devapp.externalURL;
		var appContext;
		if (fusion.dev.devapp.devLogon) {
			appContext = fusion.dev.devapp.devLogon.appContext;
		}
		if (window.cordova && appContext && !window.sap_webide_companion && !externalURL) {
			var url = appContext.applicationEndpointURL + "/";
			var oHeader = {
				"X-SMP-APPCID": appContext.applicationConnectionId
			};

			if (appContext.registrationContext.user) {
				oHeader.Authorization = "Basic " + btoa(appContext.registrationContext.user + ":" + appContext.registrationContext.password);
			}
			oModel = new sap.ui.model.odata.ODataModel(url, true, null, null, oHeader);
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay); // Editable

			this._setModel(oModel);
		} else {
			var sServiceUrl = mConfig.serviceConfig.serviceUrl;
			if (externalURL) {
				sServiceUrl = externalURL;
			}

			//This code is only needed for testing the application when there is no local proxy available, and to have stable test data.
			var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
			// start the mock server for the domain model
			if (bIsMocked) {
				this._startMockServer(sServiceUrl);
			}

			var self = this;
			// Create and set domain model to the component
			// only call customized logon dialog when in android companion app to workaround cordova browser for 'basic' auth issue
			if ((window.sap_webide_companion || externalURL) && device) {
				if (device.platform === 'Android') {
					if (window.sap_webide_companion) {
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
						self._setModel(oModel);
					} else {
						this._logon(sServiceUrl, null, null, function() {
							oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
							self._setModel(oModel);
						}, function() {
							self._openLogonDialog(sServiceUrl);
						}, null);
					}
				} else {
					var username = "";
					var password = "";
					this._logon(sServiceUrl, username, password, function() {
						var auth = "Basic " + btoa(username + ":" + password);
						var uHeader = {
							"Authorization": auth
						};
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, null, null, uHeader);
						self._setModel(oModel);
					}, null, null);
				}
			} else {
				var isSafari = false,
					av = navigator.appVersion;
				if (/AppleWebKit\/(\S+)/.test(av)) {
					if (!/Chrome\/(\S+)/.test(av) && av.indexOf("Safari") >= 0) {
						isSafari = true;
					}
				}
				if (isSafari) {
					self._logon(sServiceUrl, null, null, function() {
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
						self._setModel(oModel);
					}, function() {
						self._openLogonDialog(sServiceUrl);
					}, null);
				} else {
					// Create and set domain model to the component
					oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {
						json: true,
						loadMetadataAsync: true
					});
					this._setModel(oModel);
				}
			}
		}
	},

	/**
	 * perform an ajax asynchronous HTTP request
	 * param{String} url OData service Url
	 * param{String} usr OData service username
	 * param{String} pwd OData service password
	 * param{Object} onLogonSuccess success callback function
	 * param{Object} onUnauthorized authentication error callback function
	 * param{Object} onLogonError general error callback function
	 */
	_logon: function(url, usr, pwd, onLogonSuccess, onUnauthorized, onLogonError) {
		var auth = "Basic " + btoa(usr + ":" + pwd);
		$.ajax({
			type: "GET",
			url: url,
			username: usr,
			password: pwd,
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", auth);
			},
			statusCode: {
				401: onUnauthorized
			},
			error: onLogonError,
			success: onLogonSuccess
		});
	},

	/**
	 * open an authentication dialog to get OData service username and password from user
	 * param{String} sServiceUrl OData service Url
	 */
	_openLogonDialog: function(sServiceUrl) {
		var logonDialog = new sap.m.Dialog();
		logonDialog.setTitle("Basic Authentication");

		var vbox = new sap.m.VBox();
		this._userInput = new sap.m.Input();
		this._userInput.setPlaceholder("Username");
		this._pwdInput = new sap.m.Input();
		this._pwdInput.setPlaceholder("Password");
		this._pwdInput.setType(sap.m.InputType.Password);
		vbox.addItem(this._userInput);
		vbox.addItem(this._pwdInput);
		logonDialog.addContent(vbox);

		var self = this;
		logonDialog.addButton(new sap.m.Button({
			text: "OK",
			press: function() {
				var username = self._userInput.getValue();
				var password = self._pwdInput.getValue();

				self._logon(sServiceUrl, username, password, function() {
					logonDialog.close();
					// Create and set domain model to the component
					var oModel;
					if (username && password) {
						var auth = "Basic " + btoa(username + ":" + password);
						var uHeader = {
							"Authorization": auth
						};
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, null, null, uHeader);
					} else {
						oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
					}
					self._setModel(oModel);
				}, function() {
					alert("Username or Password is incorrect!");
					self._userInput.setValue("");
					self._pwdInput.setValue("");
				}, function(e) {
					//alert(e.statusText);
				});
			}
		}));
		logonDialog.addButton(new sap.m.Button({
			text: "Cancel",
			press: function() {
				logonDialog.close();
			}
		}));
		logonDialog.open();
	},

	/**
	 * set UI5 OData model and device model, initialize router
	 * param{Object} oModel application OData model
	 */
	_setModel: function(oModel) {
		this.setModel(oModel);

		this.createMeeting();

		var oRoomsModel = new sap.ui.model.json.JSONModel('model/API_Rooms.json');
		this.setModel(oRoomsModel, "rooms");
		
		window.coTRooms = [];		
		oRoomsModel.attachRequestCompleted(function(oEvent) {
			var roomList = oRoomsModel.getData();		
			for(var i=0; i<roomList.length; i++) {
				var room = roomList[i];
				window.coTRooms[room.RoomID] = room;
			}
		});

		var oRoomsModel2 = new sap.ui.model.json.JSONModel('model/API_Rooms.json');
		this.setModel(oRoomsModel2, "all_rooms");
		
//		var meetings = new sap.ui.model.json.JSONModel('model/AppointmentSet.json');
//		this.setModel(meetings, "all_meetings");
		
		var people = new sap.ui.model.json.JSONModel('model/AttendeeSet.json');
		this.setModel(people, "all_people");
		

		this.createMeeting();

		// set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch: sap.ui.Device.support.touch,
			isNoTouch: !sap.ui.Device.support.touch,
			isPhone: sap.ui.Device.system.phone,
			isNoPhone: !sap.ui.Device.system.phone,
			listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

		this.getRouter().initialize();
	},

	createMeeting: function() {
		var d = new Date();
		var start = d.getHours() + 1;
		var end = d.getHours() + 2;
		start = start + ":00";
		end = end + ":00";
		var today = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();

		var attendees = {
			"AttendeeSet": [{
				PersonID: "1",
				selected: true,
				firstName: "Yuri",
				lastName: "Natchetoi",
				Position: "Mobility Consultant",
				workEmail: "ynatche@toronto.ca"
			}]
		};

		var meeting = {
			"MeetingSubject": "",
			"Start": start,
			"End": end,
			"Date": today,
			"RoomName": "Adelaide",
			"AltID": "1",
			"MeetingComment": "",
			"Organizer": "Yuri Natchetoi",
			"Attendees": [{
				PersonID: "1",
				selected: true,
				firstName: "Yuri",
				lastName: "Natchetoi",
				Position: "Mobility Consultant",
				workEmail: "ynatche@toronto.ca"
			}]

		};

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(meeting);
		// sap.ui.getCore()
		this.setModel(oModel, "new");


		var oAttendeesModel = new sap.ui.model.json.JSONModel();
		oAttendeesModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		oAttendeesModel.setData(attendees);
		this.setModel(oAttendeesModel, "att");

	},

	_getRoomsJSON: function() {
		var url = "http://fusionrv.corp.toronto.ca//Fusion/APIService/rooms";
		// Content-Type: application/json

	},

	_getAppointmentsJSON: function() {
		var url =
			"http://fusionrv.corp.toronto.ca//Fusion/APIService/appointments/?Start=7/27/2016%203:30%20PM&room=860ae2ee-2620-4035-b36b-c4ff67d1124a&duration=30";

		// Content-Type: application/json

	},

	_getRoomsXML: function() {
		var aData = jQuery.ajax({
			url: "http://fusionrv.corp.toronto.ca/Fusion/APIService/rooms/",
			//url: "http://s248551470.onlinehome.us/rooms.json",
			type: "GET",
			//data: param,
			dataType: "xml",
			//dateType: "json",
			//dataType: 'jsonp',
			//contentType : "application/json",
			async: true,
			crossDomain: true,
			success: function(data, textStatus, jqXHR) {

				jQuery.sap.require("sap.m.MessageBox");
				//sap.m.MessageBox.show("Hello from sap messagebox" + data);

				var rooms = [];
				var list = $(data).find('API_Rooms');

				var api_rooms = list[0];
				var roomList = api_rooms.childNodes;
				var n = roomList.length;

				var room = {};
				var roomValue;
				var roomTag;
				for (var i = 0; i < n; i++) {
					room = roomList[i];
					var roomObject = {};

					var descr = room.childNodes[0].textContent;
					var id = room.childNodes[1].textContent;
					var name = room.childNodes[2].textContent;
					var roomObject = {
						"MeetingSubject": descr,
						"Start": id,
						"RoomName": name
					};
					rooms.push(roomObject);
				}

				//                var appSet = { "AppointmentSet" : rooms };     

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(rooms);
				sap.ui.getCore().setModel(oModel, "all_rooms");

				var oModel2 = new sap.ui.model.json.JSONModel();
				oModel2.setData(rooms);
				sap.ui.getCore().setModel(oModel2, "rooms");

				//             oModel.setData(data);  // fill the received data into the JSONModel
				//               sap.ui.getCore().setModel(oModel, "glRooms");  // Store in the Model

				//                var testStr = oModel.getProperty("/API_Rooms");
				//                alert("attr value OF ROOM NAME is: "+testStr);
				/*          if(appC.restrictions === undefined) {
				                  appC.restrictions = new Array();
				            } */
			},
			error: function(data, textStatus, jqXHR) {
				alert("Error occured" + data.statusText + textStatus);
				//                     sap.m.MessageBox.show("Error");
			}
		});
	},

//****************************************** Geolocation	
	onDeviceReady : function() {
	   var options = { maximumAge: 150000, 
			   		   timeout: 100000, 
			   		   enableHighAccuracy: true };
	   
	   var watchID = null;
	   watchID = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
//	   navigator.notification.beep(3);
	},

// ------------------------------------------------------------------------------------	
	   onSuccess: function (position) {
		  var lat = position.coords.latitude;
		  var lon = position.coords.longitude;
		
		  var minProximity = 10000.0;
		  
		  var rooms =	this.getModel("all_rooms").getData();
		  if(rooms !== undefined) {
			var n = rooms.length;

 //		  sap.m.MessageToast.show("la=" + lat + " lo=" + lon );
		    for(var i=0; i<n; i++) {
		    	var room = rooms[i];
		    	var xProx = lat - room.x;
		    	var yProx  = lon - room.y;
		    	var dist2 = Math.sqrt(xProx * xProx + yProx * yProx); //  distance
		    }
	     }
	 },		    	
//------------------------------------------------------------------------------------- GPS error   
	   onError:	function (error) {
		   		navigator.notification.alert('Unable to find your location. Error code: ' + error.code   + '\n' + 
		   	     'message: ' + error.message + '\n', null, 'Error', 'Dismiss');
	   },
//--------------------------------------------------------------------------------- Timer
	   checkTime: function() {
		 if(this.lastTime == undefined) {
			 this.lastTime = 0;
		 }  
		 var date = new Date();
		 var now = date.getTime();
	     if((now - this.lastTime) >= this.period) {   // less than 10 sec passed
	    	 this.lastTime = now;
	    	 return true;
	     }
//	     sap.m.MessageToast.show(((10000.0 - (now - this.lastTime))/1000)  +  " sec");
	     return false;
	   },
//******************************************  End of Geolocation		
	/**
	 * start application mock server
	 * param{String} sServiceUrl mock server url
	 */
	_startMockServer: function(sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter: iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();

		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 2000
		});
	}
});