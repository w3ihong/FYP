from pytrends.request import TrendReq


pytrend = TrendReq()

pytrend.build_payload(kw_list=['Messi'])
df = pytrend.interest_by_region()
df.head(15)

def main():
    trends = df
    print(df(trends))

