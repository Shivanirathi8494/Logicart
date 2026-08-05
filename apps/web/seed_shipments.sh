#!/bin/bash

API="http://localhost:3000/api/dockets"

origins=("BLR" "DEL" "BOM" "HYD" "MAA")
destinations=("DEL" "BLR" "HYD" "CCU" "AMD")
contents=("Electronics" "Medicines" "Documents" "Garments" "Auto Parts" "Books" "Food Products" "Mobile Phones")
senders=("ABC Technologies" "XYZ Industries" "Global Traders" "Logic Solutions" "Prime Exports" "Sky Enterprises" "Apex Systems" "Future Retail")
receivers=("Reliance Retail" "Infosys" "TCS" "Wipro" "Flipkart" "Amazon" "HCL" "Tech Mahindra")

for i in $(seq 1 20)
do

origin=${origins[$((RANDOM % ${#origins[@]}))]}
destination=${destinations[$((RANDOM % ${#destinations[@]}))]}

while [ "$origin" = "$destination" ]
do
destination=${destinations[$((RANDOM % ${#destinations[@]}))]}
done

sender=${senders[$((RANDOM % ${#senders[@]}))]}
receiver=${receivers[$((RANDOM % ${#receivers[@]}))]}
content=${contents[$((RANDOM % ${#contents[@]}))]}

packages=$((RANDOM % 3 + 1))
weight=$((RANDOM % 40 + 5))
vol=$((weight + RANDOM % 5))
charge=$((vol > weight ? vol : weight))
freight=$((charge * 120))
gst=$((freight * 18 / 100))
total=$((freight + gst))

curl -s -X POST "$API" \
-H "Content-Type: application/json" \
-d "{
  \"bookingDate\":\"2026-08-04\",
  \"origin\":\"$origin\",
  \"destination\":\"$destination\",

  \"senderName\":\"$sender\",
  \"senderPhone\":\"98$((10000000+i))\",
  \"senderAddress\":\"${origin} Industrial Area\",

  \"receiverName\":\"$receiver\",
  \"receiverPhone\":\"97$((10000000+i))\",
  \"receiverAddress\":\"${destination} Business Park\",

  \"packageCount\":$packages,

  \"actualWeight\":$weight,
  \"volumetricWeight\":$vol,
  \"chargeableWeight\":$charge,

  \"contents\":\"$content\",

  \"freight\":$freight,
  \"gst\":$gst,
  \"total\":$total,

  \"paymentReference\":\"TXN$i\",

  \"remarks\":\"Demo Shipment $i\",

  \"packages\":[
    {
      \"length\":40,
      \"width\":30,
      \"height\":25
    }
  ]
}" >/dev/null

echo "Created Shipment $i"

done

echo ""
echo "✅ 20 demo shipments created."
