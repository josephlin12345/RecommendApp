import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_FETCH_TASK_NAME } from '../constant';
import request from './request';

export const startScheduleNotification = async user => {
  const notificationPermissions = await Notifications.requestPermissionsAsync();
  if(notificationPermissions.granted) {
    Notifications.setNotificationHandler({
      handleNotification: () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
      })
    });
    await updateNotification(user);
    const backGroundFetchStatus = await BackgroundFetch.getStatusAsync();
    if(backGroundFetchStatus == BackgroundFetch.BackgroundFetchStatus.Available)
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK_NAME, { minimumInterval: 60 * 60 });
  }
}

// to do
export const updateNotification = async user => {
  const response = await request('recommend', 'get', {
    ...user,
    offset: 0,
    limit: 10
  });
  if(!response.error) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'test',
        body: 'test'
      },
      trigger: {
        seconds: 3,
        repeats: true
      }
    });
  }
}

export const stopScheduleNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if(await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK_NAME))
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK_NAME);
}