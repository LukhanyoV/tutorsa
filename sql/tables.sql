CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    post_author INT NOT NULL,
    post_text TEXT NOT NULL,
    post_image TEXT,
    post_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_author) REFERENCES members(id)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    comment_parent INT NOT NULL,
    comment_author INT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_image TEXT,
    comment_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_author) REFERENCES members(id),
    FOREIGN KEY (comment_parent) REFERENCES posts(post_id)
);

CREATE TABLE replies (
    reply_id SERIAL PRIMARY KEY,
    reply_parent INT NOT NULL,
    reply_author INT NOT NULL,
    reply_text TEXT NOT NULL,
    reply_image TEXT,
    reply_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_author) REFERENCES members(id),
    FOREIGN KEY (reply_parent) REFERENCES comments(comment_id)
);

CREATE TABLE liked (
    liked_id SERIAL PRIMARY KEY,
    liked_post INT NOT NULL,
    liked_by INT NOT NULL,
    FOREIGN KEY (liked_by) REFERENCES members(id),
    FOREIGN KEY (liked_post) REFERENCES posts(post_id)
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    message_sender INT NOT NULL,
    message_receiver INT NOT NULL,
    message_text TEXT NOT NULL,
    message_image TEXT,
    message_read BOOLEAN DEFAULT 'f',
    message_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_sender) REFERENCES members(id),
    FOREIGN KEY (message_receiver) REFERENCES members(id)
);

CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    grade_name TEXT NOT NULL
);

CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name TEXT NOT NULL
);

CREATE TABLE tutor_subjects (
    ts_id SERIAL PRIMARY KEY,
    ts_tutor INT NOT NULL,
    ts_grade INT NOT NULL,
    ts_subject INT NOT NULL,
    FOREIGN KEY (ts_tutor) REFERENCES members(id),
    FOREIGN KEY (ts_grade) REFERENCES grades(grade_id),
    FOREIGN KEY (ts_subject) REFERENCES subjects(subject_id)
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    booking_item INT NOT NULL,
    booking_student INT NOT NULL,
    booking_date TIMESTAMP NOT NULL,
    booking_status TEXT DEFAULT 'pending',
    booking_feedback TEXT,
    booking_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_item) REFERENCES tutor_subjects(ts_id),
    FOREIGN KEY (booking_student) REFERENCES members(id)
);

CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    rating_tutor INT NOT NULL,
    rating_student INT NOT NULL,
    rating_given INT NOT NULL,
    rating_feedback TEXT NOT NULL,
    FOREIGN KEY (rating_tutor) REFERENCES members(id),
    FOREIGN KEY (rating_student) REFERENCES members(id)
);

-- SESSION TABLE
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
