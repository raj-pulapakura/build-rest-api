#!/bin/bash

git add .
git commit -m "testing"
git push -u origin master

npm publish
