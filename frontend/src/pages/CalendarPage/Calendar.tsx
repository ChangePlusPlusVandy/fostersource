import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addDays,
    subDays,
    addWeeks,
    subWeeks,
    isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: "webinar" | "course" | "meeting";
    description?: string;
    creditHours?: number;
}

const getDaysInInterval = (start: Date, end: Date) => {
	const days: Date[] = [];
	let currentDate = start;
	while (currentDate <= end) {
		days.push(currentDate);
		currentDate = addDays(currentDate, 1);
	}
	return days;
};

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [view, setView] = useState<"month" | "week" | "day">("month");
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        event?: CalendarEvent;
        x: number;
        y: number;
    }>({
        visible: false,
        event: undefined,
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/courses");
                const courseData = response.data;
                
                const calendarEvents = courseData.map((course: any) => ({
                    id: course._id,
                    title: course.className,
                    date: new Date(course.date),
                    type: course.courseType,
                    description: course.description,
                    creditHours: course.creditNumber,
                }));

                setEvents(calendarEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const daysInMonth = getDaysInInterval(calendarStart, calendarEnd);

    const getEventsForDate = (date: Date) => {
        return events.filter((event) => isSameDay(event.date, date));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };
    
    const navigateDate = (direction: 'prev' | 'next') => {
        switch (view) {
            case 'month':
                setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
                break;
            case 'week':
                setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
                break;
            case 'day':
                setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
                break;
        }
    };

    const handleMouseEnter = (event: CalendarEvent, e: React.MouseEvent) => {
        setTooltip({
            visible: true,
            event,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    const bounceAnimation = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } },
    };

const renderCalendar = () => {

    if (view === 'month') {
            return (
                <motion.div {...bounceAnimation} className="w-full max-w-[800px] h-[calc(100vh-220px)] overflow-auto mx-auto"> {/* Adjusted max width */}
                    <div className="grid min-w-[600px] w-full" style={{ gridTemplateColumns: 'repeat(7, minmax(100px, 1fr))' }}> {/* Reduced column width */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-semibold p-2 border-b">
                                {day}
                            </div>
                        ))}
                        {daysInMonth.map((day) => {
                            const events = getEventsForDate(day);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(day, currentDate);

                            return (
                                <div
                                    key={day.toString()}
                                    className={`min-h-[100px] p-2 border cursor-pointer transition-colors
                                        ${isSelected ? 'bg-orange-50 hover:bg-orange-50' : 'hover:bg-gray-50'}
                                        ${!isCurrentMonth ? 'text-gray-400' : ''}`}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <div className="font-medium mb-1 flex items-center">
                                        <div className={`${isToday(day) ? 'bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                                            {format(day, 'd')}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {events.map(event => (
                                            <div
                                                key={event.id}
                                                className="bg-orange-500 text-white text-xs p-1 rounded"
                                                onMouseEnter={(e) => handleMouseEnter(event, e)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <span className="font-bold">{format(event.date, 'h:mm a')}</span> 
                                                <span className="ml-1 overflow-hidden whitespace-nowrap text-ellipsis" style={{ maxWidth: '120px', display: 'inline-block' }}>
                                                    {event.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            );
        }

        if (view === 'week') {
            const weekStart = startOfWeek(currentDate);
            const weekEnd = endOfWeek(currentDate);
            const daysInWeek = getDaysInInterval(weekStart, weekEnd);
            const hours = Array.from({ length: 24 }, (_, i) => new Date(currentDate.setHours(i, 0, 0, 0)));
        
            return (
                <motion.div {...bounceAnimation} className="w-full max-w-[800px] h-[calc(100vh-220px)] overflow-auto mx-auto"> {/* Adjusted max width */}
                    <div className="grid border w-full" style={{ gridTemplateColumns: '100px repeat(7, minmax(100px, 1fr))' }}> {/* Reduced column width */}
                        <div className="border-r bg-white sticky top-0 z-10 w-[100px] border-b"></div>
                        {daysInWeek.map((day, index) => (
                            <div 
                                key={day.toString()} 
                                className={`border-r p-3 text-center bg-white sticky top-0 z-10 border-b`}
                            >
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="font-semibold text-base">
                                        {format(day, 'EEE')}
                                    </span>
                                    <div className={`text-lg font-bold inline-flex ${
                                        isToday(day) 
                                            ? 'bg-orange-500 text-white rounded-full w-8 h-8 items-center justify-center' 
                                            : ''
                                    }`}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            </div>
                        ))}
        
                        {hours.map(hour => (
                            <React.Fragment key={hour.toString()}>
                                <div className="border-r border-b bg-white sticky left-0 w-[100px]">
                                    <div className="px-3 py-4 text-sm text-gray-500">
                                        {format(hour, 'h a')}
                                    </div>
                                </div>
        
                                {daysInWeek.map(day => {
                                    const currentDateTime = new Date(day);
                                    currentDateTime.setHours(hour.getHours(), 0, 0, 0);
                                    const dayEvents = events.filter(event => 
                                        isSameDay(event.date, day) && 
                                        format(event.date, 'H') === format(currentDateTime, 'H')
                                    );
                                    const isSelected = selectedDate && 
                                        isSameDay(day, selectedDate) && 
                                        format(selectedDate, 'H') === format(currentDateTime, 'H');
        
                                    return (
                                        <div 
                                            key={`${day}-${hour}`} 
                                            className={`border-r border-b min-h-[60px] relative cursor-pointer transition-colors
                                                ${isSelected ? 'bg-orange-50 hover:bg-orange-50' : 'hover:bg-gray-50'}`}
                                            onClick={() => setSelectedDate(currentDateTime)}
                                        >
                                            <div className="relative p-2">
                                                {dayEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="bg-orange-500 text-white text-sm p-1.5 rounded mb-1 cursor-pointer hover:bg-orange-600 transition-colors"
                                                        onMouseEnter={(e) => handleMouseEnter(event, e)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        <div className="font-bold text-sm">
                                                            {format(event.date, 'h:mm a')}
                                                        </div>
                                                        <div className="text-sm mt-0.5">
                                                            {event.title}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>
            );
        }

        if (view === 'day') {
            const hours = Array.from({ length: 24 }, (_, i) => new Date(currentDate.setHours(i, 0, 0, 0)));
            const dayEvents = events.filter(event => isSameDay(event.date, currentDate));

            return (
                <motion.div {...bounceAnimation} className="w-full h-[calc(100vh-220px)] overflow-auto">
                    <div className="grid grid-cols-6 border min-w-full">
                        <div className="border-r bg-white sticky top-0 z-10 w-32">
                            <div className="p-4 text-base">
                                <div className="flex flex-col">
                                    <span className="font-bold whitespace-nowrap">
                                        {format(currentDate, 'EEEE')}
                                    </span>
                                    <div className={`mt-1 text-sm font-bold inline-flex ${
                                        isToday(currentDate) 
                                            ? 'bg-orange-500 text-white rounded-full w-6 h-6 items-center justify-center' 
                                            : ''
                                    }`}>
                                        {format(currentDate, 'd')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-5 min-w-[600px]">
                            {hours.map(hour => {
                                const currentHourEvents = dayEvents.filter(event => 
                                    format(event.date, 'H') === format(hour, 'H')
                                );
                                const isSelected = selectedDate && format(selectedDate, 'H') === format(hour, 'H');

                                return (
                                    <div 
                                        key={hour.toString()} 
                                        className={`border-b min-h-[50px] cursor-pointer transition-colors
                                            ${isSelected ? 'bg-orange-50 hover:bg-orange-50' : 'hover:bg-gray-50'}`}
                                        onClick={() => setSelectedDate(hour)}
                                    >
                                        <div className="flex items-start p-1.5">
                                            <div className="text-sm text-gray-500 w-16 flex-shrink-0">
                                                {format(hour, 'h a')}
                                            </div>
                                            <div className="flex-1 space-y-1 ml-4">
                                                {currentHourEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="bg-orange-500 text-white text-sm p-1.5 rounded cursor-pointer hover:bg-orange-600 transition-colors"
                                                        onMouseEnter={(e) => handleMouseEnter(event, e)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        <div className="font-bold">
                                                            {format(event.date, 'h:mm a')}
                                                        </div>
                                                        <div className="mt-0.5">
                                                            {event.title}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            );
        }

        return <div>No view available</div>;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16"> {/* Adjusted padding for top and bottom */}
            <div className="bg-white rounded-lg shadow p-6"> {/* Added padding to the inner container */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-2xl font-semibold">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
                        <button
                            onClick={() => setView('month')}
                            className={`px-4 py-1.5 rounded ${
                                view === 'month' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                            } transition-colors text-sm`}
                        >
                            month
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-4 py-1.5 rounded ${
                                view === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                            } transition-colors text-sm`}
                        >
                            week
                        </button>
                        <button
                            onClick={() => setView('day')}
                            className={`px-4 py-1.5 rounded ${
                                view === 'day' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                            } transition-colors text-sm`}
                        >
                            day
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={goToToday}
                            className={`px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-sm ${
                                isToday(currentDate) ? 'bg-gray-200' : ''
                            }`}
                        >
                            today
                        </button>
                        <div className="flex items-center bg-gray-100 rounded-md p-1">
                            <button
                                onClick={() => navigateDate('prev')}
                                className="p-1.5 hover:bg-gray-200 rounded-l transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigateDate('next')}
                                className="p-1.5 hover:bg-gray-200 rounded-r transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <motion.div key={view} {...bounceAnimation} className="px-3 py-4">
                    {renderCalendar()}
                </motion.div>

                {tooltip.visible && tooltip.event && (
                    <div
                        className="absolute bg-white border rounded shadow-lg p-4"
                        style={{ top: tooltip.y + 10, left: tooltip.x + 10, width: '260px' }}
                    >
                        <div className="bg-gray-200 p-2 rounded-t">
                            <h4 className="font-semibold text-sm">{tooltip.event.title}</h4>
                        </div>
                        <div className="mt-2 text-sm">
                            <p>{tooltip.event.type.charAt(0).toUpperCase() + tooltip.event.type.slice(1)}</p>
                            <p>{format(tooltip.event.date, 'MM/dd/yyyy')} at {format(tooltip.event.date, 'h:mm a')}</p>
                            <br />
                            <p>{tooltip.event.description}</p>
                            <br />
                            <p className="font-semibold">Hours earned: {tooltip.event.creditHours}</p>
                        </div>
                    </div>
                )}
            </div>
         <br></br> {/* have to find a better way to do add margin mb-12 isn't working. temp solution for now*/}
        </div>
        
    );
}