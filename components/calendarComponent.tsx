'use client';

import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getPosts } from '@/app/actions';
import ModalPostDetail from './ModalPostDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import Datepicker from 'react-tailwindcss-datepicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Singapore');

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState<Date>(dayjs().tz().toDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      const events = posts.map((post) => ({
        id: post.id, // Ensure each event has a unique id
        title: `${post.client_name}: ${post.caption}`,
        start: dayjs(post.created_at).tz().toDate(),
        extendedProps: {
          post,
        },
      }));
      setEvents(events);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarView);
      calendarApi.gotoDate(currentDate);
    }
  }, [calendarView, currentDate]);

  const handleEventClick = (info: any) => {
    setSelectedPost(info.event.extendedProps.post);
    setModalOpen(true);
  };

  const handleEventMouseEnter = (info: any) => {
    if (calendarView === 'dayGridMonth') {
      setHoveredEventId(info.event.id);
    }
  };

  const handleEventMouseLeave = (info: any) => {
    if (calendarView === 'dayGridMonth') {
      setHoveredEventId(null);
    }
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarView(event.target.value);
  };

  const handleDateChange = (date: { startDate: string | null; endDate: string | null }) => {
    if (date.startDate) {
      const newDate = dayjs(date.startDate).tz().toDate();
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(newDate);
      }
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const post = eventInfo.event.extendedProps.post;
    const isHovered = hoveredEventId === eventInfo.event.id;
    if (post) {
      

      if (calendarView === 'dayGridWeek') {
        return (
          <div className="p-2 cursor-pointer bg-white shadow-lg rounded-md text-black">
            {post.platform === 'Instagram' && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faInstagram} className="mr-2 text-pink-500" />
                <span>{post.client_name}</span>
              </div>
            )}
            {post.platform === 'Facebook' && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFacebook} className="mr-2 text-blue-600" />
                <span>{post.client_name}</span>
              </div>
            )}
            {post.post_type === 'IMAGE' ? (
              <img src={post.media_url} alt={post.title} className="mb-4 h-30 object-cover" />
            ) : post.post_type === 'VIDEO' ? (
              <video controls className="mb-4 h-30 object-cover">
                <source src={post.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : post.post_type === 'CAROUSEL_ALBUM' ? (
              <img src={post.media_url} alt={post.title} className="mb-4 h-30 object-cover" />
            ) : null}
          </div>
        );
      } else {
        return (
          <div className={`flex items-center cursor-pointer text-black ${isHovered ? 'bg-gray-100' : ''}`}>
            <FontAwesomeIcon
              icon={post.platform === 'Instagram' ? faInstagram : faFacebook}
              className={`mr-2 ${post.platform === 'Instagram' ? 'text-pink-500' : 'text-blue-600'}`}
            />
            <span>{post.client_name}</span>
            {isHovered && (
              <div className="ml-2">
                {post.post_type === 'IMAGE' && (
                  <img src={post.media_url} alt={post.title} className="mb-4 h-30 object-cover" />
                )}
                {post.post_type === 'VIDEO' && (
                  <video controls className="mb-4 h-30 object-cover">
                    <source src={post.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {post.post_type === 'CAROUSEL_ALBUM' && (
                  <img src={post.media_url} alt={post.title} className="mb-4 h-30 object-cover" />
                )}
              </div>
            )}
          </div>
        );
      }
    }
  };

  const dayCellClassNames = (date) => {
    const classes = ['bg-white'];
    if (date.isToday) classes.push('bg-yellow-100');
    if (selectedDate && dayjs(date.date).tz().startOf('day').isSame(dayjs(selectedDate).tz().startOf('day'))) {
      classes.push('bg-yellow-100');
    }
    return classes.join(' ');
  };

  return (
    <div className="min-h-screen p-4 font-raleway">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-bold text-3xl text-accent">Calendar</h1>
          <p className="text-s text-accent">View your schedule for all your posts here!</p>
        </div>
        <select
          onChange={handleViewChange}
          value={calendarView}
          className="px-4 py-2 rounded-lg bg-white text-gray-500 border border-gray-200 shadow"
        >
          <option value="dayGridMonth">Monthly</option>
          <option value="dayGridWeek">Weekly</option>
        </select>
      </div>

      <div className="flex justify-center items-center mb-4 z-1 relative w-full">
        <Datepicker
          value={{ startDate: dayjs(currentDate).tz().format('YYYY-MM-DD'), endDate: dayjs(currentDate).tz().format('YYYY-MM-DD') }}
          onChange={handleDateChange}
          useRange={false}
          showFooter={false}
          showShortcuts={true}
          asSingle={true}
          readOnly={true}
        />
      </div>

      <div className="rounded-2xl z-0 relative">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={calendarView}
          events={events}
          fixedWeekCount={false}
          eventClick={handleEventClick}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          headerToolbar={{
            start: '',
            center: '',
            end: ''
          }}
          eventContent={renderEventContent}
          dayHeaderClassNames="bg-accent text-white text-s"
          dayCellClassNames={dayCellClassNames}
          viewClassNames="rounded-3xl overflow-hidden shadow"
          eventDisplay="block"
          eventBackgroundColor="white"
          eventBorderColor="white"
        />
        {modalOpen && <ModalPostDetail post={selectedPost} onClose={() => setModalOpen(false)} />}
      </div>
    </div>
  );
};

export default CalendarComponent;
