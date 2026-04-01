import React from 'react'
import Header from '../../components/Layout/Header/Header'
import EventsCard from '../../components/Events/EventsCard'
import { useSelector } from 'react-redux'
import Loader from '../../components/Layout/Loader'

const EventsPage = () => {
    const { allEvents, isLoading } = useSelector((state) => state.events);

    if (isLoading) return <Loader />;

    return (
        <div>
            <Header activeHeading={4} />
            {allEvents && allEvents.length > 0 ? (
                allEvents.map((event) => (
                    <EventsCard active={true} data={event} key={event._id} />
                ))
            ) : (
                <div className="w-full flex items-center justify-center py-10">
                    <h3 className="text-[20px] font-[500]">No events found!</h3>
                </div>
            )}
        </div>
    )
}

export default EventsPage