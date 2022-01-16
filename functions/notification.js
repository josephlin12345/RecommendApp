import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Linking } from 'react-native';
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

export const handleNotificationResponse = (content, user) => {
  request('history', 'post', { ...user, title: content.title });
  Linking.openURL(content.data.url);
}

export const updateNotification = async user => {
  const response = await request('recommend', 'get', {
    ...user,
    offset: 0,
    limit: NOTIFICATIONS_PER_DAY * 7
  });
  if(!response.error) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for(const item of response.result) {
      const index = response.result.indexOf(item);
      const content = item.event.content;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: content.organizer,
          body: content.title,
          data: { url: content.url }
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