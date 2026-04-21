import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IFeedback extends Document {
  text: string
  rating: number
  imageUrl?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  createdAt: Date
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    text:      { type: String, required: true, maxlength: 2000 },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    imageUrl:  { type: String },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  },
  { timestamps: true }
)

// Derive simple sentiment from rating
FeedbackSchema.pre('save', function (next) {
  if (this.rating >= 4) this.sentiment = 'positive'
  else if (this.rating === 3) this.sentiment = 'neutral'
  else this.sentiment = 'negative'
  next()
})

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema)

export default Feedback
