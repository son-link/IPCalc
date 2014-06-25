#!/bin/bash
mv www/i18n/*.po backup
./platforms/android/cordova/clean
cordova prepare android
cordova run android
mv backup/*po www/i18n
