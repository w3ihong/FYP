"use client";
import { useEffect, useState } from 'react';

export default function Home() {
    const [trendingWorldwide, setTrendingWorldwide] = useState([]);
    const [trendingCatered, setTrendingCatered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('singapore'); // Default selection
    const [selectedTopic, setSelectedTopic] = useState(''); // Default no topic filter
    
    // Define country options
    const countryOptions = [
        { value: 'singapore', label: 'Singapore' },
        { value: 'united_states', label: 'United States' },
        { value: 'united_kingdom', label: 'United Kingdom' },
        { value: 'india', label: 'India' },
        // Add more countries as needed
    ];

    // Define topic options
    const topicOptions = [
        { value: '', label: 'All Topics' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'technology', label: 'Technology' },
        { value: 'sports', label: 'Sports' },
        { value: 'entertainment', label: 'Entertainment' }
        // Add more topics as needed
    ];

    useEffect(() => {
        fetchTrendingData(selectedCountry);
    }, [selectedCountry]); // Fetch data whenever selectedCountry changes

    const fetchTrendingData = (country) => {
        let url = `/api/trending?country=${country}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Trending data:', data);
                setTrendingWorldwide(data);
                setTrendingCatered(data.slice(0, 20)); // Simple example, you can implement more complex logic here
            })
            .catch(error => {
                console.error('Error fetching trending data:', error);
                setTrendingWorldwide([]);
                setTrendingCatered([]);
            });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleTopicChange = (event) => {
        setSelectedTopic(event.target.value);
    };

    // Filter trendingWorldwide based on searchTerm and selectedTopic
    const filteredTrends = trendingWorldwide.filter(topic =>
        (topic.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTopic === '' || topic.toLowerCase().includes(selectedTopic.toLowerCase()))
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Trend Analysis</h1>
            <input
                type="text"
                placeholder="Search for any trend"
                style={styles.searchBar}
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Filter by Country</h2>
                <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    style={styles.dropdown}
                >
                    {countryOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Filter by Topic</h2>
                <select
                    value={selectedTopic}
                    onChange={handleTopicChange}
                    style={styles.dropdown}
                >
                    {topicOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Trends Worldwide</h2>
                <div style={styles.trendList}>
                    {filteredTrends.length === 0 ? (
                        <div>No trends available</div>
                    ) : (
                        filteredTrends.slice(0, 20).map((topic, index) => {
                            // Find the original index in trendingWorldwide array
                            const originalIndex = trendingWorldwide.findIndex(t => t === topic);
                            return (
                                <div key={index} style={styles.trendItem}>
                                    #{originalIndex + 1} {topic}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Trends Catered To You</h2>
                <div style={styles.trendList}>
                    {trendingCatered.slice(0, 20).map((topic, index) => (
                        <div key={index} style={styles.trendItem}>
                            #{index + 1} {topic}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f3f3c1',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2em',
        fontWeight: 'bold',
        backgroundColor: '#f8e43e',
        display: 'inline-block',
        padding: '5px',
    },
    searchBar: {
        marginTop: '10px',
        padding: '10px',
        fontSize: '1em',
        width: '80%',
        display: 'block',
        margin: '20px auto',
    },
    dropdown: {
        marginTop: '10px',
        padding: '10px',
        fontSize: '1em',
        width: '40%',
        display: 'block',
        margin: '10px auto',
    },
    section: {
        marginTop: '20px',
        backgroundColor: '#f8e43e',
        padding: '20px',
        borderRadius: '10px',
    },
    sectionTitle: {
        fontSize: '1.5em',
        fontWeight: 'bold',
    },
    trendList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    trendItem: {
        backgroundColor: '#fff',
        padding: '10px',
        margin: '5px',
        borderRadius: '5px',
        width: '45%',
        textAlign: 'center',
    },
};
