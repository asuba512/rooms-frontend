import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableComponent from '../TableComponent/TableComponent'
import { RootState } from '../../redux/type'
import {
    getCourses,
    deleteBulkCourses,
    deleteCourse,
    createCourse,
    getCourseById,
    editCourse,
} from '../../redux/courses/coursesThunks'
import { ICourse } from '../../redux/courses/type'
import CourseDetail from './CourseDetail'
import { destroyCourseDetailActionCreator } from '../../redux/store'

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
        dispatch(getCourseById(id))
    }

    const onViewDetailCloseHandler = () => {
        dispatch(destroyCourseDetailActionCreator())
    }

    const onAddNewHandler = (data: ICourse) => {
        dispatch(createCourse(data))
    }

    const onEditHandler = (data: ICourse) => {
        dispatch(editCourse(data))
    }

    const onDeleteHandler = (id: number) => {
        dispatch(deleteCourse(id))
    }

    const onDeleteBulkHandler = (ids: number[]) => {
        dispatch(deleteBulkCourses(ids))
    }

    return (
        <>
            <TableComponent
                title="Courses"
                rowData={courses}
                cells={cells}
                defaultSort="abbreviation"
                uniqueKeys={['abbreviation']}
                onViewDetail={onViewDetailHandler}
                onAddNew={isAdmin ? onAddNewHandler : undefined}
                onEdit={isAdmin ? onEditHandler : undefined}
                onDelete={isAdmin ? onDeleteHandler : undefined}
                onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
            />
            <CourseDetail
                course={coursesState.course || undefined}
                isAdmin={isAdmin}
                handleClose={onViewDetailCloseHandler}
            />
        </>
    )
}

export default CoursesTable
