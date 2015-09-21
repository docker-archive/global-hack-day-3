import os
import sys
from flask import Flask, render_template
from flask.ext.mongoengine import MongoEngine

app = Flask(__name__)
app.config.from_object('config')

app.config["MONGODB_SETTINGS"] = { 
    "DB": os.environ.get("U_DB"),
    "USERNAME": os.environ.get("U_USER"),
    "PASSWORD": os.environ.get("U_PASS"),
    "HOST": "127.0.0.1",
    "PORT": 27017 }
db = MongoEngine(app)

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404
