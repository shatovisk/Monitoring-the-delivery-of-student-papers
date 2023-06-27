

create TABLE user_data(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    studentCardId INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    isActivated BOOLEAN,
    activationLink TEXT,
    UNIQUE(email, studentCardId)
)


create TABLE token(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    refreshTokenk TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_data (id)
)