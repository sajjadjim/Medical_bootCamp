import React from 'react';
import Section1 from './section-1/Section1';
import Section2 from './section-2/Section2';
import Section3 from './section-3/Section3';
import Count from './Coun t Information/Count';

const Home = () => {
    return (
        <div>
            <Section1></Section1>
            <Section2></Section2>
            <Count></Count>
            <Section3></Section3>
        </div>
    );
};

export default Home;