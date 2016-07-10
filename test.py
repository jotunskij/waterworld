from __future__ import print_function
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(11, GPIO.IN)
while True:
	print (GPIO.input(11), end="")
