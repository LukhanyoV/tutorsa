const BookingService = (db) => {
    // get tutor ratings
    const getTutorRating = async (tutor_id) => {
        return await db.manyOrNone("SELECT rating_given as weight, COUNT(rating_given) as count FROM ratings WHERE rating_tutor = $1 GROUP BY rating_given", [tutor_id])
    }

    // send the rating
    const rateTutor = async (tutor, student, rating, feedback) => {
        await db.none("INSERT INTO ratings (rating_tutor, rating_student, rating_given, rating_feedback) VALUES ($1, $2, $3, $4)", [tutor, student, rating, feedback])
    }

    // get subjects 
    const getSubjects = async () => {
        return await db.any("SELECT * FROM subjects");
    }

    // get grades
    const getGrades = async () => {
        return await db.any("SELECT * FROM grades");
    }

    // add tutor subject
    const addTutorSubject = async (tutor_id, subject_id, grade_id) => {
        await db.none("INSERT INTO tutor_subjects (ts_tutor, ts_subject, ts_grade) VALUES ($1, $2, $3)", [tutor_id, subject_id, grade_id])
    }

    // get tutor subjects
    const getTutorSubjects = async (tutor_id) => {
        return await db.manyOrNone(`
        SELECT ts.ts_id AS id, s.subject_name AS subject, g.grade_name AS grade 
        FROM tutor_subjects AS ts 
        JOIN members AS m 
        ON m.id = ts.ts_tutor 
        JOIN subjects AS s 
        ON s.subject_id = ts.ts_subject 
        JOIN grades AS g 
        ON g.grade_id = ts.ts_grade 
        WHERE ts.ts_tutor = $1
        `, [tutor_id])
    }

    // remove tutor subject
    // careful tutor should remove only their own added subjects
    const removeTutorSubject = async (key, id) => {
        await db.none("DELETE FROM tutor_subjects WHERE ts_id = $1 AND ts_tutor = $2", [key, id])
    }

    // search for tutor by subject and / or grade
    const searchForTutor = async (subject_id, grade_id) => {
        const sql = `SELECT m.id, m.fullname, s.subject_name, g.grade_name  
        FROM tutor_subjects AS ts 
        JOIN members AS m 
        ON m.id = ts.ts_tutor 
        JOIN subjects AS s 
        ON s.subject_id = ts.ts_subject 
        JOIN grades AS g 
        ON g.grade_id = ts.ts_grade `

        // new idea instead of if ladder
        // subject and grade OR subject OR grade
        if(subject_id && grade_id){
            let query = sql+`WHERE ts.ts_subject = $1 AND ts.ts_grade = $2`
            return await db.any(query, [subject_id, grade_id])
        } else if(subject_id){
            let query = sql+`WHERE ts.ts_subject = $1`
            return await db.any(query, [subject_id])
        } else if(grade_id){
            let query = sql+`WHERE ts.ts_grade = $1`
            return await db.any(query, [grade_id])
        }
        return []
    }

    // create booking
    const createBooking = async (id, item, date) => {
        await db.none("INSERT INTO bookings (booking_student, booking_item, booking_date) VALUES ($1, $2, $3)", [id, item, date])
    }

    // get bookings
    const getUserBookings = async (user) => {
        return await db.any(`
            SELECT b.booking_id AS id, 
            m.fullname AS student, m2.fullname AS tutor, 
            s.subject_name AS subject, g.grade_name AS grade, 
            b.booking_date AS date, b.booking_status AS status, 
            b.booking_feedback AS feedback
            FROM bookings AS b
            JOIN members AS m 
            ON b.booking_student = m.id 
            JOIN tutor_subjects AS ts 
            ON b.booking_item = ts.ts_id 
            JOIN subjects AS s 
            ON ts.ts_subject = s.subject_id 
            JOIN grades AS g 
            ON ts.ts_grade = g.grade_id 
            JOIN members AS m2 
            ON ts.ts_tutor = m2.id 
            WHERE ts.ts_tutor = $1 OR b.booking_student = $1 
            ORDER BY booking_id DESC
        `, [user])
    }

    // tutor accept booking
    const updateBookingStatus = async (id, status, feedback, user) => {
        // make sure user updates own entry
        // if(await db.oneOrNone("SELECT ts.ts_tutor FROM tutor_subjects AS ts JOIN bookings AS b ON ts.ts_id = b.booking_item WHERE ts.ts_id = $1 AND (ts.ts_tutor = $2 OR b.booking_student = $2)", [id, user])){
            await db.none("UPDATE bookings SET booking_status = $1, booking_feedback = $2 WHERE bookings.booking_id = $3", [status, feedback, id])
        // }
    }

    return {
        getTutorRating,
        rateTutor,
        getSubjects,
        getGrades,
        addTutorSubject,
        getTutorSubjects,
        removeTutorSubject,
        searchForTutor,
        createBooking,
        getUserBookings,
        updateBookingStatus
    }
}

module.exports = BookingService