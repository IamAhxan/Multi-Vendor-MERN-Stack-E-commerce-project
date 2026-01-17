import React, { useState } from 'react'; // 1. Added useState import
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer';
import styles from '../styles/styles';

const FAQPage = () => {
    return (
        <div>
            <Header activeHeading={5} />
            <Faq />
            <Footer />
        </div>
    );
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState(0);

    const toggleTab = (tab) => {
        if (activeTab === tab) {
            setActiveTab(0);
        } else {
            setActiveTab(tab);
        }
    };

    // 2. Moved the return INSIDE the component function
    return (
        <div className={`${styles.section} my-8`}>
            <h2 className='text-3xl font-bold text-gray-900 mb-8'>FAQ</h2>
            <div className="mx-auto space-y-4">
                {/* Single FAQ */}
                <div className="border-b border-gray-200 pb-4">
                    <button className="flex items-center justify-between w-full" onClick={() => toggleTab(1)}>
                        <span className="text-lg font-medium text-gray-900">How do i track my order</span>
                        {activeTab === 1 ? (
                            <svg className='h-5 w-5 text-gray-500 shrink-0' fill='none' viewBox="0 0 24 24" stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        ) : (
                            <svg className='h-5 w-5 text-gray-500 shrink-0' fill='none' viewBox="0 0 24 24" stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}

                    </button>
                    {/* 3. Added the actual answer content to show/hide */}
                    {activeTab === 1 && (
                        <div className="mt-4">
                            <p className="text-base text-gray-500">
                                You can track your order status in your user dashboard under "Orders".
                            </p>
                        </div>
                    )}
                </div>
                {/*  */}
                <div className="border-b border-gray-200 pb-4">
                    <button className="flex items-center justify-between w-full" onClick={() => toggleTab(2)}>
                        <span className="text-lg font-medium text-gray-900">What is your return Policy</span>
                        {activeTab === 2 ? (
                            <svg className='h-5 w-5 text-gray-500 shrink-0' fill='none' viewBox="0 0 24 24" stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        ) : (
                            <svg className='h-5 w-5 text-gray-500 shrink-0' fill='none' viewBox="0 0 24 24" stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}

                    </button>
                    {/* 3. Added the actual answer content to show/hide */}
                    {activeTab === 2 && (
                        <div className="mt-4">
                            <p className="text-base text-gray-500">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestias vel voluptate nemo dolorem rem magnam hic mollitia magni, consectetur architecto..
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; // 4. Closed the Faq component correctly

export default FAQPage;