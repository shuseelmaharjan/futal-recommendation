import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';

const Banner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get('https://data.goldenfutureinstitute.com.np/api/all-banners/');
                setBanners(response.data);
            } catch (error) {
                console.error('Error fetching the banners:', error);
            }
        };

        fetchBanners();
        
    }, []);

    

    return (
        <div className="relative">
            <Carousel 
                autoPlay 
                infiniteLoop 
                interval={3000} 
                showThumbs={false} 
                showArrows={true} 
                showStatus={false}
                showIndicators={false}
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                        <button 
                            type="button" 
                            onClick={onClickHandler} 
                            title={label} 
                            className="absolute top-1/2 transform -translate-y-1/2 left-0 z-10 w-16 md:w-48 h-full flex items-center justify-center text-white focus:outline-none"
                            style={{ fontSize: '2.5rem' }}
                        >
                            ‹
                        </button>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                        <button 
                            type="button" 
                            onClick={onClickHandler} 
                            title={label} 
                            className="absolute top-1/2 transform -translate-y-1/2 right-0 z-10 w-16 md:w-48 h-full flex items-center justify-center text-white focus:outline-none"
                            style={{ fontSize: '2.5rem' }}
                        >
                            ›
                        </button>
                    )
                }
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="relative h-[50vh]">
                        <img src={banner.image} alt={banner.title} className="object-cover h-full w-full" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
                            <h3 className="text-2xl md:text-4xl">
                                {banner.title || "Welcome to Golden Future Institute"}
                            </h3>
                            <p className="mt-2 text-sm md:text-lg">
                                {banner.caption || ""}
                            </p>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
