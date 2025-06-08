import React, { useEffect, useState } from 'react';

function Test() {
    const [message, setMessage] = useState('');

    useEffect(() => {
      fetch('http://localhost:5001/').then((res) => res.text()).then((data) => {
        setMessage(data);
      }).catch((err) => {
        console.error('Error fetching:', err);
      })
    })

    return (
        <div>
            <h1>Testing server connection</h1>
            <p> Message from backend: {message} </p>
        </div>
    );
    
}

export default Test;