import { useMemo, useState } from "react";
import { FiCheck, FiClock, FiGrid, FiHome, FiSearch, FiTool, FiUsers } from "react-icons/fi";
import Dialog from "../../components/dialog";
import styles from "./styles.module.css";

const statuses = ["Ready", "Occupied", "Needs cleaning", "Maintenance"];
const statusIcons = { Ready: FiCheck, Occupied: FiUsers, "Needs cleaning": FiClock, Maintenance: FiTool };

const Rooms = ({ rooms, onSetRoomStatus, onUpdateRoomNote }) => {
  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("All floors");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const filtered = useMemo(() => rooms.filter((room) => {
    const matchesSearch = !search || `${room.id} ${room.type} ${room.note}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (floor === "All floors" || String(room.floor) === floor) && (status === "All statuses" || room.status === status);
  }), [rooms, search, floor, status]);
  const groups = [...new Set(filtered.map((room) => room.floor))].sort((a, b) => a - b);
  const count = (name) => rooms.filter((room) => room.status === name).length;
  const openRoom = (room) => { setSelected(room); setNote(room.note); };

  return (
    <div className={styles.page}>
      <div className={styles.heading}><div><p className={styles.breadcrumb}>House operations <span>/</span> Rooms</p><h1>Room board</h1><p>Readiness at a glance, from the first floor to the mountain suites.</p></div><div className={styles.total}><FiHome aria-hidden="true" /><strong>{rooms.length}</strong><span>tracked rooms</span></div></div>
      <section className={styles.summary} aria-label="Room status summary">
        {statuses.map((item) => { const Icon = statusIcons[item]; return <div key={item}><span className={`${styles.summaryIcon} ${styles[item.toLowerCase().replaceAll(" ", "-")]}`}><Icon aria-hidden="true" /></span><p><strong>{count(item)}</strong><span>{item}</span></p></div>; })}
      </section>
      <section className={styles.board}>
        <div className={styles.toolbar}><label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Room number, type, or note" aria-label="Search rooms" /></label><label>Floor<select value={floor} onChange={(event) => setFloor(event.target.value)}><option>All floors</option>{[...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b).map((value) => <option key={value} value={value}>Floor {value}</option>)}</select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label><span className={styles.matchCount}>{filtered.length} rooms</span></div>
        {groups.length ? groups.map((number) => <section className={styles.floor} key={number}><div className={styles.floorHead}><div><span className={styles.floorNumber}>0{number}</span><h2>Floor {number}</h2></div><span>{filtered.filter((room) => room.floor === number).length} rooms shown</span></div><div className={styles.roomGrid}>
          {filtered.filter((room) => room.floor === number).map((room) => { const Icon = statusIcons[room.status]; return <article key={room.id} className={`${styles.roomCard} ${styles[`card-${room.status.toLowerCase().replaceAll(" ", "-")}`]}`}>
            <button className={styles.roomOpen} type="button" onClick={() => openRoom(room)} aria-label={`Room ${room.id}, ${room.type}, ${room.status}. View details`}><div className={styles.cardTop}><span className={styles.roomNumber}>{room.id}</span><span className={`${styles.state} ${styles[room.status.toLowerCase().replaceAll(" ", "-")]}`}><Icon aria-hidden="true" />{room.status}</span></div><div className={styles.roomInfo}><h3>{room.type} room</h3><p>Floor {room.floor} <span>·</span> {room.note}</p></div><span className={styles.details}>Room details <span aria-hidden="true">↗</span></span></button>
            {room.status === "Needs cleaning" && <button className={styles.readyButton} type="button" onClick={() => onSetRoomStatus(room.id, "Ready")}>Mark ready</button>}
            {room.status === "Maintenance" && <button className={styles.readyButton} type="button" onClick={() => onSetRoomStatus(room.id, "Ready")}>Return to service</button>}
          </article>; })}
        </div></section>) : <div className={styles.empty}><FiGrid aria-hidden="true" /><h2>No rooms match these filters</h2><p>Try a different floor or status.</p><button type="button" onClick={() => { setSearch(""); setFloor("All floors"); setStatus("All statuses"); }}>Clear filters</button></div>}
        <div className={styles.note}><FiHome aria-hidden="true" /><p><strong>Live room readiness</strong><span>Changes made here also update the reservation desk for this visit.</span></p><span>FRONTEND DEMO</span></div>
      </section>
      {selected && <Dialog title={`Room ${selected.id}`} description={`${selected.type} room · Floor ${selected.floor}`} onClose={() => setSelected(null)}>
        <div className={styles.detailTop}><div className={`${styles.detailIcon} ${styles[selected.status.toLowerCase().replaceAll(" ", "-")]}`}>{(() => { const Icon = statusIcons[selected.status]; return <Icon aria-hidden="true" />; })()}</div><div><span>Current status</span><strong>{selected.status}</strong></div></div>
        <label className={styles.detailField}>Room status<select value={selected.status} onChange={(event) => { const value = event.target.value; onSetRoomStatus(selected.id, value); setSelected({ ...selected, status: value }); }}>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className={styles.detailField}>Housekeeping note<textarea rows="3" maxLength="140" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a useful room note" /><small>{note.length}/140 characters</small></label>
        <div className={styles.detailActions}><button className={styles.secondary} type="button" onClick={() => setSelected(null)}>Close</button><button className={styles.primary} type="button" onClick={() => { onUpdateRoomNote(selected.id, note.trim()); setSelected(null); }}>Save room note</button></div>
      </Dialog>}
    </div>
  );
};

export default Rooms;
