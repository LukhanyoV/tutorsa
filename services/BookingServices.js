const BookingService = (db) => {
    // get tutor ratings
    const getTutorRating = async (tutor_id) => {
        return await db.manyOrNone("SELECT rating_given as weight, COUNT(rating_given) as count FROM ratings WHERE rating_tutor = $1 GROUP BY rating_given", [tutor_id])
    }

    // send the rating
    const rateTutor = async (tutor, student, rating, feedback) => {
        await db.none("INSERT INTO ratings (rating_tutor, rating_student, rating_given, rating_feedback) VALUES ($1, $2, $3, $4)", [tutor, student, rating, feedback])
    }

    return {
        getTutorRating,
        rateTutor
    }
}

module.exports = BookingService