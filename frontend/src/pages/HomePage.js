import React from 'react';
import Test from './Test';
//import { useNavigate } from 'react-router-dom';

function HomePage() {
    //const navigate = useNavigate();

    return (
        <>
            <div className = 'page-center'>
                <h1 style = {{ textAlign: "center", marginBottom: "1.5rem" }}>
                    TerpTrace
                </h1>
                <button>
                    Lost Something?
                </button>
                <button>
                    Found an item?
                </button>
                <Test />
            </div>
        </>
    );
}

export default HomePage;