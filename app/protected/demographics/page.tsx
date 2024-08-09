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
import { planType } from '@/app/actions'; // Adjust the path as needed

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
  const [userPlanType, setUserPlanType] = useState<string | null>(null); // State for plan_type

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

  useEffect(() => {
    const checkPlanType = async () => {
      const type = await planType();
      console.log('Plan Type:', type);
      setUserPlanType(type);
    };

    checkPlanType();
  }, []);

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
    <div className={`container mx-auto p-4 ${userPlanType !== 'premium' ? 'blur-md' : ''}`}>
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
            {countries.map((country) => {
              const demographicCount = demographics.country[country.countryCode] || 0;
              return (
                <CircleMarker
                  key={country.countryCode}
                  center={[country.latitude, country.longitude]}
                  radius={demographicCount / 1000}
                  color="blue"
                  fillColor="blue"
                  fillOpacity={0.5}
                >
                  <LeafletTooltip>
                    {country.name}: {demographicCount} users
                  </LeafletTooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Demographics Overview</h2>
            <h3 className="text-lg font-medium mb-2">Gender Distribution</h3>
            <p>Female: {(demographics.gender.F / totalGenderCount * 100).toFixed(2)}%</p>
            <p>Male: {(demographics.gender.M / totalGenderCount * 100).toFixed(2)}%</p>
            <p>Unknown: {(demographics.gender.U / totalGenderCount * 100).toFixed(2)}%</p>
            <h3 className="text-lg font-medium mt-4 mb-2">Age Distribution</h3>
            {Object.entries(demographics.age).map(([ageRange, count]) => (
              <p key={ageRange}>{ageRange}: {count} users</p>
            ))}
            <h3 className="text-lg font-medium mt-4 mb-2">City Distribution</h3>
            {Object.entries(demographics.city).map(([city, count]) => (
              <p key={city}>{city}: {count} users</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
