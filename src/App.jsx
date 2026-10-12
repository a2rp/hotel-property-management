import { useCallback, useRef, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Toast from "./components/toast";
import AppRoutes from "./AppRoutes";
import { initialReservations, initialRooms } from "./data/seed";
import styles from "./App.module.css";

const today = new Date().toISOString().slice(0, 10);

const App = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [reservations, setReservations] = useState(initialReservations);
  const [notifications, setNotifications] = useState([]);
  const toastNumber = useRef(0);

  const notify = useCallback((type, message) => {
    toastNumber.current += 1;
    setNotifications((items) => [...items, { id: toastNumber.current, type, message }]);
  }, []);
  const dismissToast = useCallback((id) => setNotifications((items) => items.filter((item) => item.id !== id)), []);

  const setRoomStatus = (roomId, status) => {
    setRooms((current) => current.map((room) => room.id === roomId ? { ...room, status } : room));
    notify("success", `Room ${roomId} marked ${status.toLowerCase()}.`);
  };

  const updateRoomNote = (roomId, note) => {
    setRooms((current) => current.map((room) => room.id === roomId ? { ...room, note } : room));
    notify("success", `Room ${roomId} note updated.`);
  };

  const checkIn = (reservationId) => {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation || reservation.status !== "Confirmed") return false;
    if (reservation.arrival > today) { notify("info", `Check-in for ${reservation.guest} opens on the arrival date.`); return false; }
    const room = rooms.find((item) => item.id === reservation.room);
    if (!room || room.status !== "Ready") { notify("error", `Room ${reservation.room} is not ready for check-in yet.`); return false; }
    setReservations((current) => current.map((item) => item.id === reservationId ? { ...item, status: "Checked in" } : item));
    setRooms((current) => current.map((item) => item.id === reservation.room ? { ...item, status: "Occupied" } : item));
    notify("success", `${reservation.guest} checked in to room ${reservation.room}.`);
    return true;
  };

  const checkOut = (reservationId) => {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation || reservation.status !== "Checked in") return false;
    setReservations((current) => current.map((item) => item.id === reservationId ? { ...item, status: "Checked out" } : item));
    setRooms((current) => current.map((item) => item.id === reservation.room ? { ...item, status: "Needs cleaning" } : item));
    notify("success", `${reservation.guest} checked out. Room ${reservation.room} is ready for turnover.`);
    return true;
  };

  const saveReservation = (form, reservationId) => {
    const existing = reservations.find((item) => item.id === reservationId);
    const conflict = (roomId) => reservations.some((item) => item.id !== reservationId && item.room === roomId && item.status !== "Checked out" && form.arrival < item.departure && form.departure > item.arrival);
    let assignedRoom = existing && (existing.status === "Checked in" || existing.status === "Checked out") ? rooms.find((room) => room.id === existing.room) : null;
    if (existing && existing.roomType === form.roomType && !conflict(existing.room)) assignedRoom = rooms.find((room) => room.id === existing.room);
    if (!assignedRoom || assignedRoom.type !== form.roomType) assignedRoom = rooms.find((room) => room.type === form.roomType && room.status === "Ready" && !conflict(room.id));
    if (!assignedRoom) { notify("error", `No available ${form.roomType.toLowerCase()} room for those dates. Adjust the stay or room type.`); return false; }
    if (existing?.status === "Checked in" && assignedRoom.id !== existing.room) { notify("error", "A checked-in guest must stay in the assigned room for this demo."); return false; }

    if (existing) {
      setReservations((current) => current.map((item) => item.id === reservationId ? { ...item, ...form, room: assignedRoom.id } : item));
      notify("success", `Reservation for ${form.guest} updated in room ${assignedRoom.id}.`);
    } else {
      const nextNumber = reservations.reduce((max, item) => Math.max(max, Number(item.id.split("-")[1]) || 0), 4800) + 1;
      const created = { ...form, id: `MN-${nextNumber}`, room: assignedRoom.id, status: "Confirmed" };
      setReservations((current) => [created, ...current]);
      notify("success", `Reservation created for ${form.guest} in room ${assignedRoom.id}.`);
    }
    return true;
  };

  const deleteReservation = (reservationId) => {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation) return;
    setReservations((current) => current.filter((item) => item.id !== reservationId));
    if (reservation.status === "Checked in") setRooms((current) => current.map((room) => room.id === reservation.room ? { ...room, status: "Needs cleaning" } : room));
    notify("success", `Reservation ${reservationId} removed.`);
  };

  const pageProps = { rooms, reservations, onSave: saveReservation, onDelete: deleteReservation, onCheckIn: checkIn, onCheckOut: checkOut, onSetRoomStatus: setRoomStatus, onUpdateRoomNote: updateRoomNote, notify };

  return (
    <div className={styles.app}>
      <Header />
      <main id="main-content" className={styles.main}><AppRoutes {...pageProps} /></main>
      <Footer />
      <Toast items={notifications} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
