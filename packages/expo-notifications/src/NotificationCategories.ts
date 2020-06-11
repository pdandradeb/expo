import { UnavailabilityError, Platform } from '@unimodules/core';

import NotificationCategoriesModule from './NotificationCategoriesModule';
import { Action } from './Notifications.types';

export async function createCategoryAsync(
  name: string,
  actions: Action[],
  previewPlaceholder?: string
): Promise<void> {
  if (!NotificationCategoriesModule.createCategoryAsync) {
    throw new UnavailabilityError('Notifications', 'deleteCategoryAsync');
  }

  return Platform.OS === 'ios'
    ? await NotificationCategoriesModule.createCategoryAsync(name, actions, previewPlaceholder)
    : await NotificationCategoriesModule.createCategoryAsync(name, actions);
}

export async function deleteCategoryAsync(name: string): Promise<void> {
  if (!NotificationCategoriesModule.deleteCategoryAsync) {
    throw new UnavailabilityError('Notifications', 'deleteCategoryAsync');
  }

  return await NotificationCategoriesModule.deleteCategoryAsync(name);
}
