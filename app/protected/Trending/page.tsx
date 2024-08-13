"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; 
import { countryDictionary } from './countryDictionary';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { csv } from 'd3-fetch';
import { useMap } from 'react-leaflet';


const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

type Trend = {
    value: number;
    query: string;
};

const Trends = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [trends, setCountryTrends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapCoordinates, setMapCoordinates] = useState<[number, number] | null>(null);
    

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    useEffect(() => {
        if (selectedCountry) {
            csv('/countries.csv').then(data => {
                console.log('Parsed CSV data:', data); 
                const countryData = data.find(d => d.name === selectedCountry);
                if (countryData) {
                    const latitude = parseFloat(countryData.latitude);
                    const longitude = parseFloat(countryData.longitude);
                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        setMapCoordinates([latitude, longitude]);
                        console.log('Set coordinates:', latitude, longitude);
                    } else {
                        console.error('Invalid coordinates:', countryData.latitude, countryData.longitude);
                    }
                } else {
                    console.error('Country not found in CSV data:', selectedCountry);
                }
            }).catch(err => {
                console.error('Error fetching country data:', err);
            });
        } else {
            setMapCoordinates(null);
        }
    }, [selectedCountry]);

    const MapCenterZoom = () => {
        const map = useMap();
        useEffect(() => {
            if (mapCoordinates) {
                map.setView(mapCoordinates, 5);
            }
        }, [map, mapCoordinates]);
        return null;
    };
    
    const mapPinIcon = new L.DivIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        `,
        className: 'heroicon-map-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 24], 
        popupAnchor: [0, -24]  
    });

    const handleCountryTrendsSubmit = async (event) => {
        event.preventDefault();
        if (!selectedCountry) return;

        setLoading(true);
        const country = countryDictionary[selectedCountry];
        const res = await fetch(`https://fyp-ml-ejbkojtuia-ts.a.run.app/trends_by_country/${country.sc}`);
        const data = await res.json();
        setCountryTrends(data);
        setLoading(false);
    };

    const [selectedKWCountry, setSelectedKWCountry] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedTimeframe, setSelectedTimeFrame] = useState('');
    const [KWtTop, setKWTop] = useState({});
    const [KWRising, setKWRising] = useState({});
    const [KWloading, setKWLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [KWError, setKWError] = useState(null);

    const handleKWCountryChange = (event) => {
        setSelectedKWCountry(event.target.value);
    };
    const handleTopicChange = (event) => {
        setSelectedTopic(event.target.value);
    };
    const handleTimeframeChange = (event) => {
        setSelectedTimeFrame(event.target.value);
    };
    const handleKWChange = (event) => {
        setKeyword(event.target.value);
    };

    const handleKeywordSubmit = async (event) => {
        event.preventDefault();
        if (!selectedKWCountry || !selectedTopic || !selectedTimeframe || !keyword) return;

        setKWLoading(true);
        try {
            const country = countryDictionary[selectedKWCountry];
            const res = await fetch(`https://fyp-ml-ejbkojtuia-ts.a.run.app/${selectedTopic}/${keyword}?timeframe=${selectedTimeframe}&geo=${country.abbv}`);
            const data = await res.json();

            if ('error' in data) {
                if (data['error'] === 'Query failed') {
                    setKWError('Query limit reached. Please try again later.');
                } else if (data['error'] === 'Insufficient data') {
                    setKWError('Insufficient data found for the given keyword. Please try again with a different keyword.');
                }
            }

            setKWRising(data['rising'] || {});
            setKWTop(data['top'] || {});
            setKWLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setKWLoading(false);
        }
    };

    const renderTrends = (trends: { [key: string]: Trend }, type: string) => (
        <div className='w-full'>
            <ul className='space-y-1'>
                {Object.entries(trends).map(([key, value], index) => (
                    <li key={`${type}-${index}`} className='bg-white rounded-md shadow flex h-8 items-center px-4'>
                        <div className='text-md font-bold w-1/6 '>{Number(key) + 1}</div>
                        <div className='text-md w-4/6 '>{value.query}</div>
                        <div className='text-md w-1/6 '>
                            {type === 'rising' ? `${value.value}%` : value.value}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
    

    return (
        <div className="w-full p-6 ">
            <h1 className="text-2xl font-bold mb-6">See What's Trending! </h1>
            {/* by country */}
            <div className='flex justify-between space-x-8 mb-8'>
                <div className='bg-white rounded-md shadow w-1/3 p-4 flex-col h-[40rem] justify-start '>

                    <form onSubmit={handleCountryTrendsSubmit}>
                        <div className='flex items-center h-10 px-1 '>
                            <span className="text-lg font-bold mr-2">By Country:</span>
                            <select className='rounded-md' value={selectedCountry} onChange={handleCountryChange}>
                                <option value="">Select a country</option>
                                {Object.keys(countryDictionary).map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            <button className='ml-auto bg-accent text-white px-4 py-2 rounded shadow transition-transform duration-200 transform hover:-translate-y-1 hover:bg-blue-700 text-gray-699' type="submit">Search</button>
                        </div>
                    </form>
                    <div className='mt-4 h-8 bg-gray-100 rounded shadow flex items-center px-4'>
                        <div className='text-md font-bold w-1/5'>Rank </div>
                        <div className='text-md w-4/5 ml-3 font-bold'> Topic</div>
                    </div>
                    <div className="mt-4  w-full flex overflow-auto h-[31rem]">
                        {loading ? (
                            <p className='pl-4'>Loading...</p>
                        ) : (
                        <ul className='w-full space-y-1'>
                            {Object.entries(trends).map(([key, value], index) => (
                                <li key={`country-${index}`} className='bg-white rounded-md shadow w-full flex h-8 items-center px-4'>
                                    <div className='text-md font-bold w-1/5 ml-3'>{Number(key) + 1}</div>
                                    <div className='text-md w-4/5'>{value}</div>
                                </li>
                            ))}
                        </ul>
                        )}
                    </div>
                </div>
                <div className='w-2/3 bg-white rounded-md shadow p-4 flex-col h-[40rem]'>
                    {/* Add a map for the current country chosen */}
                    <MapContainer center={mapCoordinates || [0, 0]} zoom={2} minZoom={2} maxZoom={6} scrollWheelZoom={true} maxBounds={[[-90, -180], [90, 180]]} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {mapCoordinates && (
                            <>
                                <MapCenterZoom /> 
                                <Marker position={mapCoordinates} icon={mapPinIcon}>
                                    <Popup>{selectedCountry}</Popup>
                                </Marker>
                            </>
                        )}
                    </MapContainer>
                </div>
            </div>
            {/* Search trends */}
            <div className='bg-white rounded-md shadow p-5 w-full h-[40rem] flex-col'>
                <div className='w-full'>
                    <h1 className='text-xl font-bold '>Search a keyword</h1>
                    <p className='text-sm mb-4'>Hint: dont be too specific</p>
                </div>
                {/* search bar and options  */}
                <div className='w-full'>
                    <form className='w-full' onSubmit={handleKeywordSubmit}>
                        <div className='flex items-center space-x-4'>
                            <input className='w-1/3 h-10 rounded-md px-4 ' type="text" placeholder='Keyword' onChange={handleKWChange}/>
                            <select className='w-15 h-10 rounded-md px-4 'value={selectedTopic} onChange={handleTopicChange}>
                                <option value="" >Type</option>
                                <option value="related_queries">Query</option>
                                <option value="related_topics">Topic</option>
                            </select>
                            <select className='h-10 rounded-md px-4 'value={selectedKWCountry} onChange={handleKWCountryChange}>
                                <option value="" >Country</option>
                                {Object.keys(countryDictionary).map((country) => (
                                    <option key={country} value={country}>
                                    {country}
                                    </option>
                                ))}
                            </select>
                            <select className='h-10 rounded-md px-4 'value={selectedTimeframe} onChange={handleTimeframeChange}>
                                <option value="" >Timeframe</option>
                                <option value="now 4-H">Past 4 hours</option>
                                <option value="now 1-d">Past day</option>
                                <option value="now 7-d">Past 7 day</option>
                                <option value="today 1-m">Past month</option>
                                <option value="today 3-m">Past 3 months</option>
                                <option value="today 12-m">Past year</option>
                                <option value="today 5-y">Past 5 years</option>
                            </select>

                            <button className='ml-auto bg-accent text-white px-4 py-2 rounded shadow hover:bg-accent-hover transition-transform duration-200 transform hover:-translate-y-1 hover:bg-blue-700 text-gray-699'>Search</button>
                            
                        </div>  
                    </form> 
                </div>
                {/* output header */}
                <div className='w-full flex items-center bg-gray-100 rounded h-8 mt-4 shadow space-x-4'>
                    <div className='w-1/2 flex px-4'>
                        <div className='text-md font-bold w-1/6 '>Rank</div>
                        <div className='text-md font-bold w-4/6 '>Rising</div>
                        <div className='text-md font-bold w-1/6 '>% Increase </div>
                    </div>
                    <div className='w-1/2 flex px-4'>
                        <div className='text-md font-bold w-1/6 '>Rank</div>
                        <div className='text-md font-bold w-4/6 '>Top</div>
                        <div className='text-md font-bold w-1/6 '>Relative</div>
                    </div>
                </div>
                {/* output */}
                <div className='w-full flex space-x-4 mt-4'>
                    {/* Display loading or error across both columns */}
                    {KWloading || KWError ? (
                        <div className='w-full flex items-center justify-center h-[27rem]'>
                            <p className='text-lg text-accent'>
                                {KWloading ? "Loading..." : KWError}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* rising */}
                            <div className='w-1/2 flex overflow-auto h-[27rem]'>
                                {renderTrends(KWRising, 'rising')}
                            </div>
                            {/* top */}
                            <div className='w-1/2 flex overflow-auto h-[27rem]'>
                                {renderTrends(KWtTop, 'top')}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Trends;
