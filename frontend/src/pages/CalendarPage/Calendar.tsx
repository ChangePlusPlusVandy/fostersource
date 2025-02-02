import React, { useState } from 'react';
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
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: 'webinar' | 'course' | 'meeting';
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
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [tooltip, setTooltip] = useState<{ visible: boolean; event?: CalendarEvent; x: number; y: number }>({
        visible: false,
        event: undefined,
        x: 0,
        y: 0,
    });

    const dummyEvents: CalendarEvent[] = [
        {
            id: '1',
            title: 'Body Positivity for Children in Care - Live Virtual',
            date: new Date(2025, 0, 28, 10, 0),
            type: 'webinar',
            description: 'In this session, we will discuss the importance of promoting body acceptance among youth.',
            creditHours: 2,
        }
    ];

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const daysInMonth = getDaysInInterval(calendarStart, calendarEnd);

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

    const goToToday = () => {
        setCurrentDate(new Date());
		setSelectedDate(new Date());
    };

    const getEventsForDate = (date: Date) => {
        return dummyEvents.filter(event => isSameDay(event.date, date));
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

const renderCalendar = () => {
    if (view === 'month') {
        return (
            <div className="w-full overflow-auto">
                <div className="grid min-w-[800px] w-full" style={{ gridTemplateColumns: 'repeat(7, minmax(150px, 1fr))' }}>
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
                                className={`min-h-[100px] p-2 border ${
                                    isSelected ? 'bg-orange-50' : ''
                                } ${!isCurrentMonth ? 'text-gray-400' : ''}`}
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
            </div>
        );
    }

    if (view === 'week') {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        const daysInWeek = getDaysInInterval(weekStart, weekEnd);
        const hours = Array.from({ length: 24 }, (_, i) => new Date(currentDate.setHours(i, 0, 0, 0)));

        return (
            <div className="w-full overflow-auto">
                <div className="grid grid-cols-8 gap-1 min-w-full">
                    <div className="border-b p-2 sticky left-0 bg-white"></div>
                    {daysInWeek.map(day => (
                        <div key={day.toString()} className="text-center font-semibold p-2 border-b min-w-[150px]">
                            <div>{format(day, 'EEE')}</div>
                            <div className={`text-sm inline-flex ${isToday(day) ? 'bg-orange-500 text-white rounded-full w-6 h-6 items-center justify-center' : ''}`}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}

                    {hours.map(hour => (
                        <React.Fragment key={hour.toString()}>
                            <div className="border-r p-2 text-sm text-gray-500 sticky left-0 bg-white">
                                {format(hour, 'h a')}
                            </div>
                            {daysInWeek.map(day => {
                                const currentHourEvents = dummyEvents.filter(event => 
                                    isSameDay(event.date, day) && 
                                    format(event.date, 'H') === format(hour, 'H')
                                );

                                return (
                                    <div key={`${day}-${hour}`} className="border p-2 min-h-[60px] min-w-[150px]">
                                        <div className="flex flex-col gap-y-2">
    										{currentHourEvents.map(event => (
												<div
												key={event.id}
												className="bg-orange-500 text-white text-xs p-[6px] rounded cursor-pointer w-full max-w-[95%] overflow-hidden mx-auto"
												onMouseEnter={(e) => handleMouseEnter(event, e)}
												onMouseLeave={handleMouseLeave}
											>
												{event.title}
											</div>
											

    										))}
										</div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'day') {
        const hours = Array.from({ length: 24 }, (_, i) => new Date(currentDate.setHours(i, 0, 0, 0)));
        const dayEvents = dummyEvents.filter(event => isSameDay(event.date, currentDate));

        return (
            <div className="w-full overflow-auto">
                <div className="grid grid-cols-6 border min-w-full w-full max-w-[800px] mx-auto">
                    <div className="border-r p-4 text-base font-medium bg-white sticky left-0">
					<div className="flex items-center space-x-1">
    					<span className="font-bold">{format(currentDate, 'EEEE')},</span>
    					<span className={`text-sm font-bold inline-flex ${isToday(currentDate) ? 'bg-orange-500 text-white rounded-full w-6 h-6 items-center justify-center' : ''}`}>
        					{format(currentDate, 'd')}
   						</span>
					</div>
                    </div>
                    <div className="col-span-5 p-1 min-h-[60px]">
                        {hours.map(hour => {
                            const currentHourEvents = dayEvents.filter(event => 
                                format(event.date, 'H') === format(hour, 'H')
                            );

                            return (
                                <div key={hour.toString()} className="border-b py-2">
                                    <div className="flex justify-between items-start px-4">
                                        <div className="text-sm text-gray-500 w-20">
                                            {format(hour, 'h a')}
                                        </div>
                                        <div className="flex-1 space-y-1 ml-4">
                                            {currentHourEvents.map(event => (
                                                <div
                                                    key={event.id}
                                                    className="bg-orange-500 text-white text-sm p-2 rounded cursor-pointer"
                                                    onMouseEnter={(e) => handleMouseEnter(event, e)}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return <div>No view available</div>;
};

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
            <div className="bg-white rounded-lg shadow">
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

                <div className="px-3 py-4">
                    {renderCalendar()}
                </div>

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
        </div>
    );
}