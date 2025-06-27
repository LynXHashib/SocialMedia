const { conversationSchema, messageSchema } = require('../database/models');
const mongoose = require('mongoose');
const { logging } = require('../modules/app');

const Conversation = mongoose.model('conversations', conversationSchema);
const Message = mongoose.model('messages', messageSchema);

const getOrCreateConversation = async (userA, userB) => {
  try {
    // Debug logging
    console.log('getOrCreateConversation called with:', { userA, userB });
    let conversation = await Conversation.findOne({
      participants: { $all: [userA, userB] },
    });

    console.log('Existing conversation found:', !!conversation);

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [userA, userB],
        updatedAt: new Date(),
      });

      await conversation.save();
      console.log('New conversation created:', conversation._id);
    } else {
      // Update the updatedAt field
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    return conversation;
  } catch (error) {
    logging(error);
    return res
      .status(500)
      .json({
        message: 'Internal server error while getting or creating conversation',
      });
  }
};

const conversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user?.id || req.session.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }
    const convo = await getOrCreateConversation(userId, id);
    const messages = await Message.find({
      conversationId: convo._id,
    })
      .populate('sender', 'username profilePicture')
      .populate('recipient', 'username profilePicture')
      .sort({ sentAt: 1 });

    res.json({
      success: true,
      conversation: convo,
      messages: messages,
    });
  } catch (err) {
    logging(err);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
    });
  }
};

module.exports = {
  conversation,
  getOrCreateConversation,
};
