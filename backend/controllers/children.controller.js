import {
  addChild,
  getChildrenList,
  getChildDetails,
  getChildByWatchIdService,
  updateChildDetails,
  removeChild
} from '../services/children.service.js';

export async function addChildController(req, res) {
  try {
    const { watchId, name, college, gender, weight, height, dob } = req.body;
    
    // Validate required fields
    if (!watchId || !name) {
      return res.status(400).json({ error: 'Watch ID and name are required' });
    }

    const newChild = await addChild({
      parentId: req.user.id,
      watchId,
      name,
      college,
      gender,
      weight,
      height,
      dob
    });

    res.status(201).json(newChild);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getChildrenController(req, res) {
  try {
    const children = await getChildrenList({ parentId: req.user.id });
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getChildController(req, res) {
  try {
    const { id } = req.params;
    const child = await getChildDetails({ childId: id, parentId: req.user.id });
    res.json(child);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function getChildByWatchIdController(req, res) {
  try {
    const { watchId } = req.params;
    const child = await getChildByWatchIdService(watchId);
    res.json(child);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function updateChildController(req, res) {
  try {
    const { id } = req.params;
    const { name, college, gender, weight, height, dob } = req.body;
    
    const updatedChild = await updateChildDetails({
      childId: id,
      parentId: req.user.id,
      name,
      college,
      gender,
      weight,
      height,
      dob
    });

    res.json(updatedChild);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteChildController(req, res) {
  try {
    const { id } = req.params;
    await removeChild({ childId: id, parentId: req.user.id });
    res.json({ message: 'Child removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


