// pages/index.js
"use client";
import { useEffect, useState } from 'react';

export default function Home() {
    const [trendingWorldwide, setTrendingWorldwide] = useState([]);
    const [trendingCatered, setTrendingCatered] = useState([]);

    useEffect(() => {
        fetch('/api/trending')
            .then(response => response.json())
            .then(data => setTrendingWorldwide(data));
        
        // Mocked data for 'Catered To You' section for demonstration
        setTrendingCatered(['Topic A', 'Topic B', 'Topic C', 'Topic D', 'Topic E', 'Topic F', 'Topic G', 'Topic H', 'Topic I', 'Topic J']);
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Trend Analysis</h1>
            <input type="text" placeholder="Search for any trend" style={styles.searchBar} />
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Trends Worldwide</h2>
                <div style={styles.trendList}>
                    {trendingWorldwide.slice(0, 10).map((topic, index) => (
                        <div key={index} style={styles.trendItem}>
                            #{index + 1} {topic}
                        </div>
                    ))}
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
