import React, { useEffect, useState } from 'react';

function DatabaseTest() {
    const [message, setMessage] = useState('');
        useEffect(() => {
          fetch('http://localhost:5001/firebaseTest').then((res) => res.json()).then((data) => {
            setMessage(data.message);
          }).catch((err) => {
            console.error('Error fetching:', err);
          })
        })
    return (
        <div>
            <h1>Testing database connection</h1>
            <p> Message from database: {message} </p>
        </div>
    );
}

export default DatabaseTest