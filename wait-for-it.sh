#!/usr/bin/env bash
# ใช้ตรวจสอบว่า MySQL พร้อมหรือยัง
host="$1"
shift
cmd="$@"

until nc -z $host; do
  echo "Waiting for $host..."
  sleep 2
done

exec $cmd

