from pytrends.request import TrendReq
import json
import sys

def get_trending_searches(country):
    pytrends = TrendReq(hl='en-US', tz=360)
    trending_searches_df = pytrends.trending_searches(pn=country)
    trending_searches = trending_searches_df[0].tolist()
    return trending_searches




def main(country):
    trends = get_trending_searches(country)
    print(json.dumps(trends))

    

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: fetch_trends.py <country>")
        sys.exit(1)
    country = sys.argv[1]
    main(country)
