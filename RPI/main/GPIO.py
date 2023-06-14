import RPi.GPIO as GPIO
import sys

if len(sys.argv) < 2:
    print("Error: Please provide the sensor pin as a command line argument.")
    print("Usage: python3 script.py <sensor_pin>")
    sys.exit()

sensorPin = int(sys.argv[1])
GPIO.setmode(GPIO.BCM)
GPIO.setup(sensorPin, GPIO.IN)

print(GPIO.input(sensorPin))
GPIO.cleanup()
# sudo pip3 install RPi.GPIO
