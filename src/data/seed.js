export const initialRooms = [
  { id: "101", floor: 1, type: "King", status: "Ready", note: "Courtyard view" },
  { id: "102", floor: 1, type: "Queen", status: "Occupied", note: "Quiet wing" },
  { id: "103", floor: 1, type: "King", status: "Needs cleaning", note: "Checkout at 11:00" },
  { id: "104", floor: 1, type: "Suite", status: "Ready", note: "Corner suite" },
  { id: "201", floor: 2, type: "Queen", status: "Occupied", note: "Late arrival" },
  { id: "202", floor: 2, type: "King", status: "Ready", note: "Mountain view" },
  { id: "203", floor: 2, type: "Suite", status: "Maintenance", note: "Air conditioning inspection" },
  { id: "204", floor: 2, type: "Queen", status: "Ready", note: "Accessible room" },
  { id: "301", floor: 3, type: "King", status: "Needs cleaning", note: "Fresh linen requested" },
  { id: "302", floor: 3, type: "Suite", status: "Occupied", note: "Guest requested extra towels" },
  { id: "303", floor: 3, type: "Queen", status: "Ready", note: "Mountain view" },
  { id: "304", floor: 3, type: "King", status: "Ready", note: "Quiet wing" },
  { id: "305", floor: 3, type: "Suite", status: "Ready", note: "Fireplace suite" },
];

export const initialReservations = [
  { id: "MN-4821", guest: "Olivia Bennett", email: "olivia.bennett@example.com", room: "102", roomType: "Queen", guests: 2, arrival: "2026-10-13", departure: "2026-10-16", status: "Checked in", note: "Late checkout requested" },
  { id: "MN-4822", guest: "Ethan Brooks", email: "ethan.brooks@example.com", room: "201", roomType: "Queen", guests: 1, arrival: "2026-10-13", departure: "2026-10-15", status: "Checked in", note: "Arriving after 8 PM" },
  { id: "MN-4823", guest: "Amara Johnson", email: "amara.johnson@example.com", room: "302", roomType: "Suite", guests: 2, arrival: "2026-10-12", departure: "2026-10-16", status: "Checked in", note: "Extra towels" },
  { id: "MN-4824", guest: "Noah Williams", email: "noah.williams@example.com", room: "104", roomType: "Suite", guests: 2, arrival: "2026-10-13", departure: "2026-10-16", status: "Confirmed", note: "Celebrating an anniversary" },
  { id: "MN-4825", guest: "Sofia Martinez", email: "sofia.martinez@example.com", room: "202", roomType: "King", guests: 2, arrival: "2026-10-13", departure: "2026-10-15", status: "Confirmed", note: "Mountain view preferred" },
  { id: "MN-4826", guest: "Liam Chen", email: "liam.chen@example.com", room: "103", roomType: "King", guests: 1, arrival: "2026-10-14", departure: "2026-10-17", status: "Confirmed", note: "No special requests" },
  { id: "MN-4827", guest: "Priya Shah", email: "priya.shah@example.com", room: "203", roomType: "Suite", guests: 3, arrival: "2026-10-14", departure: "2026-10-18", status: "Confirmed", note: "Traveling with a child" },
  { id: "MN-4819", guest: "Mason Reed", email: "mason.reed@example.com", room: "303", roomType: "Queen", guests: 2, arrival: "2026-10-10", departure: "2026-10-12", status: "Checked out", note: "Receipt emailed" },
];
