import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import apiClient from "../../../../services/apiClient";

interface ExistingMeetingListProps {
    setMeetingData: Dispatch<SetStateAction<any>>;
    setOpenModal: Dispatch<SetStateAction<any>>;
}

export default function ExistingMeetingList({
                                                setMeetingData,
                                                setOpenModal,
                                            }: ExistingMeetingListProps) {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMeetings() {
            try {
                const res = await apiClient.get("zoom/meetings");
                setMeetings(res.data.meetings);
            } catch (err) {
                console.error("Failed to fetch meetings", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMeetings();
    }, []);

    if (loading) return <p>Loading meetings...</p>;

    return (
        <div className="space-y-4">
            {meetings.map((meeting) => (
                <div
                    key={meeting.id}
                    className="p-4 border rounded hover:bg-purple-50 cursor-pointer"
                    onClick={() => {
                        setMeetingData({
                            meetingID: meeting.id.toString(),
                            start_time: meeting.start_time,
                            duration: meeting.duration,
                            serviceType: "Zoom",
                            authParticipants: false,
                            autoRecord: false,
                            enablePractice: false,
                            topic: meeting.topic,
                            join_url: meeting.join_url,
                        });
                        setOpenModal(null);
                    }}
                >
                    <p className="font-semibold">{meeting.topic}</p>
                    <p className="text-sm text-gray-600">
                        {new Date(meeting.start_time).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}