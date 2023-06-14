import time
import board
import busio
import adafruit_ads1x15.ads1015 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import sys

if len(sys.argv) < 2:
    print("Error: Please provide the sensor pin as a command line argument.")
    print("Usage: python3 script.py <sensor_pin>")
    sys.exit()

if sys.argv[1] == "P0":
    sensorPin = ADS.P0
elif sys.argv[1] == "P1":
    sensorPin = ADS.P1
elif sys.argv[1] == "P2":
    sensorPin = ADS.P2
elif sys.argv[1] == "P3":
    sensorPin = ADS.P3

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1015(i2c)
chan = AnalogIn(ads, sensorPin)
# print(chan.voltage)
print(chan.value)

# sudo pip3 install adafruit-circuitpython-ads1x15
