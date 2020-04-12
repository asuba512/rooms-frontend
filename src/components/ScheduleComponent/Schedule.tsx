import React from 'react'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment, { Moment } from 'moment'

import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import { IReservation } from '../../redux/reservation/type'

import './customReactBigCalendar.css'
import {
    mapEventTypeToColor,
    mapEventTypeToDarkerColor,
    mapEventTypeToString,
} from '../../redux/reservation/utils'

const localizer = momentLocalizer(moment)

interface ScheduleProps {
    title: string
    events: IReservation[]
    onRangeChange?: (datesVisible: Date[] | any) => void
}

function Schedule({ title, events, onRangeChange }: ScheduleProps) {
    const scheduleItems =
        events?.map((event) => {
            return {
                title: event.subject?.abbreviation,
                start: new Date(moment.utc(event.start).local().toISOString()),
                end: new Date(moment.utc(event.end).local().toISOString()),
                subtitle: event.name,
                type: event.type,
                rooms: event.roomNames?.join(', ') || '',
            }
        }) || []

    return (
        <>
            <Typography variant="h6">{title}</Typography>
            <Calendar
                localizer={localizer}
                events={scheduleItems}
                defaultView="week"
                views={['week']}
                min={new Date(0, 0, 0, 7)}
                max={new Date(0, 0, 0, 22)}
                onRangeChange={onRangeChange}
                components={{
                    event: ({
                        event,
                    }: {
                        event: {
                            title: string | undefined
                            start: Date
                            end: Date
                            subtitle: string
                            type: number
                            rooms: string
                        }
                    }) => {
                        const start = moment(event.start)
                        const end = moment(event.end)
                        return (
                            <Tooltip
                                arrow
                                title={mapEventTypeToString(event.type)}
                            >
                                <div
                                    style={{
                                        background: mapEventTypeToColor(
                                            event.type
                                        ),
                                        borderLeft: `4px solid ${mapEventTypeToDarkerColor(
                                            event.type
                                        )}`,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <div style={{ padding: 5 }}>
                                        <Typography
                                            style={{
                                                fontWeight: 500,
                                                fontSize: '1em',
                                            }}
                                        >
                                            {event.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{
                                                color: mapEventTypeToDarkerColor(
                                                    event.type
                                                ),
                                            }}
                                        >
                                            {event.rooms && event.rooms}
                                        </Typography>
                                        <div>
                                            <Typography
                                                variant="caption"
                                                style={{ fontSize: '0.6em' }}
                                            >
                                                {start.format('LT') +
                                                    '-' +
                                                    end.format('LT')}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                        )
                    },
                }}
            />
        </>
    )
}

export default Schedule
