import { useState, useEffect, useRef } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event as RBCEvent,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Droppable } from '@hello-pangea/dnd';

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export type RecipeEvent = RBCEvent & {
  recipeId: string;
  description: string;
};

interface CalendarProps {
  events: RecipeEvent[];
  onDayDrop?: (date: Date, recipeId: string) => void;
  onDateCellMount?: (date: Date, rect: DOMRect) => void;
  onSelectDate?: (date: Date) => void;
  onRemoveEvent?: (eventId: string) => void;
}

export default function Calendar({ events, onDayDrop, onDateCellMount, onSelectDate, onRemoveEvent }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<RecipeEvent | null>(null);

  // Custom day cell wrapper to handle drop and register position
  function DayCellWrapper(props: any) {
    const { date, children } = props;
    const cellRef = useRef<HTMLDivElement>(null);
    let droppableId = undefined;

    // Only create a droppable if date is a valid Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
      droppableId = `calendar-day-${date.toISOString().split('T')[0]}`;
    }

    useEffect(() => {
      if (droppableId && cellRef.current && onDateCellMount) {
        const rect = cellRef.current.getBoundingClientRect();
        onDateCellMount(date, rect);
      }
    }, [droppableId, date, onDateCellMount]);

    if (!droppableId) {
      // Just render the children if we can't make a droppable
      return <div ref={cellRef}>{children}</div>;
    }

    return (
      <div ref={cellRef} style={{ height: '100%' }}>{children}</div>
    );
  }

  // Handle day click
  const handleSelectSlot = (slotInfo: any) => {
    if (onSelectDate && slotInfo && slotInfo.start && slotInfo.end && slotInfo.action === 'click') {
      // Only allow single-day selection
      if (slotInfo.start.toDateString() === slotInfo.end.toDateString()) {
        onSelectDate(slotInfo.start);
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event: RecipeEvent) => setSelectedEvent(event)}
        selectable
        onSelectSlot={handleSelectSlot}
        popup
        components={{
          dateCellWrapper: DayCellWrapper,
        }}
      />
      {/* Modal for recipe details */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
            <p className="mb-4">{selectedEvent.description}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              {onRemoveEvent && (
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => {
                    if (selectedEvent && selectedEvent.recipeId) {
                      onRemoveEvent(selectedEvent.recipeId);
                      setSelectedEvent(null);
                    }
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// If you get a type error for react-big-calendar, add this to your project:
// declare module 'react-big-calendar'; 