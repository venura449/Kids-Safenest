import db from '../config/db.js';

export async function createChild({ parentId, watchId, name, college, gender, weight, height, dob }) {
  const [child] = await db('children')
    .insert({
      parent_id: parentId,
      watch_id: watchId,
      name,
      college,
      gender,
      weight,
      height,
      dob
    })
    .returning([
      'id',
      'parent_id as parentId',
      'watch_id as watchId',
      'name',
      'college',
      'gender',
      'weight',
      'height',
      'dob',
      'is_active as isActive',
      'created_at as createdAt',
      'updated_at as updatedAt'
    ]);
  return child;
}

export async function getChildrenByParentId(parentId) {
  const children = await db('children')
    .where({ parent_id: parentId, is_active: true })
    .select([
      'id',
      'parent_id as parentId',
      'watch_id as watchId',
      'name',
      'college',
      'gender',
      'weight',
      'height',
      'dob',
      'is_active as isActive',
      'created_at as createdAt',
      'updated_at as updatedAt'
    ])
    .orderBy('created_at', 'desc');
  
  return children;
}

export async function getChildById(childId, parentId) {
  const child = await db('children')
    .where({ id: childId, parent_id: parentId, is_active: true })
    .first()
    .select([
      'id',
      'parent_id as parentId',
      'watch_id as watchId',
      'name',
      'college',
      'gender',
      'weight',
      'height',
      'dob',
      'is_active as isActive',
      'created_at as createdAt',
      'updated_at as updatedAt'
    ]);
  
  return child;
}

export async function getChildByWatchId(watchId) {
  const child = await db('children')
    .where({ watch_id: watchId, is_active: true })
    .first()
    .select([
      'id',
      'parent_id as parentId',
      'watch_id as watchId',
      'name',
      'college',
      'gender',
      'weight',
      'height',
      'dob',
      'is_active as isActive',
      'created_at as createdAt',
      'updated_at as updatedAt'
    ]);
  
  return child;
}

export async function updateChild({ childId, parentId, name, college, gender, weight, height, dob }) {
  const updatePayload = {};
  if (name !== undefined) updatePayload.name = name;
  if (college !== undefined) updatePayload.college = college;
  if (gender !== undefined) updatePayload.gender = gender;
  if (weight !== undefined) updatePayload.weight = weight;
  if (height !== undefined) updatePayload.height = height;
  if (dob !== undefined) updatePayload.dob = dob;
  updatePayload.updated_at = db.fn.now();

  const [updatedChild] = await db('children')
    .where({ id: childId, parent_id: parentId })
    .update(updatePayload)
    .returning([
      'id',
      'parent_id as parentId',
      'watch_id as watchId',
      'name',
      'college',
      'gender',
      'weight',
      'height',
      'dob',
      'is_active as isActive',
      'created_at as createdAt',
      'updated_at as updatedAt'
    ]);
  
  return updatedChild;
}

export async function deleteChild(childId, parentId) {
  // Soft delete by setting is_active to false
  const result = await db('children')
    .where({ id: childId, parent_id: parentId })
    .update({ is_active: false, updated_at: db.fn.now() });
  
  return result;
}

export async function checkWatchIdExists(watchId, excludeChildId = null) {
  let query = db('children').where({ watch_id: watchId, is_active: true });
  
  if (excludeChildId) {
    query = query.whereNot({ id: excludeChildId });
  }
  
  const child = await query.first();
  return !!child;
}


