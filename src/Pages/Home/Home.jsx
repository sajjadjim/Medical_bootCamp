import React, { useEffect } from 'react';
import Section1 from './section-1/Section1';
import Section2 from './section-2/Section2';
import Section3 from './section-3/Section3';
import Count from './Coun t Information/Count';
import Section4 from './Section 4/Section4';
import FeedBack from './Feedback Part/FeedBack';
import Faq from './FaQ/FaQ';

const Home = () => {
    useEffect(()=>{
        document.title = "Home";
    })
    return (
        <div>
            <Section1></Section1>
            <Section2></Section2>
            <Count></Count>
            <Section3></Section3>
            <Section4></Section4>
            <FeedBack></FeedBack>
            <Faq></Faq>
        </div>
    );
};

export default Home;