import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableComponent from '../TableComponent/TableComponent'
import { RootState } from '../../redux/type'
import {
    getCourses,
    deleteBulkCourses,
    deleteCourse,
    createCourse,
} from '../../redux/courses/coursesThunks'
import { ICourse } from '../../redux/courses/type'

function CoursesTable() {
    const dispatch = useDispatch()
    const coursesState = useSelector((state: RootState) => state.coursesAPI)
    const isAdmin = useSelector(
        (state: RootState) => state.auth?.role === 'admin'
    )
    const courses = coursesState?.courses || []
    const cells = {
        abbreviation: { title: 'Abbreviation' },
        name: { title: 'Name' },
        credits: { title: 'Credits', isNumeric: true },
    }

    useEffect(() => {
        dispatch(getCourses())
    }, [dispatch])

    const onViewDetailHandler = (id: number) => {
        console.log(id)
    }

    const onAddNewHandler = (data: ICourse) => {
        dispatch(createCourse(data))
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
            rowData={courses}
            cells={cells}
            defaultSort="abbreviation"
            uniqueKey="abbreviation"
            onViewDetail={onViewDetailHandler}
            onAddNew={isAdmin ? onAddNewHandler : undefined}
            onDelete={isAdmin ? onDeleteHandler : undefined}
            onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
        />
    )
}

export default CoursesTable
