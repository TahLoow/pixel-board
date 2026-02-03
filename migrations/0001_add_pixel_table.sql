-- Migration number: 0001
CREATE TABLE IF NOT EXISTS board (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    is_complete BOOLEAN NOT NULL DEFAULT(FALSE),
    created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS pixel (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    board_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    color INTEGER NOT NULL,

    created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY(board_id) REFERENCES board(id)
);

INSERT INTO board (width, height) VALUES (16, 10);

INSERT INTO pixel (board_id, position, color) VALUES (1, 17, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 18, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 19, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 20, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 21, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 22, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 23, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 33, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 34, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 35, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 36, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 37, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 38, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 39, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 42, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 43, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 44, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 45, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 49, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 50, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 51, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 52, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 53, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 54, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 55, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 58, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 59, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 60, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 61, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 62, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 65, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 66, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 67, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 68, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 69, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 70, 6);
INSERT INTO pixel (board_id, position, color) VALUES (1, 71, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 75, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 76, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 77, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 78, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 81, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 82, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 83, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 84, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 85, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 86, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 87, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 91, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 92, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 93, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 94, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 97, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 100, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 103, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 107, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 108, 2);
INSERT INTO pixel (board_id, position, color) VALUES (1, 109, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 110, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 111, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 112, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 114, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 115, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 116, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 117, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 118, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 120, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 121, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 124, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 125, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 126, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 127, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 128, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 137, 7);
INSERT INTO pixel (board_id, position, color) VALUES (1, 141, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 142, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 143, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 145, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 146, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 147, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 148, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 149, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 150, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 152, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 153, 1);
INSERT INTO pixel (board_id, position, color) VALUES (1, 154, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 155, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 156, 5);
INSERT INTO pixel (board_id, position, color) VALUES (1, 157, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 158, 3);
INSERT INTO pixel (board_id, position, color) VALUES (1, 159, 3);