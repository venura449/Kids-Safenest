import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Home, 
  CheckSquare, 
  Heart, 
  Calendar, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Menu,
  X,
  CloudRain,
  Sun,
  Star,
  Moon,
  Clock,
  Activity,
  Droplets // New icon for period tracking
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { comman } from './en/comman';
import { fetchMenstruation, saveProfile, addSymptom, addMood } from '../services/menstruationService';

export default function MenstruationPage() {
  const [userName, setUserName] = useState('User');
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriod, setLastPeriod] = useState('2024-01-01');
  const [currentPhase, setCurrentPhase] = useState('follicular');
  const [cycleDay, setCycleDay] = useState(15);
  const [moods, setMoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState({ symptom: '', severity: 'mild', notes: '', date: new Date().toISOString().split('T')[0] });
  const [newMood, setNewMood] = useState({ mood: 'happy', energy: 5, notes: '', date: new Date().toISOString().split('T')[0] });
  const [moodTracking, setMoodTracking] = useState([]);

  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();

  // Calculate current cycle day and phase based on last period date
  const calculateCycleInfo = (lastPeriodDate, cycleLengthDays) => {
    const lastPeriod = new Date(lastPeriodDate);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    
    // Calculate current cycle day (1-based)
    const currentCycleDay = (daysSinceLastPeriod % cycleLengthDays) + 1;
    
    // Determine current phase based on cycle day
    let currentPhase;
    if (currentCycleDay <= 5) {
      currentPhase = 'menstrual';
    } else if (currentCycleDay <= 14) {
      currentPhase = 'follicular';
    } else if (currentCycleDay <= 16) {
      currentPhase = 'ovulation';
    } else {
      currentPhase = 'luteal';
    }
    
    return { currentCycleDay, currentPhase };
  };

  // Calculate next period date
  const calculateNextPeriod = (lastPeriodDate, cycleLengthDays) => {
    const lastPeriod = new Date(lastPeriodDate);
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + cycleLengthDays);
    return nextPeriod;
  };

  // Calculate fertility window
  const calculateFertilityWindow = (lastPeriodDate, cycleLengthDays) => {
    const lastPeriod = new Date(lastPeriodDate);
    const ovulationDate = new Date(lastPeriod);
    ovulationDate.setDate(lastPeriod.getDate() + 14); // Typically ovulation occurs around day 14
    
    const today = new Date();
    const daysUntilOvulation = Math.floor((ovulationDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilOvulation >= -2 && daysUntilOvulation <= 2) {
      return { status: 'High', description: 'Ovulation likely', color: 'text-green-600' };
    } else if (daysUntilOvulation > 2 && daysUntilOvulation <= 7) {
      return { status: 'Medium', description: 'Approaching ovulation', color: 'text-yellow-600' };
    } else {
      return { status: 'Low', description: 'Not fertile', color: 'text-gray-600' };
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.log('Could not decode token, using default name');
      }
    }
    loadMenstruationData();
  }, []);

  const loadMenstruationData = async () => {
    try {
      const data = await fetchMenstruation();
      if (data.profile) {
        const profileCycleLength = data.profile.cycle_length || 28;
        const profileLastPeriod = data.profile.last_period || '2024-01-01';
        
        setCycleLength(profileCycleLength);
        setLastPeriod(profileLastPeriod);
        
        // Calculate current cycle day and phase
        const { currentCycleDay, currentPhase } = calculateCycleInfo(profileLastPeriod, profileCycleLength);
        setCycleDay(currentCycleDay);
        setCurrentPhase(currentPhase);
      }
      setSymptoms(data.symptoms || []);
      setMoodTracking(data.moods || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load menstruation data');
    }
  };

  const saveProfileData = async () => {
    try {
      await saveProfile({
        cycleLength: cycleLength,
        lastPeriod: lastPeriod
      });
      setShowProfileForm(false);
      toast.success('Profile saved successfully!');
      loadMenstruationData(); // This will recalculate cycle info
    } catch (e) {
      console.error(e);
      toast.error('Failed to save profile');
    }
  };

  const addSymptomData = async () => {
    if (newSymptom.symptom) {
      try {
        const created = await addSymptom({
          symptom: newSymptom.symptom,
          severity: newSymptom.severity,
          notes: newSymptom.notes,
          date: newSymptom.date,
          phase: getCurrentPhase()
        });
        setSymptoms([created, ...symptoms]);
        setNewSymptom({ symptom: '', severity: 'mild', notes: '', date: new Date().toISOString().split('T')[0] });
        setShowSymptomForm(false);
        toast.success('Symptom added successfully!');
      } catch (e) {
        console.error(e);
        toast.error('Failed to add symptom');
      }
    }
  };

  const addMoodData = async () => {
    try {
      const created = await addMood({
        mood: newMood.mood,
        energy: newMood.energy,
        notes: newMood.notes,
        date: newMood.date
      });
      setMoodTracking([created, ...moodTracking]);
      setNewMood({ mood: 'happy', energy: 5, notes: '', date: new Date().toISOString().split('T')[0] });
      setShowMoodForm(false);
      toast.success('Mood recorded successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to record mood');
    }
  };

  const getCurrentPhase = () => {
    return currentPhase;
  };

  const getPhaseInfo = (phase) => {
    switch (phase) {
      case 'menstrual':
        return { name: 'Menstrual Phase', color: 'bg-red-100 text-red-800', icon: CloudRain };
      case 'follicular':
        return { name: 'Follicular Phase', color: 'bg-green-100 text-green-800', icon: Sun };
      case 'ovulation':
        return { name: 'Ovulation Phase', color: 'bg-yellow-100 text-yellow-800', icon: Star };
      case 'luteal':
        return { name: 'Luteal Phase', color: 'bg-purple-100 text-purple-800', icon: Moon };
      default:
        return { name: 'Unknown Phase', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'text-green-600 bg-green-100';
      case 'sad': return 'text-blue-600 bg-blue-100';
      case 'irritable': return 'text-red-600 bg-red-100';
      case 'tired': return 'text-gray-600 bg-gray-100';
      case 'energetic': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculate dynamic values
  const nextPeriodDate = calculateNextPeriod(lastPeriod, cycleLength);
  const fertilityInfo = calculateFertilityWindow(lastPeriod, cycleLength);
  const currentPhaseInfo = getPhaseInfo(currentPhase);
  const PhaseIcon = currentPhaseInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar userName={userName}/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{comman.CycleTracker}</h1>
          <p className="text-sm sm:text-base text-gray-600">{comman.TrackCycle}, {userName}!</p>
        </div>

        {/* Cycle Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{comman.CurrentPhase}</p>
                <p className="text-lg font-bold text-gray-900">{currentPhaseInfo.name}</p>
                <p className="text-xs text-gray-500">Day {cycleDay}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${currentPhaseInfo.color}`}>
                <PhaseIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{comman.CycleLength}</p>
                <p className="text-2xl font-bold text-gray-900">{cycleLength}</p>
                <p className="text-xs text-gray-500">{comman.DaysAverage}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{comman.NextPeriod}</p>
                <p className="text-lg font-bold text-gray-900">
                  {nextPeriodDate.toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">{comman.Predicted}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{comman.FertilityWindow}</p>
                <p className="text-lg font-bold text-gray-900">{fertilityInfo.status}</p>
                <p className={`text-xs ${fertilityInfo.color}`}>{fertilityInfo.description}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{comman.PredictionSettings}</h2>
            <button 
              onClick={() => setShowProfileForm(!showProfileForm)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          
          {showProfileForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-3">{comman.UpdateDetails}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{comman.CycleLength} (days)</label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="20"
                    max="40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{comman.LastPeriod}</label>
                  <input
                    type="date"
                    value={lastPeriod}
                    onChange={(e) => setLastPeriod(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfileData}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">{comman.CycleLength}</p>
              <p className="text-lg font-bold text-gray-900">{cycleLength} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{comman.LastPeriod}</p>
              <p className="text-lg font-bold text-gray-900">{new Date(lastPeriod).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cycle Calendar and Symptoms */}
          <div className="space-y-6">
            {/* Cycle Calendar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{comman.CycleCalendar}</h2>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i + 1;
                  const isCurrentDay = day === cycleDay;
                  
                  // Calculate period days based on actual cycle
                  const periodStartDay = 1;
                  const periodEndDay = 5;
                  const isPeriodDay = day >= periodStartDay && day <= periodEndDay;
                  
                  // Calculate ovulation days (typically days 14-16)
                  const ovulationStartDay = 14;
                  const ovulationEndDay = 16;
                  const isOvulationDay = day >= ovulationStartDay && day <= ovulationEndDay;
                  
                  let bgColor = 'bg-gray-50';
                  let textColor = 'text-gray-600';
                  
                  if (isCurrentDay) {
                    bgColor = 'bg-blue-500';
                    textColor = 'text-white';
                  } else if (isPeriodDay) {
                    bgColor = 'bg-red-100';
                    textColor = 'text-red-600';
                  } else if (isOvulationDay) {
                    bgColor = 'bg-yellow-100';
                    textColor = 'text-yellow-600';
                  }
                  
                  return (
                    <div
                      key={day}
                      className={`${bgColor} ${textColor} rounded-lg p-2 text-center text-sm font-medium`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span>{comman.Period}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                  <span>{comman.Ovulation}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>{comman.Today}</span>
                </div>
              </div>
            </div>



            {/* Symptoms Tracking */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{comman.Symptoms}</h2>
                <button 
                  onClick={() => setShowSymptomForm(!showSymptomForm)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showSymptomForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Add Symptom</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Symptom</label>
                      <input
                        type="text"
                        value={newSymptom.symptom}
                        onChange={(e) => setNewSymptom({...newSymptom, symptom: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., cramps, bloating"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                      <select
                        value={newSymptom.severity}
                        onChange={(e) => setNewSymptom({...newSymptom, severity: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newSymptom.date}
                      onChange={(e) => setNewSymptom({...newSymptom, date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={newSymptom.notes}
                      onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="Additional details about the symptom"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowSymptomForm(false)}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addSymptomData}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {symptoms.map(symptom => (
                  <div key={symptom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{symptom.symptom}</p>
                      <p className="text-sm text-gray-600">{symptom.notes}</p>
                      <p className="text-xs text-gray-500">{new Date(symptom.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                      {symptom.severity}
                    </span>
                  </div>
                ))}
                {symptoms.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No symptoms recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Mood Tracking and Insights */}
          <div className="space-y-6">
            {/* Mood Tracking */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Mood Tracking</h2>
                <button 
                  onClick={() => setShowMoodForm(!showMoodForm)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showMoodForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Add Mood</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                      <select
                        value={newMood.mood}
                        onChange={(e) => setNewMood({...newMood, mood: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="irritable">Irritable</option>
                        <option value="tired">Tired</option>
                        <option value="energetic">Energetic</option>
                        <option value="anxious">Anxious</option>
                        <option value="calm">Calm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Energy Level (1-10)</label>
                      <input
                        type="number"
                        value={newMood.energy}
                        onChange={(e) => setNewMood({...newMood, energy: parseInt(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newMood.date}
                      onChange={(e) => setNewMood({...newMood, date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={newMood.notes}
                      onChange={(e) => setNewMood({...newMood, notes: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="How are you feeling today?"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowMoodForm(false)}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addMoodData}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {moodTracking.map(mood => (
                  <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMoodColor(mood.mood)}`}>
                        {mood.mood.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{mood.mood}</p>
                        <p className="text-sm text-gray-600">Energy: {mood.energy}/10</p>
                        {mood.notes && <p className="text-xs text-gray-500">{mood.notes}</p>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(mood.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {moodTracking.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No mood entries recorded yet.</p>
                )}
              </div>
            </div>

                         {/* Health Insights */}
             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h2>
               <div className="space-y-4">
                 {currentPhase === 'follicular' && (
                   <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                         <Activity className="w-4 h-4 text-blue-600" />
                       </div>
                       <div>
                         <p className="font-medium text-blue-900">High Energy Phase</p>
                         <p className="text-sm text-blue-700">You're in your follicular phase - great time for exercise and new projects!</p>
                       </div>
                     </div>
                   </div>
                 )}
                 
                 {currentPhase === 'ovulation' && (
                   <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                         <Heart className="w-4 h-4 text-green-600" />
                       </div>
                       <div>
                         <p className="font-medium text-green-900">Fertility Peak</p>
                         <p className="text-sm text-green-700">You're in your ovulation phase - peak fertility window!</p>
                       </div>
                     </div>
                   </div>
                 )}
                 
                 {currentPhase === 'luteal' && (
                   <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                         <Moon className="w-4 h-4 text-purple-600" />
                       </div>
                       <div>
                         <p className="font-medium text-purple-900">Luteal Phase</p>
                         <p className="text-sm text-purple-700">PMS symptoms may appear - practice self-care and rest</p>
                       </div>
                     </div>
                   </div>
                 )}
                 
                 {currentPhase === 'menstrual' && (
                   <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                         <CloudRain className="w-4 h-4 text-red-600" />
                       </div>
                       <div>
                         <p className="font-medium text-red-900">Menstrual Phase</p>
                         <p className="text-sm text-red-700">Take it easy during your period - focus on rest and comfort</p>
                       </div>
                     </div>
                   </div>
                 )}
                 
                 <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                   <div className="flex items-start space-x-3">
                     <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                       <Calendar className="w-4 h-4 text-yellow-600" />
                     </div>
                     <div>
                       <p className="font-medium text-yellow-900">Cycle Day {cycleDay}</p>
                       <p className="text-sm text-yellow-700">You're on day {cycleDay} of your {cycleLength}-day cycle</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Tips and Education */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cycle Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Follicular Phase</p>
                <p className="text-sm text-gray-600">Days 6-14: Rising energy, creativity peaks</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ovulation</p>
                <p className="text-sm text-gray-600">Days 14-16: Peak fertility, high energy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Moon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Luteal Phase</p>
                <p className="text-sm text-gray-600">Days 17-28: PMS symptoms may appear</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}