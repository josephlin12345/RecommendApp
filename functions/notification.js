import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_FETCH_TASK_NAME, NOTIFICATIONS_PER_DAY } from '../constant';
import request from './request';

export const startScheduleNotification = async user => {
  const notificationPermissions = await Notifications.requestPermissionsAsync();
  if(notificationPermissions.granted) {
    Notifications.setNotificationHandler({
      handleNotification: () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
      })
    });
    await updateNotification(user);
    const backGroundFetchStatus = await BackgroundFetch.getStatusAsync();
    if(backGroundFetchStatus == BackgroundFetch.BackgroundFetchStatus.Available)
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK_NAME, { minimumInterval: 60 * 60 });
  }
}

export const updateNotification = async user => {
  const response = await request('recommend', 'get', {
    ...user,
    offset: 0,
    limit: NOTIFICATIONS_PER_DAY * 7
  });
  if(response.result) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for(const item of response.result) {
      const index = response.result.indexOf(item);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: item.event.content.organizer,
          body: item.event.content.title,
          data: { event: item.event }
        },
        trigger: {
          weekday: index % 7 + 1,
          hour: index % NOTIFICATIONS_PER_DAY * (24 / NOTIFICATIONS_PER_DAY),
          minute: 0,
          repeats: true
        }
      });
    }
  }
}

export const stopScheduleNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if(await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK_NAME))
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK_NAME);
}