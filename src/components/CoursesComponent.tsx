import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableComponent from './TableComponent/TableComponent'
import { RootState } from '../redux/type'
import {
    getCourses,
    deleteBulkCourses,
    deleteCourse,
} from '../redux/courses/coursesThunks'

function CoursesComponent() {
    const dispatch = useDispatch()
    const coursesState = useSelector((state: RootState) => state.courses)
    const isAdmin = useSelector(
        (state: RootState) => state.auth?.role === 'admin'
    )
    const courses = coursesState?.courses || []
    const cells = {
        abbreviation: { title: 'Abbreviation', isNumeric: false },
        name: { title: 'Name', isNumeric: false },
        credits: { title: 'Credits', isNumeric: true },
    }

    useEffect(() => {
        dispatch(getCourses())
    }, [dispatch])

    const onViewDetailHandler = (id: number) => {
        console.log(id)
    }

    const onDeleteHandler = (id: number) => {
        dispatch(deleteCourse(id))
    }

    const onDeleteBulkHandler = (ids: number[]) => {
        dispatch(deleteBulkCourses(ids))
    }

    return (
        <TableComponent
            title="Courses"
            data={courses}
            cells={cells}
            defaultSort="abbreviation"
            onViewDetail={onViewDetailHandler}
            onDelete={isAdmin ? onDeleteHandler : undefined}
            onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
        />
    )
}

export default CoursesComponent
