import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {WebinarType} from "../../../shared/types/Webinar";

interface WebinarComponentProps {
    webinarData: { meetingID: string,
        meetingPassword: string };
    setWebinarData: Dispatch<SetStateAction<any>>;
}
export default function WebinarComponent(
    {webinarData, setWebinarData}:WebinarComponentProps
) {
    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setWebinarData({ ...webinarData, [name]: value });
    };
    return (
        <div className="mt-6 flex justify-left gap-2">
            {/*<button type="submit" className="px-4 py-2 bg-purple-800 text-white rounded" onClick={() => setOpenModal("New")}>Create New Webinar</button>*/}
            {/*<button type="button" className="px-4 py-2 border border-purple-800 text-purple-800 rounded" onClick={() => setOpenModal("Existing")}>Use Existing Webinar</button>*/}

            <label className="text-sm font-medium block">Meeting ID</label>
            <input name="title" value={webinarData.meetingID} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="" required />
            <label className="text-sm font-medium block">Meeting Password</label>
            <input name="title" value={webinarData.meetingPassword} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="" required />
        </div>)
}