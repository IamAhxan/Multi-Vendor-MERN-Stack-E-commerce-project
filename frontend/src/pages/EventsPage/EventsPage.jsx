import React from 'react'
import Header from '../../components/Layout/Header/Header'
import EventsCard from '../../components/Events/EventsCard'

const EventsPage = () => {
    return (
        <div>
            <Header activeHeading={4} />
            <EventsCard active={true} />
            <EventsCard active={true} />
        </div>
    )
}

export default EventsPage