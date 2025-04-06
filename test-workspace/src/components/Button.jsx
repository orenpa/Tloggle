import React from 'react';

function Button({ onClick, children }) {
    const handleClick = (e) => {
        console.log('Button clicked', e.target);
        // console.log('Event details:', e);
        onClick(e);
    };

    console.log('Button rendering with children:', children);
    console.warn('Using deprecated button style');

    return (
        <button 
            onClick={handleClick}
            style={{ padding: '10px' }}
        >
            {children}
        </button>
    );
}

export default Button; 