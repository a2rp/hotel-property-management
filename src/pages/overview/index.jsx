import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiLogIn, FiLogOut, FiMoon, FiUsers } from "react-icons/fi";
import styles from "./styles.module.css";

const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

const Overview = ({ rooms, reservations, onCheckIn, onCheckOut, onSetRoomStatus }) => {
  const [view, setView] = useState("Arrivals");
  const available = rooms.filter((room) => room.status === "Ready").length;
  const inHouse = reservations.filter((reservation) => reservation.status === "Checked in").length;
  const arriving = reservations.filter((reservation) => reservation.arrival === today && reservation.status === "Confirmed").length;
  const departing = reservations.filter((reservation) => reservation.departure === today && reservation.status === "Checked in").length;
  const counts = useMemo(() => [
    { label: "Rooms ready", value: available, detail: "Available to welcome guests", icon: FiCheck },
    { label: "In house", value: inHouse, detail: "Guests staying with us", icon: FiMoon },
    { label: "Arrivals today", value: arriving, detail: "Reservations to prepare", icon: FiLogIn },
    { label: "Departures", value: departing, detail: "Rooms to turn today", icon: FiLogOut },
  ], [available, inHouse, arriving, departing]);
  const stays = reservations.filter((item) => view === "Arrivals" ? item.arrival === today && item.status === "Confirmed" : item.departure === today && item.status === "Checked in");
  const needsAttention = rooms.filter((room) => room.status === "Needs cleaning" || room.status === "Maintenance");
  const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div><p className={styles.date}>{dateLabel} <span>•</span> Asheville, NC</p><h1>Make every arrival feel easy.</h1><p className={styles.intro}>Your desk for the day: guest plans, room readiness, and the details that make a stay feel considered.</p></div>
        <div className={styles.heroAside}><span className={styles.openLabel}><i /> DESK OPEN</span><p>48 <span>guest rooms</span></p><Link to="/reservations">View reservations <FiArrowRight aria-hidden="true" /></Link></div>
      </section>

      <section className={styles.metrics} aria-label="Today's hotel overview">
        {counts.map(({ label, value, detail, icon: Icon }) => <article className={styles.metric} key={label}><div className={styles.metricTop}><span>{label}</span><Icon aria-hidden="true" /></div><strong>{value}</strong><p>{detail}</p></article>)}
      </section>

      <div className={styles.workGrid}>
        <section className={styles.agenda}>
          <div className={styles.sectionHead}><div><h2>Guest movement</h2><p>Keep the day flowing from arrival through checkout.</p></div><div className={styles.tabs} role="tablist" aria-label="Guest movement view">{["Arrivals", "Departures"].map((item) => <button key={item} role="tab" aria-selected={view === item} className={view === item ? styles.selected : ""} type="button" onClick={() => setView(item)}>{item}</button>)}</div></div>
          {stays.length ? <div className={styles.stayList}>{stays.map((stay, index) => <article className={styles.stay} key={stay.id}>
            <div className={styles.time}><span>{view === "Arrivals" ? `${3 + index}:00 PM` : "11:00 AM"}</span><i /></div>
            <div className={styles.guest}><div className={styles.avatar}>{stay.guest.split(" ").map((part) => part[0]).join("")}</div><div><h3>{stay.guest}</h3><p>{stay.roomType} room <span>·</span> Room {stay.room} <span>·</span> {stay.guests} guests</p><small>{stay.note}</small></div></div>
            {view === "Arrivals" ? <button className={styles.action} type="button" onClick={() => onCheckIn(stay.id)}><FiLogIn aria-hidden="true" /> Check in</button> : <button className={styles.action} type="button" onClick={() => onCheckOut(stay.id)}><FiLogOut aria-hidden="true" /> Check out</button>}
          </article>)}</div> : <div className={styles.empty}><FiCalendar aria-hidden="true" /><h3>No {view.toLowerCase()} on the desk</h3><p>There are no {view.toLowerCase()} scheduled for today.</p><Link to="/reservations">Browse all reservations</Link></div>}
          <Link className={styles.textLink} to="/reservations">Open reservations <FiArrowRight aria-hidden="true" /></Link>
        </section>

        <section className={styles.readiness}>
          <div className={styles.sectionHead}><div><h2>Room readiness</h2><p>A quick look before the next guest arrives.</p></div><Link className={styles.iconLink} to="/rooms" aria-label="Open room board"><FiArrowRight aria-hidden="true" /></Link></div>
          <div className={styles.readinessScore}><div><strong>{available}<small> / {rooms.length}</small></strong><span>rooms ready to welcome</span></div><div className={styles.progress}><i style={{ width: `${rooms.length ? (available / rooms.length) * 100 : 0}%` }} /></div></div>
          <div className={styles.roomCounts}>{[
            ["Ready", rooms.filter((room) => room.status === "Ready").length, "#627861"],
            ["Occupied", rooms.filter((room) => room.status === "Occupied").length, "#677d95"],
            ["Needs cleaning", rooms.filter((room) => room.status === "Needs cleaning").length, "#bd8752"],
            ["Maintenance", rooms.filter((room) => room.status === "Maintenance").length, "#a86a62"],
          ].map(([label, count, color]) => <div className={styles.roomCount} key={label}><i style={{ background: color }} /><span>{label}</span><strong>{count}</strong></div>)}</div>
          <div className={styles.attention}><div className={styles.attentionHead}><span><FiClock aria-hidden="true" /> Needs attention</span><strong>{needsAttention.length}</strong></div>
            {needsAttention.length ? needsAttention.slice(0, 3).map((room) => <div className={styles.attentionRoom} key={room.id}><span>Room {room.id}<small>{room.note}</small></span><button type="button" onClick={() => onSetRoomStatus(room.id, "Ready")}>Mark ready</button></div>) : <p className={styles.allClear}>All rooms are ready for the next stay.</p>}
          </div>
          <Link className={styles.textLink} to="/rooms">Open room board <FiArrowRight aria-hidden="true" /></Link>
        </section>
      </div>

      <section className={styles.bottomNote}><FiUsers aria-hidden="true" /><p><strong>Small details, well looked after.</strong><span>Reservation edits and room updates stay in sync across this demo during your current visit.</span></p><span className={styles.demoBadge}>FRONTEND DEMO</span></section>
    </div>
  );
};

export default Overview;
