import * as Location from 'expo-location';
import { LOCATION_UPDATE_TASK_NAME } from '../constant';
import request from './request';

export const startLocationUpdate = async () => {
	const LocationForegroundPermissions = await Location.requestForegroundPermissionsAsync();
	const locationBackgroundPermissions = await Location.requestBackgroundPermissionsAsync();
	if(LocationForegroundPermissions.granted && locationBackgroundPermissions.granted)
		Location.startLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME, {
			foregroundService: {
				notificationTitle: 'Recommend',
				notificationBody: '追蹤位置中...'
			}
		});
}

// run reverseGeocodeAsync in background
// TaskManager: Task "LocationUpdate" failed:, [Error: Geocoder is not running.]
export const sendLocation = async (user, location) => {
	try {
		const [address] = await Location.reverseGeocodeAsync(location.coords);
		if(isNaN(address.name)) request('history', 'post', { ...user, title: address.name });
	} catch(e) { console.log(e); }
}

export const stopLocationUpdate = async () => {
	if(await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME))
		Location.stopLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME);
};