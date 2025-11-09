import {
  createChild,
  getChildrenByParentId,
  getChildById,
  getChildByWatchId,
  updateChild,
  deleteChild,
  checkWatchIdExists
} from '../models/children.model.js';

export async function addChild({ parentId, watchId, name, college, gender, weight, height, dob }) {
  // Check if watch ID already exists
  const existingChild = await checkWatchIdExists(watchId);
  if (existingChild) {
    throw new Error('Watch ID is already in use by another child');
  }

  return createChild({ parentId, watchId, name, college, gender, weight, height, dob });
}

export async function getChildrenList({ parentId }) {
  return getChildrenByParentId(parentId);
}

export async function getChildDetails({ childId, parentId }) {
  const child = await getChildById(childId, parentId);
  if (!child) {
    throw new Error('Child not found');
  }
  return child;
}

export async function getChildByWatchIdService(watchId) {
  const child = await getChildByWatchId(watchId);
  if (!child) {
    throw new Error('Child not found for this watch ID');
  }
  return child;
}

export async function updateChildDetails({ childId, parentId, name, college, gender, weight, height, dob }) {
  const child = await getChildById(childId, parentId);
  if (!child) {
    throw new Error('Child not found');
  }

  return updateChild({ childId, parentId, name, college, gender, weight, height, dob });
}

export async function removeChild({ childId, parentId }) {
  const child = await getChildById(childId, parentId);
  if (!child) {
    throw new Error('Child not found');
  }

  return deleteChild(childId, parentId);
}


