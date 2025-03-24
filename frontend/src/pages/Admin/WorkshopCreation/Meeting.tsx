import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {WebinarType} from "../../../shared/types/Webinar";

interface MeetingComponentProps {
    meetingData:WebinarType;
    setMeetingData: Dispatch<SetStateAction<any>>;
    openModal:string|null;
    setOpenModal: Dispatch<SetStateAction<any>>;
}
export default function MeetingComponent(
    {meetingData, setMeetingData, openModal, setOpenModal}:MeetingComponentProps
) {
    return (
        <div className="mt-6 flex justify-left gap-2">
            <button type="button" className="px-4 py-2 bg-purple-800 text-white rounded" onClick={() => setOpenModal("NewMeeting")}>Create New Meeting</button>
            <button type="button" className="px-4 py-2 border border-purple-800 text-purple-800 rounded" onClick={() => setOpenModal("ExistingMeeting")}>Use Existing Meeting</button>
        </div>)
}