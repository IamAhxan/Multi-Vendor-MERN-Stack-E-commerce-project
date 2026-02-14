import React, { useEffect } from 'react'
import styles from '../../styles/styles'
import EventsCard from './EventsCard.jsx'
import { useSelector } from 'react-redux'

const Events = () => {
    const { allEvents, isLoading } = useSelector((state) => state.events)

    return (
        <div>
            {
                !isLoading && (
                    <div className={`${styles.section}`}>
                        <div className={`${styles.heading}`}>
                            <h1>Popular Events</h1>
                        </div>
                        <div className="w-full grid">
                            <EventsCard data={allEvents && allEvents[0]} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Events