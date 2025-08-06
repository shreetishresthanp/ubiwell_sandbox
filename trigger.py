from pymongo import MongoClient
from datetime import datetime, timedelta

class MongoConnection:
    _client = MongoClient()
    
    def __init__(self):
        self._client = MongoClient("localhost", 27017)
        # print(self._client.list_database_names())
    
    def connectToDB(self, db = "Anomaly_Detection"):
       self._database = self._client.get_database(db)     
    #    print(self._database.list_collection_names())

    def connectToCollection(self, coll = "anomaly_results"):
        collection = self._database.get_collection(coll)
        return collection
    
class DailyStats:
    def __init__(self):
        self.date = now
        self.uid = ""
        self.lstm_count = 0
        self.if_count = 0
        self.daily_prompted_num = 0
        self.weekly_prompted_num = 0
        self.details = ""

    def __init__(self, uid="", lstm_count=0, if_count=0, daily_prompted_num=0, weekly_prompted_num=0, details=""):
        self.date = datetime.today().strftime("%Y-%m-%d")
        self.uid = uid
        self.lstm_count = lstm_count
        self.if_count = if_count
        self.daily_prompted_num = daily_prompted_num
        self.weekly_prompted_num = weekly_prompted_num
        self.details = details

class DailyStatsPerUID:
    def __init__(self):
        self._uid = ""
        self._daily_stats = DailyStats()

# initialize mongo collection
conn = MongoConnection()
conn.connectToDB()
anomaly_results = conn.connectToCollection()
stats_collection = conn.connectToCollection("aggregation")

# note current time
now = datetime.now()
start_of_day = datetime(now.year, now.month, now.day)
end_of_day = start_of_day + timedelta(days = 1)

# note weekday for weekly stats
weekday = now.weekday()
monday = start_of_day - timedelta(days=weekday)
sunday = monday + timedelta(days=6)

start_str = start_of_day.strftime("%Y-%m-%d %H:%M:%S")
end_str = end_of_day.strftime("%Y-%m-%d %H:%M:%S")

# Monday–Friday window
weekday = now.weekday()
monday = start_of_day - timedelta(days=weekday)
sunday = monday + timedelta(days=7)

monday_str = monday.strftime("%Y-%m-%d %H:%M:%S")
sunday_str = sunday.strftime("%Y-%m-%d %H:%M:%S")

# Query for today's data
today_docs = list(anomaly_results.find({
    "start_time": {
        "$gte": start_str,
        "$lt": end_str
    }
}))

# Query for weekly prompts
week_docs = list(anomaly_results.find({
    "start_time": {
        "$gte": monday_str,
        "$lt": sunday_str
    }
}))

# print([x for x in today_docs])

dailystatsperuid = dict()

# Daily Aggregation
for doc in today_docs:
    if doc is None or len(doc) == 0:
        print("ERROR: Empty document")
        continue
    if doc["uid"] is None or len(doc["uid"]) == 0:
        print("ERROR: Invalid user id")
        continue    
    uid = doc["uid"]
    if uid not in dailystatsperuid:
        dailystatsperuid[uid] = DailyStats()
    dailystatsperuid[uid].uid = uid
    if "reason" in doc:
        dailystatsperuid[uid].details = doc["reason"]
    if "is_anomaly_lstm" in doc and doc["is_anomaly_lstm"] == 1:
        dailystatsperuid[uid].lstm_count += 1
    if "is_anomaly_isolation" in doc and doc["is_anomaly_isolation"] == 1:
        dailystatsperuid[uid].if_count += 1
    if "did_prompt" in doc and doc["did_prompt"] == True:
        dailystatsperuid[uid].daily_prompted_num += 1

# Weekly Aggregation
for doc in week_docs:
    uid = doc.get("uid")
    if doc.get("did_prompt") is True:
        dailystatsperuid[uid].weekly_prompted_num += 1
    
# Store or print results
for uid, stats in dailystatsperuid.items():
    # print(uid, stats.__dict__)
    # Insert or update in DB
    try:
        stats_collection.update_one(
            {"uid": uid, "date": stats.date},
            {"$set": stats.__dict__},
            upsert=True
        )
    except Exception as e:
        print("Error adding to aggregation db")
        print(e);



