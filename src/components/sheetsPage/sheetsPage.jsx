import React, { useEffect, useState } from 'react';

import Nav from '../nav/navBar';

const Home = () => {
    const [sheets, setSheets] = useState([]);

    useEffect(() => {
        fetch('/api/sheets')
            .then((response) => response.json())
            .then((data) => setSheets(data))
            .catch((error) => console.error('Error fetching sheets:', error));
    }, []);

    const renderSheets = () => {
        if (!sheets || sheets.length === 0) {
            return (
                <div className="noSheets">
                    <h1>No sheets found</h1>
                </div>
            );
        }

        return (
            <ul>
                {sheets.map((sheet) => (
                    <li key={sheet.id}>{sheet.title}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="home page">
            <Nav />
            <main className="content">
                <section id="about">
                    <h1>Your sheets</h1>
                    {renderSheets()}
                </section>
            </main>
        </div>
    );
};

export default Home;
