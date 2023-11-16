import mongoose, { ObjectId, Model } from 'mongoose';
import Conversation from './ConversationModel';

interface TextContentProps {
  type: 'text';
  text: string;
}

interface ImageContentProps {
  type: 'image';
  image: string;
}

interface IMessage {
  conversation: ObjectId;
  recipient: ObjectId;
  sender: ObjectId;
  contentProps: TextContentProps | ImageContentProps;
  deletedBy: ObjectId;
}

interface MessageModel extends Model<IMessage> {
  setSnippet(doc: IMessage): void;
}

const messageSchema = new mongoose.Schema<IMessage, MessageModel>({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

    required: true
  },
  contentProps: {
    type: {
      type: mongoose.Schema.Types.String,
      enum: ['text', 'image'],
      required: true
    },
    image: {
      type: mongoose.Schema.Types.String,
      required: function () {
        return this.contentProps.type === 'image';
      }
    },
    text: {
      type: mongoose.Schema.Types.String,
      required: function () {
        return this.contentProps.type === 'text';
      }
    }
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

messageSchema.statics.setSnippet = async function (messageDoc) {
  let snippet: string;

  if (messageDoc.contentProps.type === 'text') {
    snippet = messageDoc.contentProps.text;
  } else if (messageDoc.contentProps.type === 'image') {
    snippet = 'Image';
  }

  await Conversation.findByIdAndUpdate(messageDoc.conversation, { snippet });
};

messageSchema.post('save', function () {
  Message.setSnippet(this);
});

const Message = mongoose.model<IMessage, MessageModel>(
  'Message',
  messageSchema
);

export default Message;