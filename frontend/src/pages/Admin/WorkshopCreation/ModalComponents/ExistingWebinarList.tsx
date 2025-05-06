import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import apiClient from "../../../../services/apiClient";

interface ExistingWebinarListProps {
    setWebinarData: Dispatch<SetStateAction<any>>;
    setOpenModal: Dispatch<SetStateAction<any>>;
}

export default function ExistingWebinarList({
                                                setWebinarData,
                                                setOpenModal,
                                            }: ExistingWebinarListProps) {
    const [webinars, setWebinars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWebinars() {
            try {
                const res = await apiClient.get("zoom/webinars");

                setWebinars(res.data.webinars);
            } catch (err) {
                console.error("Failed to fetch webinars", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWebinars();
    }, []);

    if (loading) return <p>Loading meetings...</p>;

    return (
        <div className="space-y-4">
            {webinars.map((webinar) => (
                <div
                    key={webinar.id}
                    className="p-4 border rounded hover:bg-purple-50 cursor-pointer"
                    onClick={() => {
                        setWebinarData({
                            meetingID: webinar.id.toString(),
                            start_time: webinar.start_time,
                            duration: webinar.duration,
                            serviceType: "Zoom",
                            authParticipants: false,
                            autoRecord: false,
                            enablePractice: false,
                            topic: webinar.topic,
                            join_url: webinar.join_url,
                        });
                        setOpenModal(null);
                    }}
                >
                    <p className="font-semibold">{webinar.topic}</p>
                    <p className="text-sm text-gray-600">
                        {new Date(webinar.start_time).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}