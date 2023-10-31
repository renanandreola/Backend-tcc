import numpy as np # trabalha com dados multidimenisonais e funções matemáticas
import pandas as pd # manipulação de analise de dados em massa

import warnings
import math
import requests
warnings.filterwarnings('ignore')

url = "https://www.fundamentus.com.br/resultado.php"

header = {
    "User-Agent": "Mozilla/5.0"
}

r = requests.get(url, headers=header)

df = pd.read_html(r.text, decimal=',', thousands='.')[0]

# print("[DF]", df['Papel'])

for coluna in ['Div.Yield', 'Mrg Ebit', 'Mrg. Líq.', 'ROIC', 'ROE', 'Cresc. Rec.5a']:
    df[coluna] = df[coluna].str.replace('.', '')
    df[coluna] = df[coluna].str.replace(',', '.')
    df[coluna] = df[coluna].str.rstrip('%').astype('float') / 100
    
df = df[( df['Liq.2meses'] > 1000000) & (df['P/L'] > 0)]

ranking = pd.DataFrame()

ranking['pos'] = range(1,101)

ranking['EV/EBIT'] = df[ df['EV/EBIT'] > 0 ].sort_values(by=['EV/EBIT'])['Papel'][:100].values

ranking['P/L'] = df.sort_values(by=['P/L'])['Papel'][:100].values

ranking['ROIC'] = df.sort_values(by=['ROIC'], ascending=False)['Papel'][:100].values

ranking['ROE'] = df.sort_values(by=['ROE'], ascending=False)['Papel'][:100].values

a = ranking.pivot_table(columns='EV/EBIT')
b = ranking.pivot_table(columns='ROIC')
c = ranking.pivot_table(columns='P/L')
d = ranking.pivot_table(columns='ROE')

t = pd.concat([a,b,c,d])

rank = t.dropna(axis=1).sum()

rank = rank.sort_values()[:10]

# filtro de graham

df2 = df.set_index('Papel')

indica = []
for i in range(10):
    pl = df2.loc[rank.index[i], 'P/L']
    pvp = df2.loc[rank.index[i], 'P/VP']
    cot = df2.loc[rank.index[i], 'Cotação']
    lpa = cot / pl
    vpa = cot / pvp
    
    graham = math.sqrt(22.5 * lpa * vpa)
    
    if graham > (cot):
        indica.append(rank.index[i])
        
# print('Lista de ativos recomendados segundo a Magic Formula e filtrados pelo preço justo de Graham: ')
print(indica)
