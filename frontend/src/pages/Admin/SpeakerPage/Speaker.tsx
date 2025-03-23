import React, { useState, useEffect, useRef } from 'react';
import speakerImage from './images/speaker-image.png';
import apiClient from '../../../services/apiClient';

interface Speaker {
  _id?: string;
  name: string;
  title: string;
  email: string;
  company: string;
  bio: string;
  disclosures?: string;
  image?: any;
}

type FieldName = 'name' | 'company' | 'title' | 'email' | 'bio';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker | null>(null);
  const [newSpeaker, setNewSpeaker] = useState<Speaker>({
    name: '',
    title: '',
    email: '',
    company: '',
    bio: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);

  const inputRefs: {
    name: React.RefObject<HTMLInputElement>;
    company: React.RefObject<HTMLInputElement>;
    title: React.RefObject<HTMLInputElement>;
    email: React.RefObject<HTMLInputElement>;
  } = {
    name: useRef<HTMLInputElement>(null),
    company: useRef<HTMLInputElement>(null),
    title: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  };

  const textareaRefs: {
    bio: React.RefObject<HTMLTextAreaElement>;
  } = {
    bio: useRef<HTMLTextAreaElement>(null),
  };


  useEffect(() => {
    if (!focusedField) return;
    
    // Check if it's an input field
    if (focusedField === 'name' || focusedField === 'company' || 
        focusedField === 'title' || focusedField === 'email') {
      const input = inputRefs[focusedField].current;
      if (input) {
        input.focus();
        
        // Only call setSelectionRange on text inputs, not email inputs
        if (input.type !== 'email' && 'setSelectionRange' in input) {
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }
      }
    }
    // Check if it's a textarea
    else if (focusedField === 'bio') {
      const textarea = textareaRefs[focusedField].current;
      if (textarea) {
        const length = textarea.value.length;
        textarea.focus();
        textarea.setSelectionRange(length, length);
      }
    }
}, [focusedField, newSpeaker, currentSpeaker]);

  // Fetch speakers on component mount
  useEffect(() => {
    fetchSpeakers();
  }, []);

  

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      console.log("Fetching speakers from API...");
      const response = await apiClient.get('/speakers');
      console.log("API response:", response);
      console.log("Speakers data:", response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setSpeakers(response.data);
      } else {
        console.warn("No speakers found or data is not an array");
        // Add fallback data if needed
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error details:", err);
      setError('Failed to fetch speakers');
      setLoading(false);
    }
  };

  const handleEditClick = (speaker: Speaker) => {
    setCurrentSpeaker(speaker);
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isNew = false) => {
    const { name, value } = e.target;
    
    // Cast to FieldName
    if (name === 'name' || name === 'company' || name === 'title' || 
        name === 'email' || name === 'bio') {
      setFocusedField(name);
    }
    
    if (isNew) {
      setNewSpeaker(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (currentSpeaker) {
      // Add explicit non-null check and type assertion
      setCurrentSpeaker(prev => {
        if (prev === null) return null;
        
        return {
          ...prev,
          [name]: value
        } as Speaker; // Add type assertion here
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isNew = false) => {
    if (e.target.files && e.target.files[0]) {
      if (isNew) {
        setNewImageFile(e.target.files[0]);
      } else {
        setImageFile(e.target.files[0]);
      }
    }
  };
  

  const handleRemoveSpeaker = async (speakerId: string | undefined) => {
    if (!speakerId) return;
    
    try {
      await apiClient.delete(`/speakers/${speakerId}`);
      setSpeakers(speakers.filter(s => s._id !== speakerId));
    } catch (err) {
      console.error('Error removing speaker:', err);
    }
  };

  const handleUpdateSpeaker = async () => {
    if (!currentSpeaker || !currentSpeaker._id) return;
  
    try {
      const formData = new FormData();
  
      Object.entries(currentSpeaker).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value.toString());
        }
      });
  
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      const response = await apiClient.put(`/speakers/${currentSpeaker._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      setSpeakers(speakers.map(s => s._id === currentSpeaker._id ? response.data : s));
      setShowEditModal(false);
      setCurrentSpeaker(null);
      setImageFile(null);
    } catch (err) {
      console.error("Error updating speaker:", err);
    }
  };
  

  const handleAddSpeaker = async () => {
    try {
      if (!newSpeaker.name || !newSpeaker.title || !newSpeaker.email || 
          !newSpeaker.company || !newSpeaker.bio) {
        alert("Please fill out all required fields");
        return;
      }
  
      const formData = new FormData();
  
      Object.entries(newSpeaker).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value.toString());
        }
      });
  
      if (newImageFile) {
        formData.append("image", newImageFile);
      }
  
      const response = await apiClient.post("/speakers", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      setSpeakers([...speakers, response.data.speaker]);
      setShowAddModal(false);
      setNewSpeaker({ name: "", title: "", email: "", company: "", bio: "", disclosures: "" });
      setNewImageFile(null);
    } catch (err) {
      console.error("Error adding speaker:", err);
    }
  };
  
  const handleEmailSpeaker = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const SpeakerFormModal = ({ isAdd = false }) => {
    const speaker = isAdd ? newSpeaker : currentSpeaker;
    if (!speaker) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-6">{isAdd ? 'Add Speaker' : 'Edit Speaker'}</h2>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              ref={inputRefs.name}
              type="text"
              name="name"
              value={speaker.name}
              onChange={(e) => handleInputChange(e, isAdd)}
              onFocus={() => setFocusedField('name')}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Company</label>
            <input
              ref={inputRefs.company}
              type="text"
              name="company"
              value={speaker.company}
              onChange={(e) => handleInputChange(e, isAdd)}
              onFocus={() => setFocusedField('company')}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title/Position</label>
            <input
              ref={inputRefs.title}
              type="text"
              name="title"
              value={speaker.title}
              onChange={(e) => handleInputChange(e, isAdd)}
              onFocus={() => setFocusedField('title')}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              ref={inputRefs.email}
              type="email"
              name="email"
              value={speaker.email}
              onChange={(e) => handleInputChange(e, isAdd)}
              onFocus={() => setFocusedField('email')}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              ref={textareaRefs.bio}
              name="bio"
              value={speaker.bio}
              onChange={(e) => handleInputChange(e, isAdd)}
              onFocus={() => setFocusedField('bio')}
              className="w-full px-3 py-2 border rounded-md h-24"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-1 font-medium">Speaker Image</label>
            <div className="border border-dashed rounded-md p-4 text-center">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="text-sm mt-1">Choose a file or drag & drop it here</p>
              <p className="text-xs text-gray-500">JPEG or PNG format, up to 5MB</p>
              <input
                type="file"
                className="hidden"
                ref={isAdd ? addFileInputRef : fileInputRef}
                onChange={(e) => handleImageChange(e, isAdd)}
                accept="image/jpeg,image/png"
              />
              <button
                className="text-sm px-4 py-1 mt-2 border rounded-md"
                onClick={() => isAdd ? addFileInputRef.current?.click() : fileInputRef.current?.click()}
              >
                Browse Files
              </button>
              {(isAdd ? newImageFile : imageFile) && (
                <p className="text-sm text-green-600 mt-1">
                  {isAdd ? newImageFile?.name : imageFile?.name} selected
                </p>
              )}
            </div>
          </div>

          
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border rounded-md"
              onClick={() => {
                if (isAdd) {
                  setShowAddModal(false);
                  setNewSpeaker({
                    name: '',
                    title: '',
                    email: '',
                    company: '',
                    bio: '',
                    disclosures: ''
                  });
                } else {
                  setShowEditModal(false);
                  setCurrentSpeaker(null);
                }
              }}
            >
              Exit
            </button>
            <button
              className="px-4 py-2 bg-[#8757a3] text-white rounded-md"
              onClick={isAdd ? handleAddSpeaker : handleUpdateSpeaker}
            >
              Save and Exit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Speakers</h1>
          <button 
            className="bg-[#8757a3] text-white px-6 py-2 rounded-lg hover:opacity-90"
            onClick={() => setShowAddModal(true)}
          >
            Add Speaker
          </button>
        </div>

        {/* Speakers List */}
        {loading ? (
          <div className="text-center py-8">Loading speakers...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : speakers.length === 0 ? (
          <div className="text-center py-8">No speakers found. Add a speaker to get started.</div>
        ) : (
          <div className="space-y-4">
            {speakers.map((speaker) => (
              <div key={speaker._id} className="bg-white rounded-lg border p-6">
                <div className="flex gap-6">
                  {/* Speaker Image */}
                  <div className="w-48 h-48 flex-shrink-0">
                  <img 
                    src={speaker.image ? speaker.image : speakerImage} 
                    alt={speaker.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      console.log("Image failed to load:", e.currentTarget.src);
                      e.currentTarget.src = speakerImage; // Fallback to default image
                    }}
                  />
                  </div>

                  {/* Speaker Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-1">{speaker.name}</h2>
                    <h3 className="text-lg text-gray-600 mb-3">{speaker.company}</h3>
                    <p className="text-gray-700 mb-4">{speaker.bio}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button 
                        className="bg-[#8757a3] text-white px-6 py-2 rounded-lg hover:opacity-90"
                        onClick={() => handleEditClick(speaker)}
                      >
                        Edit Speaker Info
                      </button>
                      <button 
                        className="border border-[#8757a3] text-[#8757a3] px-6 py-2 rounded-lg hover:bg-gray-50"
                        onClick={() => handleEmailSpeaker(speaker.email)}
                      >
                        Email Speaker
                      </button>
                      <button 
                        className="text-[#8757a3] hover:underline"
                        onClick={() => handleRemoveSpeaker(speaker._id)}
                      >
                        Remove Speaker
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Speaker Modal */}
      {showEditModal && <SpeakerFormModal isAdd={false} />}
      
      {/* Add Speaker Modal */}
      {showAddModal && <SpeakerFormModal isAdd={true} />}
    </div>
  );
}