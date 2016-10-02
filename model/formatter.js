sap.ui.define([], function() {
	"use strict";

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
});