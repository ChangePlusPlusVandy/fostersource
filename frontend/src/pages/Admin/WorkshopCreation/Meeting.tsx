import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";

interface MeetingComponentProps {
    meetingData: any;
    setMeetingData: Dispatch<SetStateAction<any>>;
    openModal: string | null;
    setOpenModal: Dispatch<SetStateAction<any>>;
}

export default function MeetingComponent({
                                             meetingData,
                                             setMeetingData,
                                             openModal,
                                             setOpenModal,
                                         }: MeetingComponentProps) {
    return (
        <div className="mt-6 flex flex-col gap-4">
            {meetingData.meetingID !== "string" && (
                <div className="border p-4 rounded bg-gray-100">
                    <p className="font-medium">Selected Meeting:</p>
                    <p>
                        <strong>{meetingData.topic}</strong> -{" "}
                        {new Date(meetingData.startTime).toLocaleString()}
                    </p>
                </div>
            )}
            <div className="flex gap-2">
                <button
                    type="button"
                    className="px-4 py-2 bg-purple-800 text-white rounded"
                    onClick={() => setOpenModal("NewMeeting")}
                >
                    Create New Meeting
                </button>
                <button
                    type="button"
                    className="px-4 py-2 border border-purple-800 text-purple-800 rounded"
                    onClick={() => setOpenModal("ExistingMeeting")}
                >
                    Use Existing Meeting
                </button>
            </div>
        </div>
    );
}
