"use client";
import { useState } from 'react';
import { countryDictionary } from './countryDictionary';
import { useEffect } from 'react';

type Trend = {
    value: number;
    query: string;
  };
  

const trends = () => {
    const sampleResponse = {
        "rising": {
            "0": {
                "value": 2550,
                "query": "warren buffett"
            },
            "1": {
                "value": 2500,
                "query": "warren buffett apple"
            },
            "2": {
                "value": 2450,
                "query": "warren buffett sells apple"
            },
            "3": {
                "value": 450,
                "query": "intel stock"
            },
            "4": {
                "value": 170,
                "query": "apple music replay"
            },
            "5": {
                "value": 120,
                "query": "amazon aktie"
            },
            "6": {
                "value": 120,
                "query": "apple aktie"
            },
            "7": {
                "value": 110,
                "query": "apple stocks"
            },
            "8": {
                "value": 110,
                "query": "apple share price"
            },
            "9": {
                "value": 110,
                "query": "apple shares"
            },
            "10": {
                "value": 100,
                "query": "apple stock"
            },
            "11": {
                "value": 100,
                "query": "amazon share price"
            },
            "12": {
                "value": 90,
                "query": "nvidia aktie"
            },
            "13": {
                "value": 90,
                "query": "nvidia share price"
            },
            "14": {
                "value": 90,
                "query": "amazon stock"
            },
            "15": {
                "value": 80,
                "query": "meta stock"
            },
            "16": {
                "value": 80,
                "query": "nvidia stock"
            },
            "17": {
                "value": 80,
                "query": "apple iphone 16 pro max"
            },
            "18": {
                "value": 80,
                "query": "amd stock"
            },
            "19": {
                "value": 70,
                "query": "microsoft aktie"
            },
            "20": {
                "value": 70,
                "query": "nvda stock"
            },
            "21": {
                "value": 60,
                "query": "apple stock price"
            }
        },
        "top": {
            "0": {
                "value": 100,
                "query": "apple watch"
            },
            "1": {
                "value": 44,
                "query": "iphone"
            },
            "2": {
                "value": 43,
                "query": "apple iphone"
            },
            "3": {
                "value": 37,
                "query": "apple tv"
            },
            "4": {
                "value": 26,
                "query": "apple store"
            },
            "5": {
                "value": 25,
                "query": "apple id"
            },
            "6": {
                "value": 22,
                "query": "apple music"
            },
            "7": {
                "value": 21,
                "query": "apple pay"
            },
            "8": {
                "value": 17,
                "query": "apple ipad"
            },
            "9": {
                "value": 17,
                "query": "ipad"
            },
            "10": {
                "value": 15,
                "query": "apple stock"
            },
            "11": {
                "value": 14,
                "query": "apple card"
            },
            "12": {
                "value": 11,
                "query": "apple macbook"
            },
            "13": {
                "value": 10,
                "query": "airpods"
            },
            "14": {
                "value": 10,
                "query": "apple pencil"
            },
            "15": {
                "value": 9,
                "query": "apple cider vinegar"
            },
            "16": {
                "value": 9,
                "query": "apple airpods"
            },
            "17": {
                "value": 9,
                "query": "apple watch se"
            },
            "18": {
                "value": 8,
                "query": "apple watch 9"
            },
            "19": {
                "value": 7,
                "query": "apple iphone 15"
            },
            "20": {
                "value": 7,
                "query": "apple login"
            },
            "21": {
                "value": 7,
                "query": "apple watch ultra"
            },
            "22": {
                "value": 6,
                "query": "apple carplay"
            },
            "23": {
                "value": 6,
                "query": "apple support"
            },
            "24": {
                "value": 5,
                "query": "apple icloud"
            }
        }
    }
    const [selectedCountry, setSelectedCountry] = useState('United States');
    const [trends, setCountryTrends] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleCountryChange = (event) => {
      setSelectedCountry(event.target.value);
    };
  
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
        handleCountryTrendsSubmit(selectedCountry); // Fetch data on page load
    }, [selectedCountry]);

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
    }

    const handleKeywordSubmit = async (event) => {
        event.preventDefault();
        if (!selectedKWCountry || !selectedTopic || !selectedTimeframe || !keyword) return;
    
        setKWLoading(true);
        // const data = sampleResponse
        try {
            const country = countryDictionary[selectedKWCountry];
            const res = await fetch(`https://fyp-ml-ejbkojtuia-ts.a.run.app/${selectedTopic}/${keyword}?timeframe=${selectedTimeframe}&geo=${country.abbv}`);
            const data = await res.json();
            
            if ('error' in data) {
                // Handle the error case
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
    }

    const renderTrends = (trends: { [key: string]: Trend }, type :string) => (
        <div className='w-full'>
          <ul className='space-y-1'>
            {Object.entries(trends).map(([key, value]) => (
                <li key={key} className='bg-white rounded-md shadow flex h-8 items-center px-4'>
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

                <form >
                    <div className='flex items-center h-10 px-1 '>
                        <span className="text-lg font-bold mr-2">By Country :</span>
                        <select className='rounded-md' value={selectedCountry} onChange={handleCountryChange}>
                            {Object.keys(countryDictionary).map((country) => (
                                <option key={country} value={country}>
                                {country}
                                </option>
                            ))}
                        </select>
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
                        {Object.entries(trends).map(([key, value]) => (
                            <li  className='bg-white rounded-md shadow w-full flex h-8 items-center px-4'>
                                <div className='text-md font-bold w-1/5 ml-3'>{Number(key)+1} </div>
                                <div className='text-md w-4/5'> {value}</div>
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>
            <div className='w-2/3 bg-white rounded-md shadow p-4 flex-col h-[40rem]'>
                {/* add a map for current country chosen */}
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
  
  export default trends;