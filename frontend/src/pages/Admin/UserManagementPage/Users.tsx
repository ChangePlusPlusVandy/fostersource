import React, { useState, useEffect } from 'react';
import { FiEdit2, FiEye, FiTrash2, FiMic } from 'react-icons/fi';
import { US_STATES, COUNTRIES, TIMEZONES } from './locationData';
import { Pagination } from '../../../components/Pagination/Pagination';
import apiClient from '../../../services/apiClient';

interface User {
    _id?: string;
    id?: number; 
    firstName: string;
    lastName: string;
    name?: string;
    email: string;
    userType: string;
    company: string;
    addressLine?: string;
    city?: string;
    stateProvinceRegion?: string;
    state?: string;
    zipPostalCode?: string;
    zip?: string; 
    country?: string;
    phoneNumber?: string;
    phone?: string;
    timezone?: string;
    language: 'English' | 'Espanol';
    selected?: boolean;
}

interface UserForm {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    addressLine: string;
    city: string;
    stateProvinceRegion: string;
    zipPostalCode: string;
    country: string;
    phoneNumber: string;
    userType: string;
    timezone: string;
    language: 'English' | 'Espanol';
}

interface SpeakerProduct {
    title: string;
    onDemand: boolean;
}

const USER_TYPES = [
    'Foster Parent (Colorado)',
    'CASA',
    'County/CPA Worker',
    'Former FP/Adoptive Parent/Not currently fostering',
    'Foster Source Staff',
    'Teacher',
    'Speaker',
    'Foster Parent (Outside Colorado)',
    'Certified Kin Parent (Colorado)',
    'Certified Kin Parent (Outside Colorado)',
    'Non-certified Kin Parent (Colorado)',
    'Non-certified Kin Parent (Outside Colorado)',
    'New Mexico Misc.',
    'Foster Parent (New Mexico)',
    'Foster Source Admin'
];

const SPEAKER_PRODUCTS: SpeakerProduct[] = [
    { title: 'Connecting with Teens', onDemand: true },
    { title: 'Parenting Children with Attachment Struggles', onDemand: true },
    { title: 'Secondary Trauma', onDemand: true },
    { title: 'Socialization and COVID-19', onDemand: true }
];

const UserManagementPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('All');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [userForm, setUserForm] = useState<UserForm>({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        addressLine: '',
        city: '',
        stateProvinceRegion: '',
        zipPostalCode: '',
        country: '',
        phoneNumber: '',
        userType: '',
        timezone: '',
        language: 'English'
    });
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [currentSpeaker, setCurrentSpeaker] = useState<User | null>(null);
    
    useEffect(() => {
        fetchUsers();
    }, [currentPage, selectedUserType]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            
            const params = new URLSearchParams();
            
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            
            if (selectedUserType !== 'All') {
                params.append('userType', selectedUserType);
            }
            
            params.append('page', currentPage.toString());
            params.append('limit', itemsPerPage.toString());
            
            const response = await apiClient.get(`/users?${params.toString()}`);
            
            
            const mappedUsers = response.data.users.map((user: any) => ({
                _id: user._id,
                id: user._id,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ')[1] || '',
                name: user.name,
                email: user.email,
                userType: user.userType || '',
                company: user.company || '',
                addressLine: user.address1 || '',
                city: user.city || '',
                stateProvinceRegion: user.state || '',
                zipPostalCode: user.zip || '',
                country: user.country || '',
                phoneNumber: user.phone || '',
                selected: false
            }));
            
            setUsers(mappedUsers);
            setTotalUsers(response.data.total);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLanguageChange = (language: 'English' | 'Espanol') => {
        setUserForm(prev => ({
            ...prev,
            language
        }));
    };

    
    const formatUserForBackend = (userData: UserForm) => {
        return {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            userType: userData.userType,
            company: userData.company,
            address1: userData.addressLine,
            city: userData.city,
            state: userData.stateProvinceRegion,
            zip: userData.zipPostalCode,
            country: userData.country,
            phone: userData.phoneNumber,
            language: userData.language
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const backendUserData = formatUserForBackend(userForm);
            
            if (editingUserId) {
                
                await apiClient.put(`/users/${editingUserId}`, backendUserData);
                
                
                setUsers(prevUsers => 
                    prevUsers.map(user => user._id === editingUserId ? {
                        ...user,
                        firstName: userForm.firstName,
                        lastName: userForm.lastName,
                        name: `${userForm.firstName} ${userForm.lastName}`,
                        email: userForm.email,
                        userType: userForm.userType,
                        company: userForm.company,
                        addressLine: userForm.addressLine,
                        city: userForm.city,
                        stateProvinceRegion: userForm.stateProvinceRegion,
                        zipPostalCode: userForm.zipPostalCode,
                        country: userForm.country,
                        phoneNumber: userForm.phoneNumber
                    } : user)
                );
            } else {
                
                const response = await apiClient.post('/users', {
                    ...backendUserData,
                
                    role: userForm.userType.includes('Admin') ? 'staff' : 'user',
                });
                
                
                const newUser = {
                    _id: response.data.user._id,
                    id: response.data.user._id,
                    firstName: userForm.firstName,
                    lastName: userForm.lastName,
                    name: `${userForm.firstName} ${userForm.lastName}`,
                    email: userForm.email,
                    userType: userForm.userType,
                    company: userForm.company,
                    addressLine: userForm.addressLine,
                    city: userForm.city,
                    stateProvinceRegion: userForm.stateProvinceRegion,
                    zipPostalCode: userForm.zipPostalCode,
                    country: userForm.country,
                    phoneNumber: userForm.phoneNumber,
                    selected: false
                };
                
              
                fetchUsers();
            }
            
         
            setIsUserModalOpen(false);
            setEditingUserId(null);
            resetForm();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user. Please try again.');
        }
    };

    const resetForm = () => {
        setUserForm({
            firstName: '',
            lastName: '',
            email: '',
            company: '',
            addressLine: '',
            city: '',
            stateProvinceRegion: '',
            zipPostalCode: '',
            country: '',
            phoneNumber: '',
            userType: '',
            timezone: '',
            language: 'English'
        });
    };

    const handleEditUser = (user: User) => {
        setUserForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            company: user.company || '',
            addressLine: user.addressLine || '',
            city: user.city || '',
            stateProvinceRegion: user.stateProvinceRegion || '',
            zipPostalCode: user.zipPostalCode || '',
            country: user.country || '',
            phoneNumber: user.phoneNumber || '',
            userType: user.userType,
            timezone: user.timezone || '',
            language: user.language || 'English'
        });
        setEditingUserId(user._id || null);
        setIsUserModalOpen(true);
    };

    const openSpeakerModal = (user: User) => {
        setCurrentSpeaker(user);
        setIsSpeakerModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        try {
            await apiClient.delete(`/users/${id}`);
            
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        }
    };

    const toggleSelection = (id: string) => {
        setUsers(users.map(user => 
            user._id === id ? { ...user, selected: !user.selected } : user
        ));
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedCount} selected users?`)) {
            return;
        }
        
        const selectedIds = users.filter(user => user.selected).map(user => user._id);
        
        try {
           
            await Promise.all(selectedIds.map(id => id && apiClient.delete(`/users/${id}`)));
            
           
            setUsers(prevUsers => prevUsers.filter(user => !user.selected));
        } catch (error) {
            console.error('Error deleting selected users:', error);
            alert('Error deleting some users. Please try again.');
        }
    };

  
    const filteredUsers = searchTerm ? users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }) : users;

    const displayedUsers = filteredUsers;
    const selectedCount = users.filter(user => user.selected).length;

   
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    
    const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => {
        const [showTooltip, setShowTooltip] = useState(false);
        
        return (
            <div className="relative inline-block">
                <div 
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {children}
                </div>
                {showTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 z-10 whitespace-nowrap">
                        {text}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full p-6">
        
            <div className="bg-white rounded-lg shadow-sm p-6 w-full">


                <h1 className="text-2xl font-bold mb-6">Users</h1>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Name/Email/Company"
                                className="w-full px-4 py-2 border rounded-md pr-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <select
                            value={selectedUserType}
                            onChange={(e) => setSelectedUserType(e.target.value)}
                            className="px-4 py-2 border rounded-md bg-white min-w-[150px]"
                        >
                            <option value="All">All</option>
                            {USER_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <button 
                            onClick={() => {
                                resetForm();
                                setEditingUserId(null);
                                setIsUserModalOpen(true);
                            }}
                            className="px-4 py-1.5 bg-[#7b499a] text-white rounded-md hover:bg-[#6a3e85] transition-colors flex items-center gap-2"
                        >
                            <span>New User</span>
                        </button>
                    </div>
                </div>

                
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-8 px-6 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedCount > 0 && selectedCount === displayedUsers.length}
                                        onChange={() => {
                                            const allSelected = selectedCount === displayedUsers.length;
                                            setUsers(users.map(user => ({
                                                ...user,
                                                selected: displayedUsers.includes(user) ? !allSelected : user.selected
                                            })));
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">User Type</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Company</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">Loading...</td>
                                </tr>
                            ) : displayedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No users found</td>
                                </tr>
                            ) : (
                                displayedUsers.map((user) => (
                                    <tr key={user.id} className={`hover:bg-gray-50 ${user.selected ? 'bg-purple-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={user.selected}
                                                onChange={() => toggleSelection(String(user.id))}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{`${user.firstName} ${user.lastName}`}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.userType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.company}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3">
                                                <Tooltip text="Edit">
                                                    <button 
                                                        className="text-gray-600 hover:text-gray-900"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <FiEdit2 className="w-5 h-5" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip text="Login">
                                                    <button className="text-gray-600 hover:text-gray-900">
                                                        <FiEye className="w-5 h-5" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip text="Voice Products">
                                                    <button 
                                                        className="text-gray-600 hover:text-gray-900"
                                                        onClick={() => openSpeakerModal(user)}
                                                    >
                                                        <FiMic className="w-5 h-5" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip text="Delete">
                                                    <button 
                                                        className="text-gray-600 hover:text-gray-900"
                                                        onClick={() => handleDelete(String(user.id))}
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                </div>

            
            <div className="flex items-center justify-between mt-6">
                {selectedCount > 0 && (
                    <div className="flex items-center gap-4">
                        <span className="text-purple-600">{selectedCount} Selected</span>
                        <button
                            onClick={handleDeleteSelected}
                            className="text-red-600 font-medium hover:text-red-700"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}
                <div className="ml-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingUserId ? 'Edit User' : 'New User'}</h2>
                            <button 
                                onClick={() => setIsUserModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-semibold mb-4">User Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={userForm.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userForm.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-1">
                                    Company <span>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={userForm.company}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-1">
                                    Address Line <span>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="addressLine"
                                    value={userForm.addressLine}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">
                                        City <span>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={userForm.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">
                                        State/Province/Region <span>(optional)</span>
                                    </label>
                                    <select
                                        name="stateProvinceRegion"
                                        value={userForm.stateProvinceRegion}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="">Choose a State</option>
                                        {US_STATES.map(state => (
                                            <option key={state.value} value={state.value}>
                                                {state.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">
                                        ZIP/Postal Code <span>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="zipPostalCode"
                                        value={userForm.zipPostalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">
                                        Country <span>(optional)</span>
                                    </label>
                                    <select
                                        name="country"
                                        value={userForm.country}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="">Choose a Country</option>
                                        {COUNTRIES.map(country => (
                                            <option key={country.value} value={country.value}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-1">
                                    Phone Number <span>(optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={userForm.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-1">User Type</label>
                                <select
                                    name="userType"
                                    value={userForm.userType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Choose a User Type</option>
                                    {USER_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-1">
                                    Timezone <span>(optional)</span>
                                </label>
                                <select
                                    name="timezone"
                                    value={userForm.timezone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="">Choose a Timezone</option>
                                    {TIMEZONES.map(timezone => (
                                        <option key={timezone.value} value={timezone.value}>
                                            {timezone.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm text-gray-500 mb-2">Language:</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={userForm.language === 'English'}
                                            onChange={() => handleLanguageChange('English')}
                                            className="mr-2"
                                        />
                                        English
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={userForm.language === 'Espanol'}
                                            onChange={() => handleLanguageChange('Espanol')}
                                            className="mr-2"
                                        />
                                        Español
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#7b499a] text-white rounded-md hover:bg-[#6a3e85] transition-colors"
                                    
                                >
                                    {editingUserId ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

         
            {isSpeakerModalOpen && currentSpeaker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Speaker Products</h2> 
                            <button 
                                onClick={() => setIsSpeakerModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <ul className="text-sm">
                            {SPEAKER_PRODUCTS.map((product, index) => (
                                <li key={index} className="py-2 flex items-baseline">
                                    <span className="text-purple-600 mr-2">•</span>
                                    {product.title} - On Demand
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;