import { prisma } from "../src/lib/prisma";

const SOURCE = "ALLIANCE_SCHEDULE";
const VALID_FROM = "2026-03-29";
const VALID_TO = "2026-10-24";

type AllianceScheduleRow = {
  rotation: string;
  flight: string;
  origin: string;
  destination: string;
  days: string;
  std: string;
  sta: string;
  aircraft: string;
  details: string;
};

const SCHEDULE: AllianceScheduleRow[] = [
  {
    "rotation": "DEL-1",
    "flight": "9I637",
    "origin": "DEL",
    "destination": "BUP",
    "days": "246",
    "std": "06:20",
    "sta": "07:40",
    "aircraft": "ATR42",
    "details": "RCS"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I638",
    "origin": "BUP",
    "destination": "DEL",
    "days": "246",
    "std": "08:05",
    "sta": "09:15",
    "aircraft": "ATR42",
    "details": "RCS"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I873",
    "origin": "DEL",
    "destination": "NNS",
    "days": "246",
    "std": "10:55",
    "sta": "12:15",
    "aircraft": "ATR42",
    "details": "VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I876",
    "origin": "NNS",
    "destination": "DED",
    "days": "246",
    "std": "12:40",
    "sta": "13:25",
    "aircraft": "ATR42",
    "details": "VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I875",
    "origin": "DED",
    "destination": "NNS",
    "days": "246",
    "std": "13:50",
    "sta": "14:35",
    "aircraft": "ATR42",
    "details": "VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I874",
    "origin": "NNS",
    "destination": "DEL",
    "days": "246",
    "std": "15:00",
    "sta": "16:10",
    "aircraft": "ATR42",
    "details": "VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I803",
    "origin": "DEL",
    "destination": "KUU",
    "days": "13",
    "std": "07:20",
    "sta": "08:40",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I801",
    "origin": "KUU",
    "destination": "DED",
    "days": "13",
    "std": "09:05",
    "sta": "09:45",
    "aircraft": "ATR42",
    "details": "RCS"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I802",
    "origin": "DED",
    "destination": "KUU",
    "days": "13",
    "std": "10:20",
    "sta": "11:05",
    "aircraft": "ATR42",
    "details": "RCS"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I804",
    "origin": "KUU",
    "destination": "DEL",
    "days": "13",
    "std": "11:30",
    "sta": "12:50",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I803",
    "origin": "DEL",
    "destination": "KUU",
    "days": "57",
    "std": "06:20",
    "sta": "07:40",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I804",
    "origin": "KUU",
    "destination": "DEL",
    "days": "57",
    "std": "08:05",
    "sta": "09:25",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I851",
    "origin": "DEL",
    "destination": "HSS",
    "days": "57",
    "std": "10:55",
    "sta": "11:40",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I855",
    "origin": "HSS",
    "destination": "AYJ",
    "days": "57",
    "std": "12:05",
    "sta": "14:05",
    "aircraft": "ATR42",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I856",
    "origin": "AYJ",
    "destination": "HSS",
    "days": "57",
    "std": "14:30",
    "sta": "16:30",
    "aircraft": "ATR42",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I852",
    "origin": "HSS",
    "destination": "DEL",
    "days": "57",
    "std": "16:55",
    "sta": "17:40",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I831",
    "origin": "DEL",
    "destination": "IXC",
    "days": "13",
    "std": "13:50",
    "sta": "14:55",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I854",
    "origin": "IXC",
    "destination": "HSS",
    "days": "13",
    "std": "15:20",
    "sta": "16:05",
    "aircraft": "ATR42",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I860",
    "origin": "HSS",
    "destination": "JAI",
    "days": "13",
    "std": "16:30",
    "sta": "17:30",
    "aircraft": "ATR42",
    "details": "VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I859",
    "origin": "JAI",
    "destination": "HSS",
    "days": "13",
    "std": "17:55",
    "sta": "18:55",
    "aircraft": "ATR42",
    "details": "VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I853",
    "origin": "HSS",
    "destination": "IXC",
    "days": "13",
    "std": "19:20",
    "sta": "20:05",
    "aircraft": "ATR42",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-1",
    "flight": "9I832",
    "origin": "IXC",
    "destination": "DEL",
    "days": "13",
    "std": "20:30",
    "sta": "21:35",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-2",
    "flight": "9I821",
    "origin": "DEL",
    "destination": "SLV",
    "days": "24567",
    "std": "07:20",
    "sta": "08:35",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-2",
    "flight": "9I823",
    "origin": "SLV",
    "destination": "DHM",
    "days": "24567",
    "std": "09:00",
    "sta": "09:50",
    "aircraft": "ATR42",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-2",
    "flight": "9I824",
    "origin": "DHM",
    "destination": "SLV",
    "days": "24567",
    "std": "10:15",
    "sta": "11:05",
    "aircraft": "ATR42",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-2",
    "flight": "9I822",
    "origin": "SLV",
    "destination": "DEL",
    "days": "24567",
    "std": "11:30",
    "sta": "12:40",
    "aircraft": "ATR42",
    "details": "COM"
  },
  {
    "rotation": "DEL-2",
    "flight": "9I637",
    "origin": "DEL",
    "destination": "BUP",
    "days": "13",
    "std": "13:20",
    "sta": "14:40",
    "aircraft": "ATR42",
    "details": "RCS"
  },
  {
    "rotation": "DEL-2",
    "flight": "9I638",
    "origin": "BUP",
    "destination": "DEL",
    "days": "13",
    "std": "15:05",
    "sta": "16:15",
    "aircraft": "ATR42",
    "details": "RCS"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I613",
    "origin": "DEL",
    "destination": "PAB",
    "days": "1",
    "std": "07:50",
    "sta": "10:25",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I613",
    "origin": "PAB",
    "destination": "AHA",
    "days": "1",
    "std": "10:50",
    "sta": "11:40",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I714",
    "origin": "AHA",
    "destination": "DEL",
    "days": "1",
    "std": "12:05",
    "sta": "14:35",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I713",
    "origin": "DEL",
    "destination": "AHA",
    "days": "3",
    "std": "07:50",
    "sta": "10:25",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I614",
    "origin": "AHA",
    "destination": "PAB",
    "days": "3",
    "std": "10:50",
    "sta": "11:40",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I614",
    "origin": "PAB",
    "destination": "DEL",
    "days": "3",
    "std": "12:05",
    "sta": "14:45",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I697",
    "origin": "DEL",
    "destination": "IXD",
    "days": "5",
    "std": "07:50",
    "sta": "09:40",
    "aircraft": "ATR72",
    "details": ""
  },
  {
    "rotation": "DEL-3",
    "flight": "9I697",
    "origin": "IXD",
    "destination": "PAB",
    "days": "5",
    "std": "10:05",
    "sta": "11:25",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I698",
    "origin": "PAB",
    "destination": "IXD",
    "days": "5",
    "std": "11:50",
    "sta": "13:05",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I698",
    "origin": "IXD",
    "destination": "DEL",
    "days": "5",
    "std": "13:30",
    "sta": "15:20",
    "aircraft": "ATR72",
    "details": ""
  },
  {
    "rotation": "DEL-3",
    "flight": "9I613",
    "origin": "DEL",
    "destination": "PAB",
    "days": "26",
    "std": "07:50",
    "sta": "10:25",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I698",
    "origin": "PAB",
    "destination": "JLR",
    "days": "26",
    "std": "10:50",
    "sta": "11:50",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I697",
    "origin": "JLR",
    "destination": "PAB",
    "days": "26",
    "std": "12:15",
    "sta": "13:15",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I614",
    "origin": "PAB",
    "destination": "DEL",
    "days": "26",
    "std": "13:40",
    "sta": "16:20",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I805",
    "origin": "DEL",
    "destination": "JAI",
    "days": "47",
    "std": "07:50",
    "sta": "08:55",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I805",
    "origin": "JAI",
    "destination": "KUU",
    "days": "47",
    "std": "09:20",
    "sta": "11:05",
    "aircraft": "ATR72",
    "details": "P-RCS"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I806",
    "origin": "KUU",
    "destination": "JAI",
    "days": "47",
    "std": "11:30",
    "sta": "13:15",
    "aircraft": "ATR72",
    "details": "P-RCS"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I806",
    "origin": "JAI",
    "destination": "DEL",
    "days": "47",
    "std": "13:55",
    "sta": "15:00",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I675",
    "origin": "DEL",
    "destination": "REW",
    "days": "1357",
    "std": "18:20",
    "sta": "20:40",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I676",
    "origin": "REW",
    "destination": "DEL",
    "days": "1357",
    "std": "21:05",
    "sta": "23:15",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I809",
    "origin": "DEL",
    "destination": "GOP",
    "days": "246",
    "std": "17:30",
    "sta": "19:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "DEL-3",
    "flight": "9I810",
    "origin": "GOP",
    "destination": "DEL",
    "days": "246",
    "std": "19:55",
    "sta": "21:50",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I633",
    "origin": "BOM",
    "destination": "AVR",
    "days": "1357",
    "std": "07:05",
    "sta": "08:50",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I634",
    "origin": "AVR",
    "destination": "BOM",
    "days": "1357",
    "std": "09:15",
    "sta": "11:00",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I623",
    "origin": "BOM",
    "destination": "DIU",
    "days": "1357",
    "std": "11:40",
    "sta": "12:45",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I624",
    "origin": "DIU",
    "destination": "BOM",
    "days": "1357",
    "std": "13:05",
    "sta": "14:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I601",
    "origin": "BOM",
    "destination": "JLG",
    "days": "1357",
    "std": "14:45",
    "sta": "16:05",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I610",
    "origin": "JLG",
    "destination": "AMD",
    "days": "1357",
    "std": "16:30",
    "sta": "17:50",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I609",
    "origin": "AMD",
    "destination": "JLG",
    "days": "1357",
    "std": "18:15",
    "sta": "19:35",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I602",
    "origin": "JLG",
    "destination": "BOM",
    "days": "1357",
    "std": "19:55",
    "sta": "21:20",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I633",
    "origin": "BOM",
    "destination": "AVR",
    "days": "2",
    "std": "07:05",
    "sta": "08:50",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I634",
    "origin": "AVR",
    "destination": "BOM",
    "days": "2",
    "std": "09:15",
    "sta": "11:05",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I601",
    "origin": "BOM",
    "destination": "JLG",
    "days": "2",
    "std": "11:40",
    "sta": "13:00",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I610",
    "origin": "JLG",
    "destination": "AMD",
    "days": "2",
    "std": "13:25",
    "sta": "14:45",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I603",
    "origin": "AMD",
    "destination": "IXK",
    "days": "2",
    "std": "15:10",
    "sta": "16:00",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I604",
    "origin": "IXK",
    "destination": "AMD",
    "days": "2",
    "std": "16:25",
    "sta": "17:20",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I609",
    "origin": "AMD",
    "destination": "JLG",
    "days": "2",
    "std": "17:45",
    "sta": "19:05",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I602",
    "origin": "JLG",
    "destination": "BOM",
    "days": "2",
    "std": "19:30",
    "sta": "21:20",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I611",
    "origin": "BOM",
    "destination": "AMD",
    "days": "46",
    "std": "06:50",
    "sta": "08:35",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I603",
    "origin": "AMD",
    "destination": "IXK",
    "days": "46",
    "std": "09:15",
    "sta": "10:10",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I624",
    "origin": "IXK",
    "destination": "DIU",
    "days": "46",
    "std": "10:30",
    "sta": "11:05",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I624",
    "origin": "DIU",
    "destination": "BOM",
    "days": "46",
    "std": "11:30",
    "sta": "12:50",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I623",
    "origin": "BOM",
    "destination": "DIU",
    "days": "46",
    "std": "13:15",
    "sta": "14:20",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I623",
    "origin": "DIU",
    "destination": "IXK",
    "days": "46",
    "std": "14:45",
    "sta": "15:20",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I604",
    "origin": "IXK",
    "destination": "AMD",
    "days": "46",
    "std": "15:45",
    "sta": "16:40",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I609",
    "origin": "AMD",
    "destination": "JLG",
    "days": "46",
    "std": "17:15",
    "sta": "18:35",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I610",
    "origin": "JLG",
    "destination": "AMD",
    "days": "46",
    "std": "19:00",
    "sta": "20:20",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BOM-4",
    "flight": "9I612",
    "origin": "AMD",
    "destination": "BOM",
    "days": "46",
    "std": "20:35",
    "sta": "22:30",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I507",
    "origin": "BLR",
    "destination": "COK",
    "days": "1234567",
    "std": "07:05",
    "sta": "08:40",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I505",
    "origin": "COK",
    "destination": "AGX",
    "days": "1234567",
    "std": "09:05",
    "sta": "10:20",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I506",
    "origin": "AGX",
    "destination": "COK",
    "days": "1234567",
    "std": "10:40",
    "sta": "12:05",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I516",
    "origin": "COK",
    "destination": "SXV",
    "days": "1234567",
    "std": "12:45",
    "sta": "13:55",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I514",
    "origin": "SXV",
    "destination": "BLR",
    "days": "1234567",
    "std": "14:20",
    "sta": "15:20",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I513",
    "origin": "BLR",
    "destination": "SXV",
    "days": "1234567",
    "std": "15:55",
    "sta": "16:55",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I515",
    "origin": "SXV",
    "destination": "COK",
    "days": "1234567",
    "std": "17:15",
    "sta": "18:25",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I508",
    "origin": "COK",
    "destination": "BLR",
    "days": "1234567",
    "std": "18:50",
    "sta": "20:15",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "BLR-6",
    "flight": "9I547",
    "origin": "BLR",
    "destination": "GOI",
    "days": "157",
    "std": "20:50",
    "sta": "22:25",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "BLR-6",
    "flight": "9I548",
    "origin": "GOI",
    "destination": "BLR",
    "days": "157",
    "std": "22:50",
    "sta": "00:25",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I517",
    "origin": "BLR",
    "destination": "HYD",
    "days": "246",
    "std": "20:50",
    "sta": "22:35",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "BLR-5",
    "flight": "9I519",
    "origin": "HYD",
    "destination": "BLR",
    "days": "246",
    "std": "23:05",
    "sta": "01:00",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I877",
    "origin": "HYD",
    "destination": "TIR",
    "days": "2347",
    "std": "07:05",
    "sta": "08:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I878",
    "origin": "TIR",
    "destination": "HYD",
    "days": "2347",
    "std": "08:50",
    "sta": "10:15",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I885",
    "origin": "HYD",
    "destination": "",
    "days": "2347",
    "std": "10:50",
    "sta": "12:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I885",
    "origin": "JGB",
    "destination": "RPR",
    "days": "2347",
    "std": "12:35",
    "sta": "13:30",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I886",
    "origin": "RPR",
    "destination": "JGB",
    "days": "2347",
    "std": "13:55",
    "sta": "14:50",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I886",
    "origin": "JGB",
    "destination": "HYD",
    "days": "2347",
    "std": "15:15",
    "sta": "16:35",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I877",
    "origin": "HYD",
    "destination": "TIR",
    "days": "156",
    "std": "07:05",
    "sta": "08:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I877",
    "origin": "TIR",
    "destination": "RJA",
    "days": "156",
    "std": "08:50",
    "sta": "10:35",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I878",
    "origin": "RJA",
    "destination": "TIR",
    "days": "156",
    "std": "11:05",
    "sta": "12:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I878",
    "origin": "TIR",
    "destination": "HYD",
    "days": "156",
    "std": "12:55",
    "sta": "14:20",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I893",
    "origin": "HYD",
    "destination": "MAA",
    "days": "135",
    "std": "18:55",
    "sta": "20:50",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I894",
    "origin": "MAA",
    "destination": "HYD",
    "days": "135",
    "std": "21:20",
    "sta": "23:05",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I867",
    "origin": "HYD",
    "destination": "PNQ",
    "days": "2467",
    "std": "17:50",
    "sta": "19:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "HYD-6",
    "flight": "9I868",
    "origin": "PNQ",
    "destination": "HYD",
    "days": "2467",
    "std": "19:55",
    "sta": "21:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I751",
    "origin": "CCU",
    "destination": "IXI",
    "days": "37",
    "std": "06:05",
    "sta": "08:15",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I752",
    "origin": "IXI",
    "destination": "CCU",
    "days": "37",
    "std": "08:40",
    "sta": "10:55",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I721",
    "origin": "CCU",
    "destination": "RUP",
    "days": "37",
    "std": "11:35",
    "sta": "13:25",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I722",
    "origin": "RUP",
    "destination": "CCU",
    "days": "37",
    "std": "13:50",
    "sta": "15:40",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I725",
    "origin": "CCU",
    "destination": "IMF",
    "days": "37",
    "std": "16:20",
    "sta": "18:00",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I726",
    "origin": "IMF",
    "destination": "CCU",
    "days": "37",
    "std": "18:25",
    "sta": "20:05",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I770",
    "origin": "CCU",
    "destination": "GAU",
    "days": "7",
    "std": "20:40",
    "sta": "22:15",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I763",
    "origin": "CCU",
    "destination": "PAB",
    "days": "46",
    "std": "06:05",
    "sta": "07:55",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I764",
    "origin": "PAB",
    "destination": "CCU",
    "days": "46",
    "std": "08:20",
    "sta": "10:10",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I721",
    "origin": "CCU",
    "destination": "RUP",
    "days": "46",
    "std": "10:50",
    "sta": "12:40",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I722",
    "origin": "RUP",
    "destination": "CCU",
    "days": "46",
    "std": "13:05",
    "sta": "15:00",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I751",
    "origin": "CCU",
    "destination": "IXI",
    "days": "46",
    "std": "16:00",
    "sta": "18:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I752",
    "origin": "IXI",
    "destination": "CCU",
    "days": "46",
    "std": "18:35",
    "sta": "21:00",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "CCU-07",
    "flight": "9I770",
    "origin": "CCU",
    "destination": "GAU",
    "days": "4",
    "std": "21:10",
    "sta": "22:45",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I739",
    "origin": "GAU",
    "destination": "IMF",
    "days": "1",
    "std": "07:10",
    "sta": "08:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I732",
    "origin": "IMF",
    "destination": "IXS",
    "days": "1",
    "std": "08:35",
    "sta": "09:30",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I731",
    "origin": "IXS",
    "destination": "IMF",
    "days": "1",
    "std": "10:10",
    "sta": "10:45",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I740",
    "origin": "IMF",
    "destination": "GAU",
    "days": "1",
    "std": "11:10",
    "sta": "12:05",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I787",
    "origin": "GAU",
    "destination": "AJL",
    "days": "1",
    "std": "12:50",
    "sta": "13:55",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I788",
    "origin": "AJL",
    "destination": "GAU",
    "days": "1",
    "std": "14:15",
    "sta": "15:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I771",
    "origin": "GAU",
    "destination": "CCU",
    "days": "1",
    "std": "16:00",
    "sta": "17:45",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I770",
    "origin": "CCU",
    "destination": "GAU",
    "days": "1",
    "std": "18:15",
    "sta": "19:50",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I703",
    "origin": "GAU",
    "destination": "TEI",
    "days": "25",
    "std": "07:10",
    "sta": "08:35",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I707",
    "origin": "TEI",
    "destination": "IMF",
    "days": "25",
    "std": "08:55",
    "sta": "10:05",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I741",
    "origin": "IMF",
    "destination": "DMU",
    "days": "25",
    "std": "10:30",
    "sta": "11:15",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I742",
    "origin": "DMU",
    "destination": "IMF",
    "days": "25",
    "std": "11:40",
    "sta": "12:35",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I708",
    "origin": "IMF",
    "destination": "TEI",
    "days": "25",
    "std": "12:50",
    "sta": "14:00",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I704",
    "origin": "TEI",
    "destination": "GAU",
    "days": "25",
    "std": "14:25",
    "sta": "15:50",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I723",
    "origin": "GAU",
    "destination": "RUP",
    "days": "25",
    "std": "16:15",
    "sta": "16:55",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I724",
    "origin": "RUP",
    "destination": "GAU",
    "days": "25",
    "std": "17:20",
    "sta": "18:00",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "C/G-07",
    "flight": "9I771",
    "origin": "GAU",
    "destination": "CCU",
    "days": "25",
    "std": "18:40",
    "sta": "20:25",
    "aircraft": "ATR72",
    "details": "POSITIONING FLT"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I749",
    "origin": "GAU",
    "destination": "IMF",
    "days": "36",
    "std": "05:50",
    "sta": "06:55",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I750",
    "origin": "IMF",
    "destination": "GAU",
    "days": "36",
    "std": "07:20",
    "sta": "08:25",
    "aircraft": "ATR72",
    "details": "S-VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I723",
    "origin": "GAU",
    "destination": "RUP",
    "days": "36",
    "std": "08:50",
    "sta": "09:30",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I724",
    "origin": "RUP",
    "destination": "GAU",
    "days": "36",
    "std": "09:55",
    "sta": "10:35",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I787",
    "origin": "GAU",
    "destination": "AJL",
    "days": "36",
    "std": "11:10",
    "sta": "12:15",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I787",
    "origin": "AJL",
    "destination": "IMF",
    "days": "36",
    "std": "12:35",
    "sta": "13:25",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I788",
    "origin": "IMF",
    "destination": "AJL",
    "days": "36",
    "std": "13:50",
    "sta": "14:55",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I788",
    "origin": "AJL",
    "destination": "GAU",
    "days": "36",
    "std": "15:20",
    "sta": "16:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I761",
    "origin": "GAU",
    "destination": "IXT",
    "days": "125",
    "std": "07:05",
    "sta": "08:25",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I786",
    "origin": "IXT",
    "destination": "SHL",
    "days": "125",
    "std": "08:50",
    "sta": "10:10",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I786",
    "origin": "SHL",
    "destination": "AJL",
    "days": "125",
    "std": "10:35",
    "sta": "11:30",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I785",
    "origin": "AJL",
    "destination": "SHL",
    "days": "125",
    "std": "11:55",
    "sta": "12:55",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I785",
    "origin": "SHL",
    "destination": "IXT",
    "days": "125",
    "std": "13:20",
    "sta": "14:40",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I762",
    "origin": "IXT",
    "destination": "GAU",
    "days": "125",
    "std": "15:05",
    "sta": "16:20",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I703",
    "origin": "GAU",
    "destination": "TEI",
    "days": "4",
    "std": "07:05",
    "sta": "08:30",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I707",
    "origin": "TEI",
    "destination": "IMF",
    "days": "4",
    "std": "08:55",
    "sta": "10:05",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I732",
    "origin": "IMF",
    "destination": "IXS",
    "days": "4",
    "std": "10:30",
    "sta": "11:25",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I731",
    "origin": "IXS",
    "destination": "IMF",
    "days": "4",
    "std": "11:50",
    "sta": "12:40",
    "aircraft": "ATR72",
    "details": "COM"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I708",
    "origin": "IMF",
    "destination": "TEI",
    "days": "4",
    "std": "13:05",
    "sta": "14:15",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I704",
    "origin": "TEI",
    "destination": "GAU",
    "days": "4",
    "std": "14:40",
    "sta": "15:55",
    "aircraft": "ATR72",
    "details": "RCS"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I761",
    "origin": "GAU",
    "destination": "IXT",
    "days": "7",
    "std": "07:05",
    "sta": "08:25",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I762",
    "origin": "IXT",
    "destination": "GAU",
    "days": "7",
    "std": "08:50",
    "sta": "10:10",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I787",
    "origin": "GAU",
    "destination": "AJL",
    "days": "7",
    "std": "10:35",
    "sta": "11:40",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I785",
    "origin": "AJL",
    "destination": "SHL",
    "days": "7",
    "std": "12:05",
    "sta": "13:05",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I786",
    "origin": "SHL",
    "destination": "AJL",
    "days": "7",
    "std": "13:30",
    "sta": "14:25",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-08",
    "flight": "9I788",
    "origin": "AJL",
    "destination": "GAU",
    "days": "7",
    "std": "14:50",
    "sta": "15:40",
    "aircraft": "ATR72",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I407",
    "origin": "GAU",
    "destination": "HGI",
    "days": "135",
    "std": "07:00",
    "sta": "08:05",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I408",
    "origin": "HGI",
    "destination": "GAU",
    "days": "135",
    "std": "08:40",
    "sta": "09:45",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I422",
    "origin": "GAU",
    "destination": "ZER",
    "days": "135",
    "std": "10:05",
    "sta": "11:20",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I423",
    "origin": "ZER",
    "destination": "GAU",
    "days": "135",
    "std": "11:45",
    "sta": "13:00",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I407",
    "origin": "GAU",
    "destination": "HGI",
    "days": "24",
    "std": "08:00",
    "sta": "09:05",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I413",
    "origin": "HGI",
    "destination": "TEI",
    "days": "24",
    "std": "09:25",
    "sta": "10:30",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I414",
    "origin": "TEI",
    "destination": "HGI",
    "days": "24",
    "std": "10:50",
    "sta": "12:00",
    "aircraft": "DO228",
    "details": "VGF"
  },
  {
    "rotation": "GAU-09",
    "flight": "9I408",
    "origin": "HGI",
    "destination": "GAU",
    "days": "24",
    "std": "12:20",
    "sta": "13:25",
    "aircraft": "DO228",
    "details": "VGF"
  }
];

