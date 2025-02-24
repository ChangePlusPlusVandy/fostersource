import { Dispatch, SetStateAction } from "react";
import Dropdown from "../../../components/dropdown-select";
import {Video, Calendar, Wifi} from "lucide-react";
import DisplayBar from "./DisplayBar";
import { WebinarType } from "../../../shared/types/webinar";

interface WorkshopProps {
  webinar?: WebinarType
  prerequisites: { survey: string; certificate: string };
  setPrerequisites: Dispatch<SetStateAction<{ survey: string; certificate: string }>>;
}

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
  
  export function Checkbox({ label, checked, onChange }: CheckboxProps) {
    return (
      <label className="flex items-center space-x-1 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring focus:ring-blue-500"
        />
        <span className="text-gray-600">{label}</span>
      </label>
    );
  }

  const formatWebinarDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short", // Displays the user's time zone abbreviation
    }).format(date);
  };

  // Format date as MM/DD/YYYY
const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };
  
  // Format time as HH:MM AM/PM in the user's local time zone
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };
  
  // Format length as "X Hours"
  const formatLength = (durationMinutes: number): string => {
    return `${Math.ceil(durationMinutes / 60)} Hours`;
  };
  
  interface WebinarDetailsProps {
    webinar: WebinarType
  }

  const WebinarDetails = (webinar : WebinarDetailsProps) => {
    return (
      <div className="text-black text-sm font-medium space-y-2 w-full pt-4 pb-7">
        <p className="font-semibold text-left">Online Webinar</p>
        
        <p>
          <span className="font-semibold text-left">Date</span>  {formatDate(webinar.webinar.startTime)}
        </p>
        
        <p>
          <span className="font-semibold text-left">Time</span>  {formatTime(webinar.webinar.startTime)}
        </p>
        
        <p>
          <span className="font-semibold text-left">Length</span>  {formatLength(webinar.webinar.duration)}
        </p>
      </div>
    );
  };
  
  const defaultWebinar: WebinarType = {
    serviceType: "Zoom",
    meetingID: "123-456-789",
    startTime: new Date("2025-10-15T15:30:00.000Z"),
    duration: 120, // 2 hours
    authParticipants: false,
    autoRecord: true,
    enablePractice: false,
  };

export default function WorkshopCard({ webinar = defaultWebinar, prerequisites, setPrerequisites }: WorkshopProps) {
  const formatMenuItems = [
    { label: "None Selected", onClick: () => setPrerequisites((prev) => ({ ...prev, survey: "None Selected" })) },
    { label: "Workshop", onClick: () => setPrerequisites((prev) => ({ ...prev, survey: "Workshop" })) },
  ];

  return (
    <div className="border rounded-lg shadow p-4 bg-white w-full last:mr-6 h-[98%] pb-2">
      <div>
        <div className="flex flex-row">
            <Video />
            <h2 className="text-xl font-bold pl-2">Workshop</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-5">Live Event {formatWebinarDate(webinar.startTime)}</p>
        <p className="text-sm font-medium">Prerequisites</p>

        <Dropdown buttonLabel={`None Selected: ${prerequisites.survey}`} menuItems={formatMenuItems} />
        <div className="flex flex-col gap-2 mt-4">
            <Checkbox label={"Required?"} checked={false} onChange={function (checked: boolean): void {
                    throw new Error("Function not implemented.");
                } } />
            <Checkbox label={"Hide when completed?"} checked={false} onChange={function (checked: boolean): void {
                    throw new Error("Function not implemented.");
                } } />
        </div>
        
        <div className="mt-8 text-xs font-bold">Preview</div>
        <div className="mt-2 border p-3 rounded-lg border-black h-[350px] relative flex items-center flex-col">
            <p className="font-medium text-left w-full">Content</p>
            <div className="flex justify-center">
                <DisplayBar status={"webinar"} />
            </div>
            <WebinarDetails webinar={webinar}/>
            <div className=" items-center w-[90%] mb-2">
                <button className="bg-[#F79518] text-white py-2 px-4 rounded w-full mt-4">
                    <div className="flex flex-row justify-center">
                        <Calendar className="mr-2"/>
                        Add to Calendar
                    </div>
                </button>
                <button className="bg-[#F79518] text-white py-2 px-4 rounded w-full mt-4">
                    <div className="flex flex-row justify-center">
                        <Wifi className="mr-2"/>
                        Test Network
                    </div>
                </button>
            </div>
        </div>

        <button className="bg-[#8757A3] text-white py-2 px-4 rounded w-full mt-4 transition transform active:scale-95 hover:scale-105" 
        onClick={() => {console.log("clicked")}}>
            Edit Component
        </button>

        <div className="flex justify-center mt-2">
            <button className="text-purple-600 underline transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                Hide Component
            </button>
        </div>


      </div>
    </div>
  );
}
