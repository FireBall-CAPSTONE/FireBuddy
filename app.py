from flask import Flask, request, render_template, jsonify
import altair as alt
import pandas as pd
import numpy as np
import datetime
from scipy import stats

app = Flask(__name__, static_folder="static")

def load_data():
    df = pd.read_csv('fire_df.csv')
    df['Peak Brightness Date/Time (UT)']= pd.to_datetime(df['Peak Brightness Date/Time (UT)'])

    df['date'] = pd.to_datetime(df['Peak Brightness Date/Time (UT)'].dt.date)
    df['year'] = df['Peak Brightness Date/Time (UT)'].dt.year
    df['quarter'] = df['Peak Brightness Date/Time (UT)'].dt.quarter
    df['month'] = df['Peak Brightness Date/Time (UT)'].dt.month
    df['day'] = df['Peak Brightness Date/Time (UT)'].dt.day
    df['weekday'] = df['Peak Brightness Date/Time (UT)'].dt.weekday
    df['hour'] = df['Peak Brightness Date/Time (UT)'].dt.hour
    df['minute'] = df['Peak Brightness Date/Time (UT)'].dt.minute
    df['second'] = df['Peak Brightness Date/Time (UT)'].dt.second
    df['Lat'] = df.apply(lambda row: lat(row), axis=1)
    df['Long'] = df.apply(lambda row: long(row), axis=1)
    
    return df

def lat(row):
    if row['Latitude (deg.)'] == row['Latitude (deg.)']:
        if row['Latitude (deg.)'][-1] == 'N':
            return float(row['Latitude (deg.)'][:-1])
        elif row['Latitude (deg.)'][-1] == 'S':
            return float('-'+(row['Latitude (deg.)'][:-1]))
    return np.nan

def long(row):
    if row['Longitude (deg.)'] == row['Longitude (deg.)']:
        if row['Longitude (deg.)'][-1] == 'E':
            return float(row['Longitude (deg.)'][:-1])
        elif row['Longitude (deg.)'][-1] == 'W':
            return float('-'+(row['Longitude (deg.)'][:-1]))
    return np.nan


fire_df = load_data()

## Flask Routes ##

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/firedata')
def data():
    return render_template('firedata.html')

@app.route('/prediction')
def prediction():
    return render_template('predictions.html')

## Altair Routes ##

@app.route("/data/group")
def data_group():
    selection = alt.selection(type='interval', encodings=['x'])

    base = alt.Chart().mark_bar().encode(
        x=alt.X(alt.repeat('column'), type='quantitative'),
        y=alt.Y(aggregate='count', type='quantitative')
    ).properties(
        width=225,
        height=130
    )

    # gray background with selection
    background = base.encode(
        color=alt.value('#ddd')
    ).add_selection(selection)

    # blue highlights on the transformed data
    highlight = base.transform_filter(selection)

    line = alt.Chart().mark_rule(color='firebrick').encode(
        x=alt.X(alt.repeat('column'), aggregate='mean', type='quantitative'),
        size=alt.SizeValue(3)
    ).transform_filter(selection)

    # layer the three charts & repeat
    group_chrt = alt.layer(
        background,
        highlight,
        line,
        data=fire_df
    )

    alt.vconcat(
        group_chrt.repeat(column=["year", "quarter", "month"]),
        group_chrt.repeat(column=["day", "weekday"]),
        group_chrt.repeat(column=["hour", "minute", "second"])
    )
    return group_chrt.to_json()

def pred1(date, amount):
    diff_d = (datetime.datetime.strptime(date, "%Y-%m-%d").date() - fire_df['date'][0].date()).days
    return (1 - stats.poisson.cdf(int(amount) - 1,0.09202941761081296*diff_d))*100


@app.route('/predict', methods=['GET','POST'], endpoint='predfunc')
def prediction():
    date = request.form['date']
    word = request.args.get('date')
    amount = request.form['amount']
    
    pred = pred1(date, amount)
    result = {
        "output": pred
    }
    result = {str(key): value for key, value in result.items()}
    return jsonify(result=result)




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)