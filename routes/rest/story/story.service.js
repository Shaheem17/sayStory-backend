const psqlDb = require("../../../database/psql");

exports.authorInsert = (storyDetails, callback) => {
  const authorquery = {
    text:
      "INSERT INTO author(first_name, last_name, secret_pin) VALUES($1, $2, $3) RETURNING author_id,secret_pin",
    values: [
      storyDetails.fname,
      storyDetails.lname,
      Math.floor(1000 + (9999 - 1000) * Math.random()),
    ],
  };
  psqlDb.query(authorquery, (err, res) => {
    if (err) {
      return callback({ message: "Error Submitting Story" });
    } else {
      const authorDetails = {
        authorID: res.rows[0].author_id,
        secretPin: res.rows[0].secret_pin,
      };
      storyQuery(storyDetails, authorDetails, callback);
    }
  });
};

exports.verifyAuthor = (authorDetails, storyDetails, callback) => {
  const authquery = {
    text: "SELECT secret_pin FROM author WHERE author_id = $1",
    values: [authorDetails.authorID],
  };
  psqlDb.query(authquery, (err, res) => {
    if (err) {
      callback({ message: "Error Finding Author" });
    } else {
      const secretPIN = res.rows[0].secret_pin;
      authAuthor(secretPIN, authorDetails, storyDetails, callback);
    }
  });
};

exports.verifyAuthStatus = (authorDetails, callback) => {
  const authquery = {
    text: "SELECT secret_pin FROM author WHERE author_id = $1",
    values: [authorDetails.authorId],
  };

  psqlDb.query(authquery, (err, res) => {
    if (err) {
      return callback({ message: "Oops! Something went wrong" });
    }
    if (
      res.rows[0] !== undefined &&
      authorDetails.secretPin === res.rows[0].secret_pin
    ) {
      selectStory(authorDetails.authorId, callback);
    } else {
      callback({ message: "Invalid Author ID or Secret Pin" });
    }
  });
};

exports.selectStoryDetails = (callback) => {
  const storyselect = {
    text:
      "SELECT story_id,story_title,story_content,created_at FROM story WHERE status = $1",
    values: [true],
  };
  psqlDb.query(storyselect, (err, res) => {
    if (err) {
      callback({ message: "Error Fetching Story" });
    } else {
      getStoryData(res, callback);
    }
  });
};

const getStoryData = (res, callback) => {
    const storyDetails = [];
    for (var i = 0; i < res.rows.length; i++) {
      const storyID = res.rows[i].story_id;
      const storyTitle = res.rows[i].story_title;
      const story = res.rows[i].story_content;
      const date = res.rows[i].created_at;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      storyDetails[i] = {
        storyid: storyID,
        storytitle: storyTitle,
        story: story,
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
      };
    }
    callback(null, storyDetails);
  };

const selectStory = (authorId, callback) => {
  const storyselect = {
    text: "SELECT story_id FROM story_author_mapping WHERE author_id = $1",
    values: [authorId],
  };
  psqlDb.query(storyselect, (err, res) => {
    if (err) {
      callback({ message: "Oops! Something went wrong" });
    } else {
      const storyId = res.rows[0].story_id;
      getStoryStatus(storyId, callback);
    }
  });
};

const getStoryStatus = (storyid, callback) => {
  const storyStatusQuery = {
    text: "SELECT status FROM story WHERE story_id = $1",
    values: [storyid],
  };
  psqlDb.query(storyStatusQuery, (err, res) => {
    if (err) {
      callback({ message: "Oops! Something went wrong" });
    } else {
      callback(null, res.rows[0].status);
    }
  });
};

const authAuthor = (secretPIN, authorDetails, storyDetails, callback) => {
  if (secretPIN !== undefined && secretPIN === authorDetails.secretpin) {
    storyQuery(storyDetails, authorDetails, callback);
  } else callback({ message: "Invalid Author ID or Secret Pin" });
};

const storyQuery = (storyDetails, authorDetails, callback) => {
  const storyquery = {
    text:
      "INSERT INTO story(story_title, story_content) VALUES($1, $2) RETURNING story_id",
    values: [storyDetails.storytitle, storyDetails.story],
  };
  psqlDb.query(storyquery, (err, res) => {
    if (err) {
      callback({ message: "Error Submitting Story" });
    } else {
      const storyID = res.rows[0].story_id;
      samQuery(storyID, authorDetails, callback);
    }
  });
};

const samQuery = (storyID, authorDetails, callback) => {
  const samquery = {
    text:
      "INSERT INTO story_author_mapping(author_id, story_id) VALUES($1, $2) RETURNING sam_id",
    values: [authorDetails.authorID, storyID],
  };
  psqlDb.query(samquery, (err, res) => {
    if (err) {
      callback({ message: "Error Submitting Story" });
    } else {
      const authorCredentials = {
        authorID: authorDetails.authorID,
        secretPin: authorDetails.secretPin,
        message: "Your Story is Under Review",
      };
      callback(null, authorCredentials);
    }
  });
};
