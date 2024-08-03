import httpx
import json
import pandas as pd
from datetime import datetime, timedelta

result = []
geo_location = "IN"

# Calculate dates for last week
end_date = datetime.now()
print(end_date)
start_date = end_date - timedelta(days=7)
print(start_date)

# Format dates for the API request
end_date_str = end_date.strftime("%Y%m%d")
start_date_str = start_date.strftime("%Y%m%d")

url = f"https://trends.google.com/trends/api/dailytrends?hl=en-{geo_location}&tz=-180&ed={end_date_str}&geo=US&hl=en-US&ns=15"

try:
    response = httpx.get(url=url)
    response.raise_for_status()  # Check for request errors

    # Check if the response contains the expected data
    if response.text.startswith(")]}',"):
        data = json.loads(response.text[5:])  # Remove the initial characters
    else:
        print(f"Unexpected response format for date {end_date_str}: {response.text}")

    # Check if the required fields are present in the data
    if "default" in data and "trendingSearchesDays" in data["default"] and data["default"]["trendingSearchesDays"]:
        trending_searches_day = data["default"]["trendingSearchesDays"][0]

        # Extract the formatted date from the JSON data
        date = trending_searches_day.get("formattedDate", "Unknown Date")

        for trend in trending_searches_day.get("trendingSearches", []):
            trend_object = {
                "Title": trend["title"]["query"],
                "Traffic volume": trend.get("formattedTraffic", "N/A"),
                "Link": "https://trends.google.com/" + trend["title"]["exploreLink"],
                "Type": "Trend_topic",
                "Date": date,
                "Geo Location": geo_location
            }
            result.append(trend_object)

        print(result)
    else:
        print(f"No trending searches data available for date {end_date_str}")
except (httpx.RequestError, httpx.HTTPStatusError) as e:
    print(f"Request error for date {end_date_str}: {e}")
except json.JSONDecodeError as e:
    print(f"JSON decode error for date {end_date_str}: {e}")

# Save the result to a CSV file
df = pd.DataFrame(result)
df.to_csv("trends_last_week.csv", index=False)

# Load the CSV into a DataFrame for last week's data
df_last_week = pd.read_csv("trends_last_week.csv")

# Filter the DataFrame for the exact topic
exact_topic = "Technology"
filtered_df = df_last_week[df_last_week['Title'] == exact_topic]

# Print the filtered DataFrame
print(filtered_df)
