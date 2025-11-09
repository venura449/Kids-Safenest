import { createDeviceModel, getDeviceList, updateDevice, deleteDeviceFromTable} from '../models/device.model.js';

export async function createDevice({ userId, name, college, gender, weight, height, dob }){
    return createDeviceModel({ userId, name, college, gender, weight, height, dob });
}

export async function fetchDeviceList({ userId }){
    return getDeviceList({userId});
}

export async function updateDeviceDetails({id, userId, name, college, gender, weight, height, dob}){
    return updateDevice({id, userId, name, college, gender, weight, height, dob});
}

export async function deleteDevice({id, userId}){
    return deleteDeviceFromTable({id, userId});
}