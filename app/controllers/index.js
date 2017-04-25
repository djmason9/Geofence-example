var Geofence = require("ti.geofence");

function locBTNClicked() {
    if (Ti.Geolocation.locationServicesEnabled) {
        // Titanium.Geolocation.purpose = 'Get Current Location';
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                Ti.API.error('Error: ' + e.error);
            } else {
                Ti.API.info(e.coords);
                $.lat.text = e.coords.latitude;
                $.lon.text = e.coords.longitude;
            }
        });
    } else {
        alert('Please enable location services');
    }
}

// Check if the device is running iOS 8 or later, before registering for local notifications
if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
    Ti.App.iOS.registerUserNotificationSettings({
        types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
    });
}

var region1 = Geofence.createRegion({
    center: {
        latitude:37.000000,
        longitude:-122.000000
    },
    radius:500,
    identifier:'Appcelerator'
});

var region2 = Geofence.createRegion({
    center: {
        latitude:36.000000,
        longitude:-121.000000
    },
    radius:500,
    identifier:'Some Place'
});

Geofence.addEventListener("enterregions", function(e) {
    Ti.API.debug('enterregions event');
    // Display local notification
    for (var i = 0, j = e.regions.length; i < j; i++) {
        // showNotification({
            // title: 'ENTER',
            // body: 'enter - ' + e.regions[i].identifier
        // });
        Ti.App.iOS.scheduleLocalNotification({
            alertAction: 'ENTER',
            alertBody: 'enter - ' + e.regions[i].identifier
            // date: new Date(new Date().getTime() + 2000) // Needs to be scheduled in the future 
        });

        // Show the number of notifications using the app badge
        Ti.UI.iOS.appBadge++;
    }
});

Geofence.addEventListener("exitregions", function(e) {
    Ti.API.debug('exitregions event');
    // Display local notification
    for (var i = 0, j = e.regions.length; i < j; i++) {
        // showNotification({
            // title: 'EXIT',
            // body: 'exit - ' + e.regions[i].identifier
        // });
        Ti.App.iOS.scheduleLocalNotification({
            alertAction: 'EXIT',
            alertBody: 'exit - ' + e.regions[i].identifier
            // date: new Date(new Date().getTime() + 2000) // Needs to be scheduled in the future 
        });
    }
});

$.index.open();
Geofence.startMonitoringForRegions([region1, region2]);

Ti.API.debug("Geofence.regionMonitoringAvailable() = "+Geofence.regionMonitoringAvailable());
Ti.API.debug("Geofence.getMonitoredRegions() = "+Geofence.getMonitoredRegions());
Ti.API.debug("Geofence.monitoredRegions.length = "+Geofence.monitoredRegions.length);

for (var i = 0, j = Geofence.monitoredRegions.length; i < j; i++) {
    Ti.API.debug("Geofence.monitoredRegions[i].center.latitude = "+Geofence.monitoredRegions[i].center.latitude);
    Ti.API.debug("Geofence.monitoredRegions[i].center.longitude = "+Geofence.monitoredRegions[i].center.longitude);
    Ti.API.debug("Geofence.monitoredRegions[i].identifier = "+Geofence.monitoredRegions[i].identifier);
    
}
