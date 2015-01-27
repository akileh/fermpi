#!/bin/bash
avrdude -v -v -v -v -F -e -p atmega32u4 -c avr109 -P /dev/tty.usbmodem1421 -b 57600 -D -U flash:w:./brewpi-leonardo-revC.hex:i
