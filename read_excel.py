import pandas as pd

try:
    df = pd.read_excel("/Users/eduardoalejandro/Documents/cantu-project/SUPERVISOR TIENDAS.xlsx")
    print(df.to_string())
except Exception as e:
    print("Error:", e)
