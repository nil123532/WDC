CREATE TABLE Notifications (
    NotiCancel boolean,
    NotiRespond boolean,
    NotiFinal boolean,
    user_id int,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);
