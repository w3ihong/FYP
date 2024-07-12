'use client';

import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getPosts } from '@/app/actions';
import ModalPostDetail from './ModalPostDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      const events = posts.map(post => ({
        title: `${post.client_name}: ${post.caption}`,
        start: post.created_at,
        extendedProps: {
          post
        }
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
    if (calendarView === 'dayGridMonth') {
      setSelectedPost(info.event.extendedProps.post);
      setModalOpen(true);
    }else if(calendarView === 'dayGridWeek'){
        setSelectedPost(info.event.extendedProps.post);
        setModalOpen(true);
    }
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarView(event.target.value);
  };

  const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [yearStr, weekOrMonthStr] = event.target.value.split('-');
    const year = parseInt(yearStr, 10);

    if (calendarView === 'dayGridMonth') {
      const month = parseInt(weekOrMonthStr, 10) - 1;
      const newDate = new Date(year, month, 1);
      setCurrentDate(newDate);
    } else {
      const week = parseInt(weekOrMonthStr, 10);
      const newDate = new Date(year, 0, 1 + (week - 1) * 7);
      const dayOfWeek = newDate.getDay();
      const offset = dayOfWeek !== 0 ? -dayOfWeek : 0;
      newDate.setDate(newDate.getDate() + offset);
      setCurrentDate(newDate);
    }
  };

  const generateMonthYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options: { value: string, label: string }[] = [];

    if (calendarView === 'dayGridMonth') {
      for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        for (let month = 1; month <= 12; month++) {
          const date = new Date(year, month - 1, 1);
          const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          options.push({ value: `${year}-${month}`, label: monthYear });
        }
      }
    } else {
      for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        let startDate = new Date(year, 0, 1);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        let weekNumber = 1;
        while (startDate.getFullYear() <= year) {
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          const weekLabel = `${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} to ${endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
          options.push({ value: `${year}-${weekNumber}`, label: weekLabel });
          startDate.setDate(startDate.getDate() + 7);
          weekNumber++;
        }
      }
    }
    return options;
  };

  const getCurrentWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const renderEventContent = (eventInfo: any) => {
    const post = eventInfo.event.extendedProps.post;

    if (post) {
      if (calendarView === 'dayGridWeek') {
        return (
          <div className="p-2 bg-white shadow-lg rounded-md text-accent">
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
        ) : null}
          </div>
          
        );
      } else {
        if (post.platform === 'Instagram') {
          return (
            <div className="flex items-center text-accent">
              <FontAwesomeIcon icon={faInstagram} className="mr-2 text-pink-500" />
              <span>{post.client_name}</span>
            </div>
          );
        } else if (post.platform === 'Facebook') {
          return (
            <div className="flex items-center text-accent">
              <FontAwesomeIcon icon={faFacebook} className="mr-2 text-blue-600" />
              <span>{post.client_name}</span>
            </div>
          );
        }
        return <span>{post.client_name}</span>;
      }
    }
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
      
      <div className="flex justify-between mb-4">
        <select
          onChange={handleMonthYearChange}
          className="px-2 py-4 rounded-3xl text-center font-bold bg-white text-gray-500 border border-gray-200 shadow w-full"
          value={`${currentDate.getFullYear()}-${calendarView === 'dayGridMonth' ? (currentDate.getMonth() + 1) : getCurrentWeekNumber(currentDate)}`}
        >
          {generateMonthYearOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-2xl z-0">
        <div className="">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={calendarView}
            events={events}
            fixedWeekCount={false}
            eventClick={handleEventClick}
            headerToolbar={{
              start: '',
              center: '',
              end: ''
            }}
            eventContent={renderEventContent}
            dayHeaderClassNames="bg-accent text-white text-s"
            dayCellClassNames="bg-white"
            viewClassNames="rounded-3xl overflow-hidden shadow"
            eventDisplay='block'
            eventBackgroundColor='white'
            eventBorderColor='white'
          />
        </div>
        {modalOpen && <ModalPostDetail post={selectedPost} onClose={() => setModalOpen(false)} />}
      </div>
    </div>
  );
};

export default CalendarComponent;
