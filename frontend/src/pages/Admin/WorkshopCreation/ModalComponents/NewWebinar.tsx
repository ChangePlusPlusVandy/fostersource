import {Dispatch, SetStateAction, useState} from 'react';
import apiClient from "../../../../services/apiClient";
interface NewWebinarProps {
    setWebinarData: Dispatch<SetStateAction<any>>;
    setOpenModal: Dispatch<SetStateAction<any>>;
}

export default function NewWebinar({ setWebinarData, setOpenModal }:NewWebinarProps) {
    const [topic, setTopic] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [loading, setLoading] = useState(false);

    const currentDateTime = new Date();
    const minDateTime = currentDateTime.toISOString().slice(0, 16);

    const isValidStartTime = startTime && new Date(startTime) >= currentDateTime;

    const createWebinar = async () => {
        setLoading(true);
        try {
            const webinar = (await apiClient.post("zoom/webinar", {
                topic,
                start_time: new Date(startTime).toISOString(),
                duration: duration
            })).data.meeting
            setWebinarData({webinarID: webinar.id.toString(),
                start_time: webinar.start_time,
                duration: webinar.duration,
                serviceType: "Zoom",
                authParticipants: false,
                autoRecord: false,
                enablePractice: false,
                topic: webinar.topic,
                join_url: webinar.join_url,});
            setOpenModal(false);
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
                <p className="mt-1 text-sm text-gray-500">This is the title your attendees will see.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Start Time
                </label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                    min={minDateTime}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 pt">
                    Duration (minutes)
                </label>
                <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(parseInt(e.target.value))}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    onClick={()=>setOpenModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    onClick={createWebinar}
                    disabled={loading || !isValidStartTime}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Webinar'}
                </button>
            </div>
        </div>
    );
}
