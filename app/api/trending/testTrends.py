from pytrends.request import TrendReq
import json
import sys

def get_related_topics():
    pytrends = TrendReq(hl='en-US', tz=360, timeout=(10,25), proxies=['103.52.210.237:80/',], retries=2, backoff_factor=0.1, requests_args={'verify':False})
    pytrends.build_payload(kw_list=['technology'])
    related_topics_df = pytrends.related_topics()
    if 'technology' in related_topics_df:
        related_topics = related_topics_df['technology']['top'].to_dict(orient='records')
        return related_topics
    else:
        return []

def main():
    related_topics = get_related_topics()
    print(json.dumps(related_topics))

if __name__ == "__main__":
    main()
