const validateRegister = (data) => {
  if (!data.email || !data.username || !data.password) {
    return {
      error: {
        details: [{ message: "Email, username, and password are required" }],
      },
    };
  }
  if (!/\S+@\S+\.\S+/.test(data.email)) {
    return { error: { details: [{ message: "Invalid email format" }] } };
  }
  if (data.password.length < 6) {
    return {
      error: {
        details: [{ message: "Password must be at least 6 characters" }],
      },
    };
  }
  return { error: null };
};

const validateLogin = (data) => {
  if (!data.email || !data.password) {
    return {
      error: { details: [{ message: "Email and password are required" }] },
    };
  }
  return { error: null };
};

const validatePost = (data) => {
  if (!data.content && !data.hashtags) {
    return {
      error: { details: [{ message: "Content or hashtags required" }] },
    };
  }
  return { error: null };
};

const validateReel = (data) => {
  if (!data.description && !data.hashtags) {
    return {
      error: { details: [{ message: "Description or hashtags required" }] },
    };
  }
  return { error: null };
};

const validateComment = (data) => {
  if (!data.content) {
    return { error: { details: [{ message: "Comment content required" }] } };
  }
  if (data.content.length > 500) {
    return { error: { details: [{ message: "Comment too long" }] } };
  }
  return { error: null };
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePost,
  validateReel,
  validateComment,
};
