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

    return {
        getTutorRating,
        rateTutor,
        getSubjects,
        getGrades,
        addTutorSubject,
        getTutorSubjects,
        removeTutorSubject,
        searchForTutor
    }
}

module.exports = BookingService