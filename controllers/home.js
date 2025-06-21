const { logging } = require('../modules/app');

const home = async (req, res) => {
  try {
    return res.json({
      message:
        'Sign Up/Login to join with rest of other and access the magic of Social Media',
    });
  } catch (err) {
    logging;
  }
};
