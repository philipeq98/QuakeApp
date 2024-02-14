# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Reference table of the diameter of the affected area based on the Richter scale magnitude
diameter_reference = {
    3.0: 15,
    4.0: 80,
    5.0: 250,
    6.0: 600,
    7.0: 1000,
    8.0: 1500,
    9.0: 2500
}

@app.route('/calculate-earthquake', methods=['POST'])
def calculate_earthquake():
    data = request.json
    epicenter = data.get('epicenter')
    magnitude = float(data.get('magnitude'))

    # Determine the diameter of the affected area based on the Richter scale magnitude
    if magnitude in diameter_reference:
        diameter = diameter_reference[magnitude]
    else:
        diameter = None

    # Determine the intensity of the earthquake based on the magnitude
    if magnitude >= 7.0:
        intensity = 'Strong'
    elif magnitude >= 5.0:
        intensity = 'Medium'
    else:
        intensity = 'Almost unnoticeable'

    result = {
        'epicenter': epicenter,
        'magnitude': magnitude,
        'intensity': intensity,
        'diameter_km': diameter
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
