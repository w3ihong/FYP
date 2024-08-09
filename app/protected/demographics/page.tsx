'use client';

import React, { useState, useEffect } from "react";
import { useMap } from 'react-leaflet';
import { Tooltip } from 'react-tooltip';
import 'leaflet/dist/leaflet.css';
import 'react-tooltip/dist/react-tooltip.css'; 
import { csv } from 'd3-fetch';
import { InformationCircleIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { getDemographicsData } from "@/app/auth/socials/actions";
import { LatLngTuple } from 'leaflet';
import { supabase } from '@/utils/supabase/client';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const LeafletTooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

const center: LatLngTuple = [51.505, -0.09];

interface CountryData {
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
}

interface DemographicsData {
  age: { [ageRange: string]: number };
  gender: { F: number; M: number; U: number };
  city: { [cityName: string]: number };
  country: { [countryCode: string]: number };
}

const MapSetter: React.FC<{ center: LatLngTuple }> = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const Demographics = () => {
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [viewType, setViewType] = useState<'reached' | 'engaged'>('reached');
  const [timeframe, setTimeframe] = useState<'this_month' | 'this_week'>('this_month');
  const [platformAccountId, setPlatformAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountNames, setAccountNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlatformAccounts = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('Session Data:', sessionData);

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          setError('Error fetching session: ' + sessionError.message);
          return;
        }

        const user = sessionData?.session?.user;
        console.log('User Data:', user);

        if (user) {
          const { data, error } = await supabase
            .from('platform_account')
            .select('*') //query all cause i want to get account names
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching platform accounts:', error);
            setError('Error fetching platform accounts: ' + error.message);
            return;
          }

          if (data && data.length > 0) {
            console.log('Platform Accounts Data:', data);
            setPlatformAccountId(data[0].platform_account_id);
            setAccountNames(data.map(account => account.account_username));
            setSelectedAccount(data[0].account_username);
          } else {
            console.log('No platform accounts found');
            setError('No platform accounts found');
          }
        }
      } catch (err) {
        console.error('An unexpected error occurred:', err);
        setError('An unexpected error occurred: ' + err.message);
      }
    };

    fetchPlatformAccounts();
  }, []);

  useEffect(() => {
    if (platformAccountId) {
      const fetchDemographics = async () => {
        try {
          console.log('Fetching demographics data with id:', platformAccountId, viewType, timeframe);
          const demographicsData = await getDemographicsData(platformAccountId, viewType, timeframe);
          console.log('Demographics data fetched:', demographicsData);
          if (demographicsData.error) {
            setError(demographicsData.error);
          } else {
            setDemographics(demographicsData);
            setError(null); // Reset error if data fetch is successful
          }
        } catch (error) {
          console.error('Failed to fetch demographics:', error);
          setError('Failed to fetch demographics: ' + error.message);
        }
      };

      fetchDemographics();

      csv('/countries.csv').then(data => {
        const formattedData = data.map(d => ({
          name: d.name,
          latitude: +d.latitude,
          longitude: +d.longitude,
          countryCode: d.country
        }));
        console.log('Country data fetched:', formattedData);
        setCountries(formattedData);
      }).catch(err => {
        console.error('Error fetching country data:', err);
        setError('Error fetching country data: ' + err.message);
      });
    }
  }, [viewType, timeframe, platformAccountId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <NoSymbolIcon className="w-12 h-12 mb-4 text-red-500" />
        <p className="text-lg font-raleway text-red-500">{error}</p>
        {error !== 'No platform accounts found' && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-accent text-white font-medium rounded-lg"
          >
            Return
          </button>
        )}
      </div>
    );
  }

  if (!demographics || !demographics.gender) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
       <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-lg font-raleway">Loading demographics data...</p>
      </div>
    );
  }

  const totalGenderCount = demographics.gender.F + demographics.gender.M + demographics.gender.U;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">User Demographics</h1>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType('reached')}
              className={`text-white bg-accent hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 ${viewType === 'reached' ? 'bg-accent text-white' : ''}`}
            >
              Reached
            </button>
            <button
              onClick={() => setViewType('engaged')}
              className={`text-white bg-accent hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 ${viewType === 'engaged' ? 'bg-accent text-white' : ''}`}
            >
              Engaged
            </button>
          </div>
          <div className="flex space-x-4">
          <select //this part is the account names 
            value={selectedAccount || ''}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-4 py-2 bg-white text-accent hover:bg-gray-100 font-medium text-sm rounded-lg "
          >
            {accountNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as 'this_month' | 'this_week')}
            className="px-4 py-2 bg-white text-accent hover:bg-gray-100 font-medium text-sm rounded-lg "
          >
            <option value="this_month">This Month</option>
            <option value="this_week">This Week</option>
          </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MapContainer
            style={{ height: '500px', width: '100%', borderRadius: '8px', zIndex: 5 }} 
            center={center}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            scrollWheelZoom={true}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
          >
            <MapSetter center={center} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {countries.map(country => {
              const count = demographics.country[country.countryCode] || 0;
              if (count > 0) {
                return (
                  <CircleMarker
                    key={country.countryCode}
                    center={[country.latitude, country.longitude] as LatLngTuple}
                    pathOptions={{ color: 'blue', fillOpacity: 0.75 }}
                    radius={Math.sqrt(count) * 2}
                  >
                    <LeafletTooltip>{`${country.name}: ${count}`}</LeafletTooltip>
                  </CircleMarker>
                );
              }
              return null;
            })}
          </MapContainer>
          <div className="col-span-1">
            <div className="bg-white p-4 shadow rounded-lg mb-2">
              <h2 className="text-lg font-semibold">Gender Distribution</h2>
              <div className="relative h-8 bg-gray-200 rounded">
                {Object.entries(demographics.gender).map(([key, value]) => (
                  <div key={key} className={`absolute h-full ${key === 'F' ? 'bg-pink-300' : key === 'M' ? 'bg-blue-300' : 'bg-gray-300'}`}
                       style={{ width: `${(value / totalGenderCount) * 100}%` }}
                       data-tooltip-id="tooltip-gender"
                       data-tooltip-content={`${key === 'F' ? 'Female' : key === 'M' ? 'Male' : 'Undecided'}: ${value}`}>
                  </div>
                ))}
              </div>
              <Tooltip id="tooltip-gender" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 shadow rounded-lg" style={{ maxHeight: '350px' }}>
                <h2 className="text-lg font-semibold">Age Distribution</h2>
                {Object.keys(demographics.age).map(age => (
                  <div key={age} className="mt-2" data-tooltip-id="tooltip-age" data-tooltip-content={`Age ${age}: ${demographics.age[age]}`}>
                    <span>{age}: </span>
                    <span className="font-bold">{demographics.age[age]}</span>
                  </div>
                ))}
                <Tooltip id="tooltip-age" />
              </div>
              <div className="bg-white p-6 shadow rounded-lg overflow-y-auto" style={{ maxHeight: '350px' }}>
                <h2 className="text-lg font-semibold">City Distribution</h2>
                {Object.keys(demographics.city).map(city => (
                  <div key={city} className="mt-2" data-tooltip-id="tooltip-city" data-tooltip-content={`${city}: ${demographics.city[city]}`}>
                    <span>{city}: </span>
                    <span className="font-bold">{demographics.city[city]}</span>
                  </div>
                ))}
                <Tooltip id="tooltip-city" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
