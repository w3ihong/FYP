"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; 
import { countryDictionary } from './countryDictionary';

import { planType } from '@/app/actions';

const MapComponent = dynamic(() => import('@/components/mapComponent'), { ssr: false });

// Import d3-fetch for CSV data handling
import { csv } from 'd3-fetch';

type Query = {
    value: number;
    query: string;
};

type Topics = {
    formattedValue: string;
    topic_title: string;
}

const Trends = () => {
    const [selectedCountry, setSelectedCountry] = useState('United States');
    const [trends, setCountryTrends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapCoordinates, setMapCoordinates] = useState(null);

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    // Load country coordinates when a country is selected
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
    
    const handleCountryTrendsSubmit = async (event) => {
        if (!selectedCountry) return;

        setLoading(true);
        const country = countryDictionary[selectedCountry];
        const res = await fetch(`https://fyp-ml-ejbkojtuia-ts.a.run.app/trends_by_country/${country.sc}`);
        const data = await res.json();
        setCountryTrends(data);
        setLoading(false);
    };
    
    useEffect(() => {
        handleCountryTrendsSubmit(selectedCountry);
    }, [selectedCountry]);

    const [selectedKWCountry, setSelectedKWCountry] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedTimeframe, setSelectedTimeFrame] = useState('');
    const [KWtTop, setKWTop] = useState({});
    const [KWRising, setKWRising] = useState({});
    const [KWloading, setKWLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [KWError, setKWError] = useState(null);
    const [userPlanType, setUserPlanType] = useState<string | null>(null); // State for plan_type

    const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

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

    useEffect(() => {
        const checkPlanType = async () => {
          const type = await planType();
          console.log('Plan Type:', type);
          setUserPlanType(type);

           // Trigger modal if user is not premium
           if (type !== 'premium') {
            setIsModalOpen(true);
        }

          

        };
    
        checkPlanType();
      }, []);

    const handleKeywordSubmit = async (event) => {
        event.preventDefault();
        if ( !selectedTopic || !selectedTimeframe || !keyword) return;

        setKWLoading(true);
        try {
            
            let url = `https://fyp-ml-ejbkojtuia-ts.a.run.app/${selectedTopic}/${keyword.trim()}?timeframe=${selectedTimeframe}`;

                if (selectedKWCountry !== '') {
                    const country = countryDictionary[selectedKWCountry];
                    url += `&geo=${country.abbv}`;
                }

            const res = await fetch(url);
            const data = await res.json();
            console.log('Keyword data:', data);
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

    const renderTrends = (trends: { [key: string]: Query | Topics}, type: string) => (
        <div className='w-full'>
            <ul className='space-y-1'>
                {Object.entries(trends).map(([key, value], index) => (
                    <li key={`${type}-${index}`} className='bg-white rounded-md shadow flex h-8 items-center px-4'>
                        <div className='text-md font-bold w-1/6 '>{Number(key) + 1}</div>
                        <div className='text-md w-4/6 '>{"query" in value ? value.query : value.topic_title}</div>
                        <div className='text-md w-1/6 '>
                            {type === "rising" && "value" in value
                            ? `+${value.value}%`
                            : "formattedValue" in value
                            ? value.formattedValue
                            : value.value}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        
        <div className={`w-full p-6 ${userPlanType !== 'premium' ? 'blur' : ''}`}>
            

            <h1 className="text-2xl font-bold mb-6">See What's Trending! </h1>
            {/* Country trends*/}
            <div className='flex justify-between space-x-8 mb-8'>
                <div className='bg-white rounded-md shadow w-1/3 p-4 flex-col h-[40rem] justify-start '>

                   
                    <div className='flex items-center h-10 px-1 '>
                        <span className="text-lg font-bold mr-2">By Country:</span>
                        <select className='rounded-md' value={selectedCountry} onChange={handleCountryChange}>
                            
                            {Object.keys(countryDictionary).map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                    
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
                <div className={`w-2/3 bg-white rounded-md shadow p-4 flex-col h-[40rem] ${userPlanType !== 'premium' ? 'blurred' : ''}`}>

                <MapComponent mapCoordinates={mapCoordinates} selectedCountry={selectedCountry} />
                </div>
            </div>
            {/* Search trends */}
            <div className={`bg-white rounded-md shadow p-5 w-full h-[40rem] flex-col ${userPlanType !== 'premium' ? 'blurred' : ''}`}>
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
                                <option value="" >Worldwide</option>
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
