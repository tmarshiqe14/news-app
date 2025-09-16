import mongoose, { Schema, Document, Types } from 'mongoose';

// TypeScript interface for Message
export interface IMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// TypeScript interface for Chat
export interface IChat extends Document {
  sessionId: string;
  articleId: Types.ObjectId;
  articleTitle: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Message (subdocument)
const MessageSchema: Schema = new Schema({
  text: {
    type: String,
    required: [true, 'Message text is required'],
    minlength: [1, 'Message text must be at least 1 character'],
    maxlength: [2000, 'Message text cannot exceed 2000 characters'],
    trim: true
  },
  isUser: {
    type: Boolean,
    required: [true, 'isUser flag is required']
  },
  timestamp: {
    type: Date,
    required: [true, 'Message timestamp is required'],
    default: Date.now
  }
}, {
  _id: false // Disable _id for subdocuments to keep them simple
});

// Mongoose schema for Chat
const ChatSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true,
    minlength: [10, 'Session ID must be at least 10 characters'],
    maxlength: [100, 'Session ID cannot exceed 100 characters'],
    trim: true
  },
  articleId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Article ID is required'],
    ref: 'Article' // Reference to Article model
  },
  articleTitle: {
    type: String,
    required: [true, 'Article title is required'],
    minlength: [10, 'Article title must be at least 10 characters'],
    maxlength: [500, 'Article title cannot exceed 500 characters'],
    trim: true
  },
  messages: {
    type: [MessageSchema],
    required: true,
    default: [],
    validate: {
      validator: function(messages: IMessage[]) {
        return messages.length <= 100;
      },
      message: 'Cannot have more than 100 messages per chat session'
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'chats'
});

// Create indexes for better performance
ChatSchema.index({ sessionId: 1 }, { unique: true });
ChatSchema.index({ articleId: 1 });
ChatSchema.index({ createdAt: -1 });

// Export the model
export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
