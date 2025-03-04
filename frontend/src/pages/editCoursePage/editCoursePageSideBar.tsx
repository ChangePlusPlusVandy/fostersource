import React, { useEffect, useState, useRef, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
interface SideBarProps {
    children?: ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {

    const location = useLocation();
    const isEditPageRoute = location.pathname === "/editCoursePage";
    const isPricePageRoute = location.pathname === "/"
    const isComponentsPageRoute = location.pathname === "/"
    const isSpeakersPageRoute = location.pathname === "/"
    const isHandoutsPageRoute = location.pathname === "/"
    const isManagersPageRoute = location.pathname === "/"
    const isRegistrantsPageRoute = location.pathname === "/"
    const isParticipationPageRoute = location.pathname === "/"
    const isEmailPageRoute = location.pathname === "/"

    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate("/editCoursePage")
    }

    const handlePricingClick = () => {
        navigate("/")
    }

    const handleComponentClick = () => {
        navigate("/")
    }

    const handleSpeakersClick = () => {
        navigate("/")
    }

    const handleHandoutsClick = () => {
        navigate("/")
    }

    const handleManagersClick = () => {
        navigate("/")
    }

    const handleRegistrantsClick = () => {
        navigate("/")
    }

    const handleParticipationClick = () => {
        navigate("/")
    }

    const handleEmailClick = () => {
        navigate("/")
    }

    const handleExitClick = () =>{
        navigate("/")
    }


    return (
        <div className="bg-white w-[96%] h-[96%] border rounded-md mt-5">
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <div className="w-[105%] bg-purple-400 h-[59px] flex flex-row border items-center rounded-t-md">
                        <h1 className="text-white font-semibold ml-5">
                            New Product
                        </h1>
                        <button className="mr-5 ml-auto border border-white w-7 h-7 rounded-sm"
                        onClick={handleExitClick}>
                            <p className="text-white">
                                x
                            </p>
                        </button>

                    </div>
                    <div className="flex flex-row relative">
                        <div className="absolute left-28 h-[750px] border w-[1px] border-gray-200 z-0">

                        </div>
                    </div>

                    <div className="flex flex-col gap-6 text-[12px] text-gray-500 mt-10 ml-5">
                        <div className={"flex flex-row"}>
                            <button className={`${isEditPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleDetailsClick}>
                                Details
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[51.4px] h-6 border  w-[2px] ${isEditPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isPricePageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handlePricingClick}>
                                Pricing
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[51.4px] h-6 border  w-[2px] ${isPricePageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isComponentsPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleComponentClick}>

                                Components
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[13.6px] h-6 border  w-[2px] ${isComponentsPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <button className={`${isSpeakersPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleSpeakersClick}>

                                Speakers
                            </button>

                            <div className="flex relative z-50">
                                <div className={`absolute left-[37px] h-6 border  w-[2px] ${isSpeakersPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isHandoutsPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleHandoutsClick}>

                                Handouts
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[34px] h-6 border  w-[2px] ${isHandoutsPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isManagersPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleManagersClick}>

                                Managers
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[31.5px] h-6 border  w-[2px] ${isManagersPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isRegistrantsPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleRegistrantsClick}>

                                Registrants
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[24.5px] h-6 border  w-[2px] ${isRegistrantsPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isParticipationPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleParticipationClick}>

                                Participation
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[16px] h-6 border  w-[2px] ${isParticipationPageRoute ? "border-purple-400" : "border-gray-200"}`}>

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button className={`${isEmailPageRoute ? "text-purple-400" : "text-gray-500"}`}
                                onClick={handleEmailClick}>

                                Email
                            </button>
                            <div className="flex relative z-50">
                                <div className={`absolute left-[59.5px] h-6 border  w-[2px] ${isEmailPageRoute ? "border-purple-400" : "border-gray-200"}`}>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="-mt-96 ml-28">
                        {children}
                    </div>
                </div>


            </div>

        </div>
    )
}
export default SideBar