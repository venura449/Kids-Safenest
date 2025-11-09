import { createDevice,fetchDeviceList,updateDeviceDetails, deleteDevice } from '../services/profile.service.js';

export async function deviceCreateController(req, res){
    try{
        const { name, college, gender, weight, height, dob } = req.body;
        const newDevice = await createDevice({ userId: req.user.id, name, college, gender, weight, height, dob });
        res.status(201).json(newDevice);
    }catch( e ){
        res.status(400).json({ error: e.message });
    }
}

export async function listDeviceController(req,res){
    try{
        const userId = req.user.id;
        const deviceList = await fetchDeviceList({userId});
        res.json(deviceList);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export async function deviceUpdateController(req,res){
    try{
        const{id} = req.params;
        const { name, college, gender, weight, height, dob} = req.body;
        const updateDevice = await updateDeviceDetails({id:Number(id), userId:req.user.id, name, college, gender, weight, height, dob});
        if (!updateDevice) return res.status(404).json({ error: 'Device not found' });
        res.json(updateDevice);
    }catch(e){
        res.status(400).json({ error: e.message });
    }
}

export async function deleteDeviceController(req,res){
    try{
        const {id} = req.params;
        const deleted = await deleteDevice({id:Number(id),userId:req.user.id});
        res.json(deleted);
    }catch(e){
        res.status(400).json({ error: e.message });
    }
}