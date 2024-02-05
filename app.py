# app.py
from flask import Flask, jsonify
from flask_cors import CORS  
import subprocess
import threading

app = Flask(__name__)

###### CORS 설정
CORS(app)  

###### FLASK 연결 확인 API
@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask!")

###### RECON 실행 API
recon_result = None

def run_recon_async():
    global recon_result
    try:
        recon_command = "./recon-ng/recon-ng"
        recon_result = subprocess.run([recon_command, '-r', 'script.rc'], capture_output=True, text=True).stdout
    except Exception as e:
        recon_result = str(e)

@app.route('/run-recon')
def run_recon():
    threading.Thread(target=run_recon_async).start()
    response = jsonify(message="Recon-ng 백그라운드 실행 중")
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

@app.route('/recon-result')
def get_recon_result():
    if recon_result is None:
        return jsonify(message="Recon-ng 실행 중")
    else:
        return jsonify(result=recon_result)


###### Main(0.0.0.0:5001/API 이름)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)






