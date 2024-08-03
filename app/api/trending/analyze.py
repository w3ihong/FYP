from textblob import TextBlob

# Define a function to analyze sentiment based on text and represent it with emojis
def analyze_sentiment_with_emojis(text):
    # Analyze the sentiment using TextBlob
    blob = TextBlob(text)
    sentiment_polarity = blob.sentiment.polarity
    
    # Define sentiment levels and corresponding emojis
    if sentiment_polarity > 0.5:
        emoji = '😄'  # very positive
    elif 0 < sentiment_polarity <= 0.5:
        emoji = '😊'  # positive
    elif -0.5 <= sentiment_polarity < 0:
        emoji = '😞'  # negative
    else:
        emoji = '😡'  # very negative
    
    return f"Sentiment: {emoji} (polarity: {sentiment_polarity})"

# Test the function
text = "Sshhh🤫 We know that is your dream, right?"
sentiment_result = analyze_sentiment_with_emojis(text)
print(sentiment_result)

text = "I had an okay day, some things went well."
sentiment_result = analyze_sentiment_with_emojis(text)
print(sentiment_result)

text = "I had a terrible day, everything went wrong."
sentiment_result = analyze_sentiment_with_emojis(text)
print(sentiment_result)
