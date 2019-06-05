import requests 
from datetime import datetime, timedelta
import time
from multiprocessing.dummy import Pool as ThreadPool 

# defining the api-endpoint  
API_ENDPOINT = "http://127.0.0.1:5000/api/v1/rates"
stayDate = datetime.strptime("2019-06-16", "%Y-%m-%d")
interval = 15
dateArray = []

start = time.time()

for i in range(interval):
    begin = (stayDate + timedelta(i)).strftime("%Y-%m-%d")
    end = (stayDate + timedelta(i + 1)).strftime("%Y-%m-%d")
    dateArray.append((begin, end))

def getResponse(dateTuple):
    data = {'hotel_id': 'countryinn',
            'checkin': dateTuple[0],
            'checkout': dateTuple[1],
            'selected_currency': 'GBP'}
    r = requests.get(url=API_ENDPOINT, params=data)
    return (data['checkin'], r.json())


pool = ThreadPool(8) 
results = pool.map(getResponse, dateArray)

pool.close()
pool.join()

print("result is", results)
print("execution time", time.time() - start)