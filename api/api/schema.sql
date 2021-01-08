DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS loc;

CREATE TABLE user (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE post (
    post_id INT AUTO_INCREMENT,
    loc_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content VARCHAR(512),
    PRIMARY KEY(post_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE loc (
    id INT AUTO_INCREMENT,
    lat DECIMAL(25,20),
    lng DECIMAL(25,20),
    PRIMARY KEY(id)
);