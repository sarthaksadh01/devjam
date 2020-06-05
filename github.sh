#!/bin/bash
read desc
git add .
git commit -m "$desc"
git push