#!/bin/bash
mv www/i18n/*.po backup
./platforms/android/cordova/clean
cordova prepare android
cordova prepare firefoxos
cordova build android
cordova build firefoxos
mv backup/*po www/i18n
