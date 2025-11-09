import db from '../config/db.js';

export async function createDeviceModel({ userId,name, college, gender, weight, height, dob }){
    const [device] = await db('device')
        .insert({
            user_id:userId,
            name,
            college,
            gender,
            weight,
            height,
            dob
        })
        .returning([ 'id', 'user_id as userId', 'name','college', 'gender', 'weight', 'height', 'dob', 'created_at as createdAt', 'updated_at as updatedAt' ]);
    return device;
}

export async function getDeviceList({ userId }) {
  const deviceList = await db("device")
    .where({ user_id: userId })
    .select([
      "id",
      db.raw('user_id as "userId"'),
      "name",
      "college",
      "gender",
      "weight",
      "height",
      "dob",
      db.raw('created_at as "createdAt"'),
      db.raw('updated_at as "updatedAt"'),
    ])
    .orderBy("created_at", "desc");

  return deviceList;
}

export async function updateDevice({id, userId, name, college, gender, weight, height, dob}){
    const updatePayload = {};
    if(name !== undefined) updatePayload.name = name;
    if(college !== undefined) updatePayload.college = college;
    if(gender !== undefined) updatePayload.gender = gender;
    if(weight !== undefined) updatePayload.weight = weight;
    if(height !== undefined) updatePayload.height = height;
    if(dob !== undefined) updatePayload.dob = dob;
    updatePayload.updated_at = db.fn.now();

    const [updateRow] = await db('device')
        .where({ id: id, user_id: userId})
        .update(updatePayload)
        .returning(['id', 'user_id as userId', 'name','college', 'gender', 'weight', 'height', 'dob', 'created_at as createdAt', 'updated_at as updatedAt' ]);
    
    return updateRow;
}

export async function deleteDeviceFromTable({id, userId}){
  const delState = await db('device')
    .where({ id: id, user_id: userId })
    .del();
  
  return delState;
}
