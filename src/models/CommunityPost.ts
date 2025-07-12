import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommunityPost extends Document {
  author: mongoose.Types.ObjectId;
  category: 'general' | 'housing' | 'jobs' | 'marketplace' | 'events' | 'help' | 'social';
  title: string;
  titleKo?: string;
  titleTl?: string;
  content: string;
  contentKo?: string;
  contentTl?: string;
  images: string[];
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  shares: number;
  views: number;
  isPinned: boolean;
  status: 'active' | 'hidden' | 'reported' | 'deleted';
  reportCount: number;
  reportReasons: string[];
  group?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'housing', 'jobs', 'marketplace', 'events', 'help', 'social'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  titleKo: {
    type: String,
    trim: true,
    maxlength: 200
  },
  titleTl: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  contentKo: {
    type: String,
    maxlength: 5000
  },
  contentTl: {
    type: String,
    maxlength: 5000
  },
  images: [{
    type: String,
    maxlength: 10
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'reported', 'deleted'],
    default: 'active'
  },
  reportCount: {
    type: Number,
    default: 0
  },
  reportReasons: [String],
  group: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityGroup',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
communityPostSchema.index({ author: 1, createdAt: -1 });
communityPostSchema.index({ category: 1, status: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ group: 1, status: 1, createdAt: -1 });
communityPostSchema.index({ isPinned: -1, createdAt: -1 });

// Text search index
communityPostSchema.index({
  title: 'text',
  titleKo: 'text',
  titleTl: 'text',
  content: 'text',
  contentKo: 'text',
  contentTl: 'text'
});

// Virtual for like count
communityPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
communityPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

const CommunityPost: Model<ICommunityPost> = mongoose.models.CommunityPost || mongoose.model<ICommunityPost>('CommunityPost', communityPostSchema);

export default CommunityPost;