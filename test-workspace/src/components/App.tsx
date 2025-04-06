import React, { useEffect, useState } from 'react';

interface Props {
    title: string;
}

const App: React.FC<Props> = ({ title }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('App component mounted');
        console.log('This log is commented out');
        console.error('Found an error in initialization');
        return () => {
            console.log('App component will unmount');
        };
    }, []);

    const handleClick = () => {
        console.log('Button clicked', { count });
        console.warn('Count is getting high!');
        setCount(prev => prev + 1);
    };

    return (
        <div>
            <h1>{title}</h1>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
};

export default App; 