function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00+05:30`);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function allianceWeekday(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(date);

  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  return map[weekday];
}

function combineIndiaDateAndTime(date: Date, hhmm: string) {
  const yyyy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return new Date(`${yyyy}T${hhmm}:00+05:30`);
}

async function main() {
  const airline = await prisma.airline.findFirst({
    where: {
      OR: [
        { iataDesignator: "9I" },
        { name: { contains: "Alliance Air", mode: "insensitive" } },
      ],
    },
  });

  if (!airline) {
    throw new Error(
      "Alliance Air is missing from Airline master. Add iataDesignator=9I first."
    );
  }

  const from = parseDateOnly(VALID_FROM);
  const to = parseDateOnly(VALID_TO);

  // Idempotent reset: only rows owned by this seed source are replaced.
  await prisma.flightSchedule.deleteMany({
    where: {
      airlineId: airline.id,
      source: SOURCE,
      scheduledDeparture: {
        gte: from,
        lte: new Date("2026-10-25T00:00:00+05:30"),
      },
    },
  });

  const rowsToInsert: any[] = [];

  console.log(
    `Expanding ${SCHEDULE.length} Alliance Air schedule definitions...`
  );

  for (const row of SCHEDULE) {
    for (
      let day = new Date(from);
      day <= to;
      day = addDays(day, 1)
    ) {
      const dow =
        allianceWeekday(day);

      if (!row.days.includes(String(dow))) {
        continue;
      }

      const scheduledDeparture =
        combineIndiaDateAndTime(
          day,
          row.std,
        );

      let scheduledArrival =
        combineIndiaDateAndTime(
          day,
          row.sta,
        );

      if (
        scheduledArrival <=
        scheduledDeparture
      ) {
        scheduledArrival =
          new Date(
            scheduledArrival.getTime() +
              24 * 60 * 60 * 1000,
          );
      }

      rowsToInsert.push({
        airlineId:
          airline.id,

        flightNumber:
          row.flight,

        origin:
          row.origin,

        destination:
          row.destination,

        scheduledDeparture,
        scheduledArrival,

        aircraftType:
          row.aircraft || null,

        departureTerminal:
          null,

        arrivalTerminal:
          null,

        source:
          SOURCE,

        externalId:
          `${row.rotation}:${row.details}`,

        active:
          true,
      });
    }
  }

  console.log(
    `Generated ${rowsToInsert.length} dated flight rows.`
  );

  /*
   * Insert in batches instead of one DB query
   * for every individual flight.
   */
  const BATCH_SIZE = 500;

  let created = 0;

  for (
    let i = 0;
    i < rowsToInsert.length;
    i += BATCH_SIZE
  ) {
    const batch =
      rowsToInsert.slice(
        i,
        i + BATCH_SIZE,
      );

    const result =
      await prisma.flightSchedule.createMany({
        data: batch,

        /*
         * Unique constraint:
         * flightNumber + origin + destination +
         * scheduledDeparture
         */
        skipDuplicates: true,
      });

    created +=
      result.count;

    console.log(
      `Inserted ${Math.min(
        i + batch.length,
        rowsToInsert.length,
      )}/${rowsToInsert.length}`
    );
  }

  console.log(
    `Alliance Air schedule seeded: ${created} dated flight rows`
  );
  console.log(`Static schedule definitions: ${SCHEDULE.length}`);
  console.log(`Validity: ${VALID_FROM} to ${VALID_TO}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
