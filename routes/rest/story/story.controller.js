const storyService = require("./story.service");

exports.insertStory = (request, response) => {
  const storyDetails = {
    storytitle: request.body.storytitle,
    story: request.body.story,
    fname: request.body.firstname,
    lname: request.body.lastname,
  };
  try {
    storyService.authorInsert(storyDetails, (err, data) => {
      if (err) {
        response.send(err.message);
      }
      response.send(data);
    });
  } catch (err) {
    response.send(err.message);
  }
};

exports.insertStoryExist = (request, response) => {
  const authorDetails = {
    authorID: request.body.authorID,
    secretpin: request.body.secretpin,
  };
  const storyDetails = {
    storytitle: request.body.storytitle,
    story: request.body.story,
  };
  try {
    storyService.verifyAuthor(authorDetails, storyDetails, (err, data) => {
      if (err) {
        response.send(err.message);
      }
      response.send(data);
    });
  } catch (err) {
    response.send(err.message);
  }
};

exports.storyStatus = (request, response) => {
  const authorDetails = {
    authorId: request.body.authorID,
    secretPin: request.body.secretpin,
  };
  try {
    storyService.verifyAuthStatus(authorDetails, (err, data) => {
      if (err) {
        return response.send(err.message);
      }
      response.send(data);
    });
  } catch (e) {
    response.send(e.message);
  }
};

exports.storyDetails = (request, response) => {
  try {
    storyService.selectStoryDetails((err, data) => {
      if (err) {
        return response.send(err.message);
      }
      response.send(data);
    });
  } catch (e) {
    response.send(e.message);
  }
};


