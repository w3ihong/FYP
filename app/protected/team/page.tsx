"use client";
import { useEffect, useState } from 'react';

export default function Home() {
    const [trendingWorldwide, setTrendingWorldwide] = useState([]);
    const [trendingCatered, setTrendingCatered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/trending')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Trending data:', data);
                setTrendingWorldwide(data);
            })
            .catch(error => {
                console.error('Error fetching trending data:', error);
                setTrendingWorldwide([]);
            });

        // Mocked data for 'Catered To You' section for demonstration
        setTrendingCatered(['Topic A', 'Topic B', 'Topic C', 'Topic D', 'Topic E', 'Topic F', 'Topic G', 'Topic H', 'Topic I', 'Topic J']);
    }, []);

    // Filter trendingWorldwide based on searchTerm
    const filteredTrends = trendingWorldwide.filter(topic =>
        topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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
                <h2 style={styles.sectionTitle}>Trends Worldwide</h2>
                <div style={styles.trendList}>
                    {filteredTrends.length === 0 ? (
                        <div>No trends available</div>
                    ) : (
                        filteredTrends.slice(0, 10).map((topic, index) => (
                            <div key={index} style={styles.trendItem}>
                                #{index + 1} {topic}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Trends Catered To You</h2>
                <div style={styles.trendList}>
                    {trendingCatered.slice(0, 10).map((topic, index) => (
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

