import React, { useState, useEffect } from 'react';
import { Search, Edit2, Download, X } from 'lucide-react';
import { Course } from '../../../shared/types/course';
import { User } from '../../../shared/types/user';
import { Progress } from '../../../shared/types/progress';
import apiClient from '../../../services/apiClient';
import { format } from 'date-fns';
import Select from 'react-select/async';

interface UserProgress {
  user: User;
  course: Course;
  isComplete: boolean;
  completedComponents: {
    webinar?: boolean;
    survey?: boolean;
    certificate?: boolean;
  };
  dateCompleted?: Date;
  registeredDate?: Date;
}

interface CourseOption {
  value: string;
  label: string;
  course: Course;
}

interface EditProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSave: (updatedProgress: UserProgress) => void;
}

const EditProgressModal: React.FC<EditProgressModalProps> = ({ isOpen, onClose, progress, onSave }) => {
  const [editedProgress, setEditedProgress] = useState<UserProgress>(progress);

  // Update local state when progress prop changes
  useEffect(() => {
    setEditedProgress(progress);
  }, [progress]);

  if (!isOpen) return null;

  const handleComponentChange = (component: 'webinar' | 'survey' | 'certificate', checked: boolean) => {
    const updatedProgress = {
      ...editedProgress,
      completedComponents: {
        ...editedProgress.completedComponents,
        [component]: checked
      }
    };
    
    setEditedProgress(updatedProgress);
    // Immediately save changes
    onSave(updatedProgress);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1 flex-1">
            <h2 className="text-xl font-semibold">Edit User Progress</h2>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Product: </span>
                {progress.course.className}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">User: </span>
                {progress.user.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-20 text-sm">Webinar</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editedProgress.completedComponents.webinar}
                  onChange={(e) => handleComponentChange('webinar', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Done?</span>
              </label>
            </div>

            <div className="flex items-center">
              <span className="w-20 text-sm">Survey</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editedProgress.completedComponents.survey}
                  onChange={(e) => handleComponentChange('survey', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Done?</span>
              </label>
            </div>

            <div className="flex items-center">
              <span className="w-20 text-sm">Certificate</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editedProgress.completedComponents.certificate}
                  onChange={(e) => handleComponentChange('certificate', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Done?</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for testing
const mockCourses = [
  {
    _id: '67acf95247f5d8867107e887',
    className: 'Introduction to Philosophy',
    discussion: '',
    cost: 0,
    instructorName: '',
    instructorDescription: '',
    instructorRole: '',
    lengthCourse: 0,
    time: new Date(),
    isInPerson: false,
    isLive: false,
    categories: [],
    creditNumber: 0,
    courseDescription: '',
    thumbnailPath: '',
    students: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15', 'user16', 'user17', 'user18', 'user19', 'user20'],
    regStart: new Date(),
    regEnd: new Date(),
    handouts: [],
    ratings: [],
    components: []
  },
  {
    _id: '67acf95247f5d8867107e888',
    className: 'Advanced Mathematics',
    discussion: '',
    cost: 0,
    instructorName: '',
    instructorDescription: '',
    instructorRole: '',
    lengthCourse: 0,
    time: new Date(),
    isInPerson: false,
    isLive: false,
    categories: [],
    creditNumber: 0,
    courseDescription: '',
    thumbnailPath: '',
    students: ['user3', 'user4', 'user5'],
    regStart: new Date(),
    regEnd: new Date(),
    handouts: [],
    ratings: [],
    components: []
  }
];

const mockUsers = [
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase1',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase2',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'staff' as const,
    firebaseId: 'firebase3',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase4',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase5',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user6',
    name: 'Diana Miller',
    email: 'diana@example.com',
    role: 'staff' as const,
    firebaseId: 'firebase6',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user7',
    name: 'Edward Davis',
    email: 'edward@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase7',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user8',
    name: 'Fiona Garcia',
    email: 'fiona@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase8',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user9',
    name: 'George Martinez',
    email: 'george@example.com',
    role: 'staff' as const,
    firebaseId: 'firebase9',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user10',
    name: 'Hannah Lee',
    email: 'hannah@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase10',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user11',
    name: 'Ian Thompson',
    email: 'ian@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase11',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user12',
    name: 'Julia White',
    email: 'julia@example.com',
    role: 'staff' as const,
    firebaseId: 'firebase12',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user13',
    name: 'Kevin Harris',
    email: 'kevin@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase13',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user14',
    name: 'Lisa Clark',
    email: 'lisa@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase14',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user15',
    name: 'Michael Lewis',
    email: 'michael@example.com',
    role: 'staff' as const,
    firebaseId: 'firebase15',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user16',
    name: 'Nancy Young',
    email: 'nancy@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase16',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user17',
    name: 'Oscar Allen',
    email: 'oscar@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase17',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user18',
    name: 'Patricia King',
    email: 'patricia@example.com',
    role: 'staff' as const,
    firebaseId: 'firebase18',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user19',
    name: 'Quentin Wright',
    email: 'quentin@example.com',
    role: 'foster parent' as const,
    firebaseId: 'firebase19',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  },
  {
    _id: 'user20',
    name: 'Rachel Scott',
    email: 'rachel@example.com',
    role: 'certified kin' as const,
    firebaseId: 'firebase20',
    isColorado: true,
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    certification: '',
    cart: [],
    progress: [],
    payments: []
  }
];

const mockProgress = [
  {
    user: 'user1',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: true,
      survey: false,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-01')
  },
  {
    user: 'user2',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01')
  },
  {
    user: 'user3',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: false,
      survey: true,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-02')
  },
  {
    user: 'user4',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-16'),
    createdAt: new Date('2024-01-02')
  },
  {
    user: 'user5',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: true,
      survey: false,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-03')
  },
  {
    user: 'user6',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-17'),
    createdAt: new Date('2024-01-03')
  },
  {
    user: 'user7',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: false,
      survey: true,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-04')
  },
  {
    user: 'user8',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-18'),
    createdAt: new Date('2024-01-04')
  },
  {
    user: 'user9',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: true,
      survey: false,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-05')
  },
  {
    user: 'user10',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-19'),
    createdAt: new Date('2024-01-05')
  },
  {
    user: 'user11',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: false,
      survey: true,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-06')
  },
  {
    user: 'user12',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-20'),
    createdAt: new Date('2024-01-06')
  },
  {
    user: 'user13',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: true,
      survey: false,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-07')
  },
  {
    user: 'user14',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-21'),
    createdAt: new Date('2024-01-07')
  },
  {
    user: 'user15',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: false,
      survey: true,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-08')
  },
  {
    user: 'user16',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-22'),
    createdAt: new Date('2024-01-08')
  },
  {
    user: 'user17',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: true,
      survey: false,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-09')
  },
  {
    user: 'user18',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-23'),
    createdAt: new Date('2024-01-09')
  },
  {
    user: 'user19',
    course: '67acf95247f5d8867107e887',
    isComplete: false,
    completedComponents: {
      webinar: false,
      survey: true,
      certificate: false
    },
    dateCompleted: undefined,
    createdAt: new Date('2024-01-10')
  },
  {
    user: 'user20',
    course: '67acf95247f5d8867107e887',
    isComplete: true,
    completedComponents: {
      webinar: true,
      survey: true,
      certificate: true
    },
    dateCompleted: new Date('2024-01-24'),
    createdAt: new Date('2024-01-10')
  }
];

const ProductProgressReport: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('All');
  const [excludeFinished, setExcludeFinished] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [allCourses, setAllCourses] = useState<CourseOption[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<UserProgress | null>(null);

  // Load courses from mock data
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const courses = mockCourses.map(course => ({
          value: course._id,
          label: course.className,
          course: course
        }));
        setAllCourses(courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setAllCourses([]);
      }
    };

    fetchAllCourses();
  }, []);

  // Load course options with search
  const loadCourseOptions = async (inputValue: string) => {
    if (!inputValue) {
      return allCourses;
    }

    const filteredCourses = allCourses.filter(course =>
      course.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filteredCourses;
  };

  // Fetch progress from mock data
  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const mockCourse = mockCourses.find(c => c._id === selectedCourse?.value);
      const mockEnrolledUsers = mockUsers.filter(u => mockCourse?.students.includes(u._id || ''));
      const mockCourseProgress = mockProgress.filter(p => p.course === selectedCourse?.value);
      
      const combinedProgress: UserProgress[] = mockEnrolledUsers.map((user: User) => {
        const userProgress = mockCourseProgress.find(p => p.user === user._id) || {
          isComplete: false,
          completedComponents: {
            webinar: false,
            survey: false,
            certificate: false
          },
          dateCompleted: undefined,
          createdAt: new Date()
        };

        return {
          user,
          course: selectedCourse?.course || {} as Course,
          isComplete: userProgress.isComplete,
          completedComponents: userProgress.completedComponents,
          dateCompleted: userProgress.dateCompleted,
          registeredDate: userProgress.createdAt
        };
      });

      let filteredProgress = combinedProgress;

      if (selectedUserType !== 'All') {
        filteredProgress = filteredProgress.filter(p => p.user.role === selectedUserType);
      }

      if (startDate) {
        const start = new Date(startDate);
        filteredProgress = filteredProgress.filter(p => 
          p.registeredDate && p.registeredDate >= start
        );
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filteredProgress = filteredProgress.filter(p => 
          p.registeredDate && p.registeredDate <= end
        );
      }

      if (excludeFinished) {
        filteredProgress = filteredProgress.filter(p => !p.isComplete);
      }

      setUserProgress(filteredProgress);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch progress when filters change
  useEffect(() => {
    if (selectedCourse) {
      fetchProgress();
    }
  }, [selectedCourse, startDate, endDate, selectedUserType, excludeFinished]);

  const handleSaveProgress = async (updatedProgress: UserProgress) => {
    try {
      const progressIndex = mockProgress.findIndex(p => 
        p.course === updatedProgress.course._id && p.user === updatedProgress.user._id
      );

      if (progressIndex === -1) {
        mockProgress.push({
          user: updatedProgress.user._id || '',
          course: updatedProgress.course._id,
          isComplete: updatedProgress.isComplete,
          completedComponents: {
            webinar: updatedProgress.completedComponents.webinar || false,
            survey: updatedProgress.completedComponents.survey || false,
            certificate: updatedProgress.completedComponents.certificate || false
          },
          dateCompleted: updatedProgress.dateCompleted,
          createdAt: updatedProgress.registeredDate || new Date()
        });
      } else {
        mockProgress[progressIndex] = {
          ...mockProgress[progressIndex],
          isComplete: updatedProgress.isComplete,
          completedComponents: {
            webinar: updatedProgress.completedComponents.webinar || false,
            survey: updatedProgress.completedComponents.survey || false,
            certificate: updatedProgress.completedComponents.certificate || false
          },
          dateCompleted: updatedProgress.dateCompleted
        };
      }

      await fetchProgress();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDownloadCSV = () => {
    if (!userProgress.length) return;

    const headers = [
      'Name',
      'Email',
      'User Type',
      'Registered',
      'Completed',
      'Webinar',
      'Survey',
      'Certificate'
    ];

    const rows = userProgress.map(progress => [
      progress.user.name,
      progress.user.email,
      progress.user.role,
      progress.registeredDate ? format(progress.registeredDate, 'MM/dd/yyyy h:mm a') : 'N/A',
      progress.dateCompleted ? format(progress.dateCompleted, 'MM/dd/yyyy h:mm a') : 'N/A',
      progress.completedComponents.webinar ? 'Complete' : 'Incomplete',
      progress.completedComponents.survey ? 'Complete' : 'Incomplete',
      progress.completedComponents.certificate ? 'Complete' : 'Incomplete'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCourse?.label}_progress_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedProgress = userProgress
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(userProgress.length / itemsPerPage);

  // Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '0.5rem',
      borderColor: '#E5E7EB',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#8757a3'
      }
    }),
    option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#8757a3' 
        : state.isFocused 
          ? '#F3F4F6' 
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:active': {
        backgroundColor: '#8757a3'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: '#374151'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9CA3AF'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#374151'
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    })
  };

  const handleEditClick = (progress: UserProgress) => {
    setSelectedProgress(progress);
    setEditModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-8 py-6 h-full">
        <div className="bg-white border rounded-lg p-6 h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Product Progress Report</h1>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            {/* Course Search */}
            <div className="relative mb-4">
              <Select
                placeholder="Search for a course..."
                value={selectedCourse}
                onChange={(option) => setSelectedCourse(option as CourseOption)}
                loadOptions={loadCourseOptions}
                defaultOptions={allCourses}
                cacheOptions
                styles={selectStyles}
                isClearable
                className="w-full"
                noOptionsMessage={({ inputValue }) => 
                  inputValue ? "No courses found" : "Type to search courses"
                }
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">User</span>
                <select
                  value={selectedUserType}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="border rounded-lg px-3 py-1.5"
                >
                  <option value="All">All</option>
                  <option value="foster parent">Foster Parent</option>
                  <option value="certified kin">Certified Kin</option>
                  <option value="non-certified kin">Non-certified Kin</option>
                  <option value="staff">Staff</option>
                  <option value="casa">CASA</option>
                  <option value="teacher">Teacher</option>
                  <option value="county/cpa worker">County/CPA Worker</option>
                  <option value="speaker">Speaker</option>
                  <option value="former parent">Former Parent</option>
                  <option value="caregiver">Caregiver</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-lg px-3 py-1.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="excludeFinished"
                  checked={excludeFinished}
                  onChange={(e) => setExcludeFinished(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="excludeFinished" className="text-sm">
                  Exclude users who have finished
                </label>
              </div>

              <button
                onClick={handleDownloadCSV}
                className="ml-auto bg-[#8757a3] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userProgress.length}
              >
                <Download size={16} />
                Download as CSV
              </button>
            </div>

            {/* Table Container */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8757a3]"></div>
                </div>
              ) : !selectedCourse ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  Select a course to view progress report
                </div>
              ) : displayedProgress.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No progress records found for the selected filters
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b sticky top-0">
                      <tr>
                        <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                        <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                        <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Webinar</th>
                        <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Survey</th>
                        <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Certificate</th>
                        <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayedProgress.map((progress) => (
                        <tr key={progress.user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm truncate" title={progress.user.name}>{progress.user.name}</td>
                          <td className="px-4 py-2 text-sm truncate" title={progress.user.email}>{progress.user.email}</td>
                          <td className="px-4 py-2 text-sm truncate" title={progress.user.role}>{progress.user.role}</td>
                          <td className="px-4 py-2 text-sm">
                            {progress.registeredDate 
                              ? <div className="flex flex-col">
                                  <span>{format(progress.registeredDate, 'MM/dd/yy')}</span>
                                  <span className="text-xs text-gray-500">{format(progress.registeredDate, 'h:mm a')} EST</span>
                                </div>
                              : 'N/A'
                            }
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {progress.dateCompleted 
                              ? <div className="flex flex-col">
                                  <span>{format(progress.dateCompleted, 'MM/dd/yy')}</span>
                                  <span className="text-xs text-gray-500">{format(progress.dateCompleted, 'h:mm a')} EST</span>
                                </div>
                              : 'N/A'
                            }
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {progress.completedComponents.webinar ? (
                              <div className="flex flex-col">
                                <span className="text-green-600">✓</span>
                                <span className="text-xs text-gray-500">{format(new Date(), 'MM/dd/yy')}</span>
                              </div>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {progress.completedComponents.survey ? (
                              <div className="flex flex-col">
                                <span className="text-green-600">✓</span>
                                <span className="text-xs text-gray-500">{format(new Date(), 'MM/dd/yy')}</span>
                              </div>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {progress.completedComponents.certificate ? (
                              <div className="flex flex-col">
                                <span className="text-green-600">✓</span>
                                <span className="text-xs text-gray-500">{format(new Date(), 'MM/dd/yy')}</span>
                              </div>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <button 
                              onClick={() => handleEditClick(progress)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {displayedProgress.length > 0 && (
              <div className="flex justify-end items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  ‹
                </button>
                <span className="px-4 py-1 bg-[#8757a3] text-white rounded">{currentPage}</span>
                {Array.from({ length: Math.min(3, totalPages - currentPage) }, (_, i) => (
                  <button
                    key={currentPage + i + 1}
                    onClick={() => setCurrentPage(currentPage + i + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                  >
                    {currentPage + i + 1}
                  </button>
                ))}
                {currentPage + 3 < totalPages && <span>...</span>}
                {currentPage + 3 < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add the EditProgressModal component */}
      {selectedProgress && (
        <EditProgressModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          progress={selectedProgress}
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
};

export default ProductProgressReport;