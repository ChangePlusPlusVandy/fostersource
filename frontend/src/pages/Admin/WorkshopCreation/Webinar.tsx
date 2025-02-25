import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {WebinarType} from "../../../shared/types/Webinar";

interface WebinarComponentProps {
    webinarData:WebinarType;
    setWebinarData: Dispatch<SetStateAction<any>>;
    openModal:string|null;
    setOpenModal: Dispatch<SetStateAction<any>>;
}
export default function WebinarComponent(
    {webinarData, setWebinarData, openModal, setOpenModal}:WebinarComponentProps
) {
    return (
        <div className="mt-6 flex justify-left gap-2">
            <button type="submit" className="px-4 py-2 bg-purple-800 text-white rounded" onClick={() => setOpenModal("New")}>Create New Webinar</button>
            <button type="button" className="px-4 py-2 border border-purple-800 text-purple-800 rounded" onClick={() => setOpenModal("Existing")}>Use Existing Webinar</button>
        </div>)
}