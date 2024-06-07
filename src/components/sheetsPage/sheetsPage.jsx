import React, { useEffect, useState } from 'react';
import './sheetsPage.css';

import Nav from '../nav/navBar';

const Home = () => {
    const [sheets, setSheets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3050/api/sheetCollection')
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
                {sheets.map((sheet, index) => (
                    <li key={index}><a href={`/builder/${sheet.id}`} id={`sheet${index}`}>{sheet.title}</a> by {sheet.author}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="sheets page">
            <Nav />
            <main className="content">
                <section id="sheetList">
                    <h1>Your sheets</h1>
                    {renderSheets()}
                </section>
            </main>
        </div>
    );
};

export default Home;
