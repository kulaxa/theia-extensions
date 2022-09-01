#!/bin/bash


cd widget && yarn && yarn pack && mv *.tgz ../out/
cd ../backend && yarn && yarn pack && mv *.tgz ../out/
cd ../reset-env && yarn && yarn pack && mv *.tgz ../out/