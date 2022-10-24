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
    message_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_sender) REFERENCES members(id),
    FOREIGN KEY (message_receiver) REFERENCES members(id)
);