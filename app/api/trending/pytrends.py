# fetch_trends.py
from pytrends.request import TrendReq
import json

def get_trending_searches():
    pytrends = TrendReq(hl='en-US', tz=360)
    trending_searches_df = pytrends.trending_searches(pn='united_states')
    trending_searches = trending_searches_df[0].tolist()
    return trending_searches

def main():
    trends = get_trending_searches()
    print(json.dumps(trends))

if __name__ == "__main__":
    main()
