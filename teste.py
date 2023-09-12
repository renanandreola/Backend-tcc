import yfinance as yf
import datetime
import matplotlib.pyplot as plt
import json
import io
import base64

def get_stock_historical_data(symbol):
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=7)  # 2 anos
    # start_date = end_date - datetime.timedelta(days=7)  # 2 anos

    data = yf.download(symbol, start=start_date, end=end_date)
    return data

symbol = "GFSA3.SA"  # Símbolo da ação na B3
stock_data = get_stock_historical_data(symbol)
# print(stock_data)
stock_data_json = stock_data.to_json(orient='split')
print(json.dumps(stock_data_json))

# Montando o gráfico
# plt.figure(figsize=(10, 6))
# plt.plot(stock_data.index, stock_data['Close'], label=f'Preço de Fechamento - {symbol}')
# plt.title(f'Dados Históricos de Preço de Fechamento para {symbol}')
# plt.xlabel('Data')
# plt.ylabel('Preço de Fechamento')
# plt.legend()
# plt.grid()
# # plt.show()

# buffer = io.BytesIO()
# plt.savefig(buffer, format='png')
# buffer.seek(0)
# image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
# buffer.close()

# print(image_base64)
