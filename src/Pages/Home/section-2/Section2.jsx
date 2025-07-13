import React from 'react';
import { Link } from 'react-router';
import { Typewriter } from 'react-simple-typewriter';

const Section2 = () => {

    const handleExploreMore = () => {
        const nextSection = document.getElementById('explore-more-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth',
            });
        }
    };
    return (
            <div className="hero md:h-screen ">
                <div className="hero-content flex-col lg:flex-row">
                    <img
                        src="https://hms.harvard.edu/sites/default/files/media/Students-1.png"
                        className="md:max-w-2xl rounded-lg shadow-2xl shadow-black
                        md:shadow-2xl md:shadow-black"
                    />
                    <div>

                        <h1 className="md:text-5xl text-3xl font-bold">Medical camp <span style={{ fontWeight: 'bold', marginTop: '50px', textAlign: 'center' }}>
                            <span>
                                {' '}
                                <span className="text-indigo-500">
                                    <Typewriter
                                        words={['Research', 'Team work', 'real world experience', 'Gain Experince']}
                                        loop={0} // 0 = infinite loop
                                        cursor
                                        cursorStyle='|'
                                        typeSpeed={50}
                                        deleteSpeed={50}
                                        delaySpeed={2000}
                                    />
                                </span>
                            </span>
                        </span></h1>
                        <p className="py-6">
                            As a freelancer or entrepreneur, starting your business is like planting a seed. It takes plenty of time and money. Then you have to nurture it without knowing when the tree will finally take root and provide for you in return. It could be tough but when your gig starts to flourish, it makes all the hard work and dedication worth it.
                        </p>
                        <Link to='/availableBootcamp' className="btn  text-white bg-indigo-500 hover:text-indigo-500 hover:bg-white hover:border-indigo-500" onClick={handleExploreMore}>Get Started</Link>
                    </div>
                </div>
        </div>
    );
};

export default Section2;