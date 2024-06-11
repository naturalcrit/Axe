import React, { useState, useEffect, useContext } from 'react';
import './sheetsPage.css';

import Nav from '../nav/navBar';

import { AuthContext } from '../authContext';

const Sheets = () => {
    const { author } = useContext(AuthContext);
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3050/api/sheetCollection?${author}`)
            .then((response) => response.json())
            .then((data) => {
                setSheets(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError('Error fetching sheets');
                setLoading(false);
            });
    }, [author]);

    const deleteSheet = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3050/api/sheet/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (!response.ok) {
                console.log(response);
                throw new Error(`Failed to delete sheet with id: ${id}`);
            }
            window.location.reload();
        } catch (error) {
            console.error('Error deleting sheet:', error);
        }
    };

    const renderSheets = () => {
        if (loading) {
            return (
                <div className="sheets loading">
                    <h1>Loading sheets...</h1>
                </div>
            );
        }

        if (error) {
            return (
                <div className="sheets error">
                    <h1>{error}</h1>
                </div>
            );
        }

        if (!sheets || sheets.length === 0) {
            return (
                <div className="sheets noSheets">
                    <h1>No sheets found</h1>
                </div>
            );
        }
        return (
            <ul className="sheetList">
                {sheets.map((sheet) => (
                    <li key={sheet.id} className="sheetItem">
                        <h3>{JSON.parse(sheet.settings).title}</h3>
                        <a href={`/builder/${sheet.id}`} className="sheetLink">
                            open
                        </a>{' '}
                        <button
                            className="delete"
                            onClick={() => {
                                deleteSheet(sheet.id);
                            }}
                        >
                            delete
                        </button>
                    </li>
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

export default Sheets;
