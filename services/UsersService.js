const UsersService = (db) => {
    // find a user by email
    const findByEmail = async (email) => {
        return await db.oneOrNone("SELECT * FROM members WHERE email = $1", [email])
    }

    // find a user by id
    const findById = async (id) => {
        return await db.oneOrNone("SELECT * FROM members WHERE id = $1", [id])
    }

    // register a user
    const registerUser = async ({fullname, email, password, account_type}) => {
        // check if email taken before register
        const taken = await findByEmail(email)
        // taken is null if user is not found by email
        if(taken === null){
            await db.none("INSERT INTO members (fullname, email, password, account_type) VALUES ($1, $2, $3, $4)", [fullname, email, password, account_type])
            return true
        }
        return false
    }

    return {
        registerUser,
        findByEmail,
        findById
    }
}

module.exports = UsersService