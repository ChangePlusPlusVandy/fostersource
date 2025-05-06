import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {WebinarType} from "../../../shared/types/Webinar";

interface InPersonComponentProps {
    inPersonData:any;
    setInPersonData: Dispatch<SetStateAction<any>>;
}
export default function InPersonComponent({inPersonData, setInPersonData}:InPersonComponentProps) {
    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setInPersonData({ ...inPersonData, [name]: value });
    };
    return (
        <div className="mt-6 flex justify-left gap-2">
            <div>
                <label className="text-sm font-medium block">Start Time</label>
                <input name="title" value={inPersonData.startTime?inPersonData.startTime.toString() : ""} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="" required />
            </div>
            <div>
                <label className="text-sm font-medium block">Location</label>
                <input name="title" value={inPersonData.location} onChange={handleChange} className="mt-1 w-full p-2 border rounded" placeholder="" required />
            </div>
        </div>)}