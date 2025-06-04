import pandas as pd 


df = pd.read_csv("/workspaces/options_greeks_iv/dataCleaning/iv_data.csv")

df['call_iv_prev_change'] = round((df['iv_call_percent'] - df['iv_call_percent'].shift(1)), 2)
df['put_iv_prev_change'] = round((df['iv_put_percent'] - df['iv_put_percent'].shift(1)), 2)


df['someOfPriceChange'] = (df['call_iv_prev_change'] + df['put_iv_prev_change'])


df.to_csv("data.csv")