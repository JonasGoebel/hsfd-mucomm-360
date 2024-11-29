import requests
import cv2
import numpy as np

# initialize session
CAM_URL = "http://192.168.1.1/osc/commands/execute"

def send_command(name, parameters):
    payload = {
        "name": name,
        "parameters": parameters
    }
    response = requests.post(CAM_URL, json=payload, stream=True)
    
    if response.status_code == 200:
        print("success")
        return response.json()
    
    print("ERROR")
    print(response.text)

# get api version
parameters = {
    "optionNames": [
        "clientVersion"
    ]
}
result = send_command('camera.getOptions', parameters)
client_version = result['results']['options']['clientVersion']

# convert camera version to 2 if its not (e.g. directly after booting)
if client_version != 2:
    # initialize session
    result = send_command('camera.startSession', {})
    session_id = result['results']['sessionId']

    # set api version to v2
    parameters = {
        "sessionId": session_id,
        "options": {
            "clientVersion": 2
        }
    }
    send_command('camera.setOptions', parameters)

# get live image
payload = {
    "name": "camera.getLivePreview",
    "parameters": {
        # "sessionId": session_id,
        "optionNames": ["clientVersion"]
    }
}

response = requests.post(CAM_URL, json=payload, stream=True)

if response.status_code == 200:
    # MJPEG-Boundary
    boundary = b"--osclivepreview--"
    buffer = b""

    for chunk in response.iter_content(chunk_size=4096):
        buffer += chunk
        
        while True:
            start = buffer.find(b"\xff\xd8")
            end = buffer.find(b"\xff\xd9")
            
            if start != -1 and end != -1:
                jpg_data = buffer[start:end+2]
                buffer = buffer[end+2:]
                
                img_array = np.frombuffer(jpg_data, dtype=np.uint8)
                img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

                if img is not None:
                    cv2.imshow("Live Preview", img)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    response.close()
                    break
            else:
                break
else:
    print(f"Fehler: {response.status_code}")

cv2.destroyAllWindows()
