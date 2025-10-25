from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_URL = "https://www.microburbs.com.au/report_generator/api/suburb/schools"
TOKEN = "test"

def fetch_school_data(suburb):
    """Fetch school data for a given suburb from Microburbs API."""
    headers = {"Authorization": f"Bearer {TOKEN}"}
    params = {"suburb": suburb}
    try:
        res = requests.get(API_URL, headers=headers, params=params)
        res.raise_for_status()
        data = res.json().get("results", [])
        return data
    except Exception as e:
        print("Error fetching data:", e)
        return []

def summarize_schools(schools):
    """Compute average NAPLAN, attendance, and sector ratios."""
    if not schools:
        return {"avg_naplan": 0, "avg_attendance": 0, "public": 0, "private": 0}

    avg_naplan = sum(s.get("naplan", 0) for s in schools) / len(schools)
    avg_attendance = sum(s.get("attendance_rate", 0) for s in schools) / len(schools)

    public = sum(1 for s in schools if s["school_sector_type"] == "Public")
    private = sum(1 for s in schools if s["school_sector_type"] == "Private")
    total = public + private

    return {
        "avg_naplan": round(avg_naplan, 2),
        "avg_attendance": round(avg_attendance * 100, 1),
        "public": round(public / total * 100, 1) if total else 0,
        "private": round(private / total * 100, 1) if total else 0
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compare')
def compare():
    suburb1 = request.args.get('suburb1')
    suburb2 = request.args.get('suburb2')

    data1 = fetch_school_data(suburb1)
    data2 = fetch_school_data(suburb2)

    summary1 = summarize_schools(data1)
    summary2 = summarize_schools(data2)

    return jsonify({
        "suburb1": suburb1,
        "suburb2": suburb2,
        "summary1": summary1,
        "summary2": summary2
    })

if __name__ == "__main__":
    app.run(debug=True)
