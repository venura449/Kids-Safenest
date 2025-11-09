import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { addChild, fetchChildren, updateChildDetails, deleteChild } from "../services/childrenService";
import {
  Home,
  CheckSquare,
  Heart,
  Calendar,
  Bell,
  Settings,
  User,
  Trash2,
  Edit3,
  LogOut,
  X,
  Menu,
  Plus,
} from "lucide-react";
import { comman } from "./en/comman";

export default function ProfilePage() {
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const navigate = useNavigate();
  const [childName,setName]=useState('');
  const [childWeight,setWeight]=useState('');
  const [childGender,setGender]=useState('');
  const [childHeight,setHeight]=useState('');
  const [dob,setDOB]=useState('');
  const [watchId,setWatchId]=useState('');
  const [children,setChildren] = useState([]);
  const [college,setCollege] = useState('');
  const [editMode,setEditMode]=useState(null);
  const [deleteMode,setDeleteMode]=useState(null);

  useEffect(() => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser) {
          console.log(storedUser);
          setUserName(storedUser.name);
        }
      } catch (err) {
        console.error("Failed to Fetch user data");
      }
      (async ()=> {
          try{
            const data = await fetchChildren();
            setChildren(data.map(t => ({
              id:t.id,
              name:t.name,
              gender:t.gender,
              weight:t.weight,
              height:t.height,
              college:t.college,
              dob:t.dob,
              watchId:t.watchId
            })));
          }catch( err ){
            console.error(err);
            toast.error('Failed to load children list');
          }
      })();
  },[]);

  const calculateAge = (dob) => {
    if( !dob ) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if(monthDiff < 0 || ( monthDiff == 0 && today.getDate() < birthDate.getDate() )){
      age--;
    }
   return age;
  };

  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if(parts.length == 1){
      return parts[0].substring(0,2).toUpperCase();
    }else{
      return (parts[0][0]+parts[1][0]).toUpperCase();
    }
  }

  const colors = [
    "bg-red-100 text-red-600",
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-yellow-100 text-yellow-600",
    "bg-indigo-100 text-indigo-600",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addChildHandler = async ()=>{
    if(!childName.trim()){
      toast.error('Enter Name');
      return;
    }
    if(!watchId.trim()){
      toast.error('Enter Watch ID');
      return;
    }
    if(college == null){
      toast.error('Enter School');
      return;
    }
    if(childGender != 'Male' && childGender != 'Female'){
      toast.error('Select Gender');
      return;
    }
    if(childWeight == ''){
      toast.error('Enter weight');
      return;
    }
    if(childHeight == ''){
      toast.error('Enter height');
      return;
    }

    try{
      const created = await addChild({
        name:childName.trim(),
        watchId:watchId.trim(),
        college:college,
        gender:childGender,
        weight:childWeight,
        height:childHeight,
        dob:dob || null
      });
      setChildren([...children,{
        id:created.id,
        name:created.name,
        college:created.college,
        gender:created.gender,
        weight:created.weight,
        height:created.height,
        dob:created.dob || '',
        watchId:created.watchId
      }]);
      setName('');
      setWatchId('');
      setCollege('');
      setGender('');
      setWeight('');
      setHeight('');
      setDOB('');
      setIsAddChildOpen(false);
      toast.success('Child added successfully!');
    }catch(e){
      toast.error(e.message||'Failed to add child');
    }
  };

  const formatDateForInput = (dob) => {
    if (!dob) return "";
    return new Date(dob).toISOString().split("T")[0]; 
  };

  const saveEditMode = async () =>{
    if(!editMode.name.trim()){
      toast.error('Enter Name');
      return;
    }
    if(editMode.college == null){
      toast.error('Enter School');
      return;
    }
    if(editMode.gender != 'Male' && editMode.gender != 'Female'){
      toast.error('Select Gender');
      return;
    }
    if(editMode.weight == ''){
      toast.error('Enter weight');
      return;
    }
    if(editMode.height == ''){
      toast.error('Enter height');
      return;
    }
   
    try{
      const child = await updateChildDetails(editMode.id,{
        name:editMode.name.trim(),
        college:editMode.college,
        gender:editMode.gender,
        weight:editMode.weight,
        height:editMode.height,
        dob:editMode.dob || ''
      });
      setChildren( children.map(c => c.id === editMode.id ? {
        id:child.id,
        name: child.name,
        college: child.college,
        gender: child.gender,
        weight : child.weight,
        height: child.height,
        dob : child.dob || '',
        watchId: child.watchId
      } : c));
      setEditMode(null);
      toast.success( 'Details updated successfully!' );
      
    }catch( e ){
      toast.error( e.message || 'Failed to update child details')
    }
  };

  const deleteChildHandler = async () => {
    try {
      await deleteChild(deleteMode.id);
      setChildren(children.filter(c => c.id !== deleteMode.id));
      toast.success('Child deleted successfully!');
    } catch (e) {
      toast.error(e.message || 'Failed to delete child');
    }
    setDeleteMode(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar userName={userName} />

      {/* Main Content */}

      {/* 🔹 Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
          <p className="text-gray-600">{comman.ProfileDes}</p>
        </div>

        {/* Children + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Children List */}
          <div className="lg:col-span-2 space-y-4">
            {/*  Child Card */}
            {children.length === 0 ? (
               <div className="p-6 text-center">
                  <p className="text-gray-500">No children added yet</p>
                </div>
            ): (
              children.map(child =>(
                <div key={child.id} className="bg-white rounded-lg shadow p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10  rounded-full flex items-center justify-center ${getRandomColor()}`}>
                        <span className="font-bold">{getInitials(child.name)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{child.name}</h3>
                        <span className="text-xs text-gray-500">{calculateAge(child.dob)}{comman.YearsOld}</span>
                        <p className="text-sm text-gray-500">{child.college}</p>
                        <p className="text-xs text-blue-600">Watch ID: {child.watchId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm mb-2">
                    <span className="text-gray-600">98.5%</span>
                    <span className="text-gray-600">24°C</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <p className="text-xs text-gray-400">Last updated 2 minutes ago</p>

                  {/* Edit & Delete Icon Buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick= {() => setEditMode(child)}
                      className="p-1 rounded-lg bg-white hover:bg-yellow-200 text-yellow-600 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteMode(child)}
                      className="p-1 rounded-lg bg-white hover:bg-red-200 text-red-600 transition-colors mr-1"
                      title="Delete"
                    >
                      <Trash2 size={21} />
                    </button>
                  </div>
                </div>
              ))
            )
            }

            {/* Add Child Button */}
            <button
              onClick={() => setIsAddChildOpen(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {comman.AddChildwithPlus}
            </button>

            {(isAddChildOpen || editMode ) && (
              <div className="fixed inset-0 flex items-center justify-center bg-transperant bg-opacity-50 z-50 backdrop-blur">
                <div className="bg-white rounded-lg shadow-lg box-shadow-xl w-full max-w-xl max-h-xl p-6 relative bg-cover bg-center">
                  <h2 className="text-lg font-bold mb-4">{isAddChildOpen ? comman.AddChild : comman.EditChild}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {isAddChildOpen ? comman.AddChildDes : comman.EditChildDes}
                  </p>

                  {/* Add Child Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Enter the name"
                      value={isAddChildOpen ? childName : editMode.name}
                      onChange={(e) => { isAddChildOpen ? setName(e.target.value) : setEditMode({...editMode, name:e.target.value}) }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Watch ID"
                      value={isAddChildOpen ? watchId : editMode.watchId}
                      onChange={(e) => { isAddChildOpen ? setWatchId(e.target.value) : setEditMode({...editMode, watchId:e.target.value}) }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                      disabled={!isAddChildOpen}
                    />
                    <input
                      type={dob ? "date" : "text"}
                      placeholder="Date Of Birth"
                      value={isAddChildOpen ? dob : formatDateForInput(editMode?.dob)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => !dob && (e.target.type = "text")}
                      onChange={(e) => {isAddChildOpen ? setDOB(e.target.value) : setEditMode({...editMode, dob:e.target.value}) }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="College"
                      value={isAddChildOpen ? college : editMode.college}
                      onChange={(e) => {isAddChildOpen ? setCollege(e.target.value) : setEditMode({...editMode, college:e.target.value}) }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-lg" 
                      value={isAddChildOpen ? childGender : editMode.gender} 
                      onChange={(e) => {isAddChildOpen ? setGender(e.target.value) : setEditMode({...editMode, gender:e.target.value}) }}
                      required>
                      <option value=""  hidden>{comman.Gender}</option>
                      <option value="Male">{comman.Male}</option>
                      <option value="Female">{comman.Female}</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Weight(kg)"
                      value={isAddChildOpen ? childWeight : editMode.weight}
                      onChange={(e) => {isAddChildOpen ? setWeight(e.target.value) : setEditMode({...editMode, weight:e.target.value}) }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Height(cm)"
                      value={isAddChildOpen ? childHeight : editMode.height}
                      onChange={(e) => {isAddChildOpen ? setHeight(e.target.value) : setEditMode({...editMode, height:e.target.value}) }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => {isAddChildOpen ? setIsAddChildOpen(false) : setEditMode(null)}}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      {comman.Cancel}
                    </button>
                    <button
                      onClick={  
                        // handle logic here
                        isAddChildOpen ?  addChildHandler : saveEditMode
                      }
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isAddChildOpen ? comman.Add : comman.Save}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/*Delete Child */}
            {deleteMode && deleteMode.id !== null && (
            <div className="absolute top-10 right-2 bg-white border border-gray-300 shadow-lg rounded-lg p-3 z-50 w-60">
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to delete <strong>{deleteMode.name}</strong>?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteMode(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  {comman.Cancel}
                </button>
                <button
                  onClick={() => deleteChildHandler()}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {comman.Delete}
                </button>
              </div>
            </div>
            )}

          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {comman.RecentAlerts}
            </h2>
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-700">Emma</p>
                <p className="text-sm text-red-600">SOS button triggered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-700">Liam</p>
                <p className="text-sm text-red-600">Left safe zone: Home</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm font-medium text-yellow-700">Emma</p>
                <p className="text-sm text-yellow-600">Low battery (62%)</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-700">Liam</p>
                <p className="text-sm text-red-600">
                  High temperature detected
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
