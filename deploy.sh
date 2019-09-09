#!/bin/bash

sudo mkdir -p /tmp/mmeteo_forecasts
sudo mkdir -p /var/www/html/mmeteo_forecasts
sudo rm -r /tmp/mmeteo_forecasts/*
sudo cp -r /var/www/html/mmeteo_forecasts/* /tmp/mmeteo_forecasts/
sudo rm -r /var/www/html/mmeteo_forecasts/*
sudo cp -r ../mmeteo_forecasts/* /var/www/html/mmeteo_forecasts/
sudo chown -R www-data /var/www/html/mmeteo_forecasts
sudo chgrp -R www-data /var/www/html/mmeteo_forecasts
