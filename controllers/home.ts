import { Request, Response } from 'express';
import { logging } from '../lib/utils';

const home = async (req: Request, res: Response) => {
  try {
    return res.json({
      message:
        'Sign Up/Login to join with rest of other and access the magic of Social Media',
    });
  } catch (err) {
    logging;
  }
};

export default home;
