import * as Location from 'expo-location';
import { LOCATION_UPDATE_TASK_NAME } from '../constant';
import request from './request';

export const startLocationUpdate = async () => {
	const LocationForegroundPermissions = await Location.requestForegroundPermissionsAsync();
	const locationBackgroundPermissions = await Location.requestBackgroundPermissionsAsync();
	if(LocationForegroundPermissions.granted && locationBackgroundPermissions.granted)
		await Location.startLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME, {
			foregroundService: {
				notificationTitle: 'Recommend',
				notificationBody: '追蹤位置中...'
			}
		});
}

// run reverseGeocodeAsync in background
// TaskManager: Task "LocationUpdate" failed:, [Error: Geocoder is not running.]
export const sendLocation = async (location, user) => {
	try {
		const [address] = await Location.reverseGeocodeAsync(location.coords);
		if(isNaN(address.name)) {
			setTimeout(async () => {
				const currentLocation = await Location.getCurrentPositionAsync();
				const [currentAddress] = await Location.reverseGeocodeAsync(currentLocation.coords);
				if(address.name == currentAddress.name) request('history', 'post', { ...user, title: address.name });
			}, 10 * 60 * 1000);
		}
	} catch {}
}

export const stopLocationUpdate = async () => {
	if(await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME))
		await Location.stopLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME);
};