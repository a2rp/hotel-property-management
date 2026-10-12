import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowDown, FiArrowUp, FiCalendar, FiChevronRight, FiClock, FiEdit2, FiMail, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import Dialog from "../../components/dialog";
import ConfirmDialog from "../../components/confirmDialog";
import styles from "./styles.module.css";

const today = new Date().toISOString().slice(0, 10);
const emptyForm = { guest: "", email: "", roomType: "King", guests: "2", arrival: today, departure: "", note: "" };
const displayDate = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));

const Reservations = ({ reservations, onSave, onDelete, onCheckIn, onCheckOut, notify }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All stays");
  const [sort, setSort] = useState("asc");
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("create") === "1") {
      setForm({ ...emptyForm, arrival: today });
      setErrors({});
      setDialog({ type: "form", reservation: null });
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const openCreate = () => { setForm({ ...emptyForm, arrival: today }); setErrors({}); setDialog({ type: "form", reservation: null }); };
  const openEdit = (reservation) => { setForm({ guest: reservation.guest, email: reservation.email, roomType: reservation.roomType, guests: String(reservation.guests), arrival: reservation.arrival, departure: reservation.departure, note: reservation.note || "" }); setErrors({}); setDialog({ type: "form", reservation }); };
  const filtered = useMemo(() => reservations.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesText = !term || `${item.guest} ${item.email} ${item.id} ${item.room}`.toLowerCase().includes(term);
    const matchesStatus = filter === "All stays" || item.status === filter;
    return matchesText && matchesStatus;
  }).sort((a, b) => (a.arrival.localeCompare(b.arrival) * (sort === "asc" ? 1 : -1))), [reservations, search, filter, sort]);

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.guest.trim()) nextErrors.guest = "Enter the guest's name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!form.arrival) nextErrors.arrival = "Choose an arrival date.";
    if (!form.departure) nextErrors.departure = "Choose a departure date.";
    if (form.departure && form.arrival && form.departure <= form.arrival) nextErrors.departure = "Departure must be after arrival.";
    const guestCount = Number(form.guests);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 6) nextErrors.guests = "Choose 1 to 6 guests.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { notify("error", "Review the highlighted reservation details."); return; }
    const saved = onSave({ ...form, guests: guestCount, guest: form.guest.trim(), email: form.email.trim() }, dialog.reservation?.id);
    if (saved) setDialog(null);
  };

  const confirmDelete = () => { onDelete(deleteTarget.id); setDeleteTarget(null); if (dialog?.type === "details") setDialog(null); };
  const statusClass = (status) => status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className={styles.page}>
      <div className={styles.heading}><div><p className={styles.breadcrumb}>Guest services <span>/</span> Stays</p><h1>Reservations</h1><p>Every stay, from the first hello to the final goodbye.</p></div><button className={styles.primary} type="button" onClick={openCreate}><FiPlus aria-hidden="true" /> New reservation</button></div>
      <section className={styles.summary} aria-label="Reservation totals"><div><FiCalendar aria-hidden="true" /><span><strong>{reservations.filter((r) => r.arrival === today && r.status === "Confirmed").length}</strong> arrivals today</span></div><div><FiUsers aria-hidden="true" /><span><strong>{reservations.filter((r) => r.status === "Checked in").length}</strong> guests in house</span></div><div><FiClock aria-hidden="true" /><span><strong>{reservations.filter((r) => r.departure === today && r.status === "Checked in").length}</strong> departures today</span></div></section>

      <section className={styles.listPanel}>
        <div className={styles.toolbar}><label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest, email, room or booking" aria-label="Search reservations" /></label><label className={styles.filter}>Stay status<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All stays</option><option>Confirmed</option><option>Checked in</option><option>Checked out</option></select></label><button className={styles.sort} type="button" onClick={() => setSort((value) => value === "asc" ? "desc" : "asc")} aria-label={`Sort arrival ${sort === "asc" ? "descending" : "ascending"}`}>Arrival {sort === "asc" ? <FiArrowUp aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />}</button></div>
        <div className={styles.tableHead}><span>Guest</span><span>Stay dates</span><span>Room</span><span>Status</span><span>Actions</span></div>
        <div className={styles.rows}>
          {filtered.map((item) => <article className={styles.row} key={item.id}>
            <div className={styles.guestCell}><button type="button" className={styles.guestName} onClick={() => setDialog({ type: "details", reservation: item })}>{item.guest}<FiChevronRight aria-hidden="true" /></button><span>{item.id} <i>·</i> {item.email}</span></div>
            <div className={styles.dateCell}><strong>{displayDate(item.arrival)}</strong><span>to {displayDate(item.departure)}</span></div>
            <div className={styles.roomCell}><strong>Room {item.room}</strong><span>{item.roomType} · {item.guests} guests</span></div>
            <div><span className={`${styles.status} ${styles[statusClass(item.status)]}`}>{item.status}</span></div>
            <div className={styles.actions}>
              {item.status === "Confirmed" && <button type="button" className={styles.checkAction} onClick={() => onCheckIn(item.id)}>Check in</button>}
              {item.status === "Checked in" && <button type="button" className={styles.checkAction} onClick={() => onCheckOut(item.id)}>Check out</button>}
              <button type="button" className={styles.iconAction} aria-label={`Edit ${item.guest}'s reservation`} onClick={() => openEdit(item)}><FiEdit2 aria-hidden="true" /></button>
              <button type="button" className={`${styles.iconAction} ${styles.delete}`} aria-label={`Remove ${item.guest}'s reservation`} onClick={() => setDeleteTarget(item)}><FiTrash2 aria-hidden="true" /></button>
            </div>
          </article>)}
          {!filtered.length && <div className={styles.empty}><FiSearch aria-hidden="true" /><h2>No stays found</h2><p>Try a different search or clear the status filter.</p>{(search || filter !== "All stays") && <button type="button" onClick={() => { setSearch(""); setFilter("All stays"); }}>Clear filters</button>}</div>}
        </div>
        <div className={styles.listFoot}><span>Showing {filtered.length} of {reservations.length} reservations</span><span>Guest details are demo data</span></div>
      </section>

      {dialog?.type === "form" && <Dialog title={dialog.reservation ? "Edit reservation" : "Plan a stay"} description="A few details help the team prepare a warm welcome." onClose={() => setDialog(null)} size="large">
        <form className={styles.form} onSubmit={submit} noValidate>
          <label className={styles.field}>Guest name<input value={form.guest} onChange={(event) => setForm({ ...form, guest: event.target.value })} placeholder="e.g. Jordan Lee" aria-invalid={!!errors.guest} />{errors.guest && <span>{errors.guest}</span>}</label>
          <label className={styles.field}>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="guest@example.com" aria-invalid={!!errors.email} />{errors.email && <span>{errors.email}</span>}</label>
          <label className={styles.field}>Room type<select value={form.roomType} onChange={(event) => setForm({ ...form, roomType: event.target.value })}><option>King</option><option>Queen</option><option>Suite</option></select></label>
          <label className={styles.field}>Guests<select value={form.guests} onChange={(event) => setForm({ ...form, guests: event.target.value })}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select>{errors.guests && <span>{errors.guests}</span>}</label>
          <label className={styles.field}>Arrival<input type="date" value={form.arrival} onChange={(event) => setForm({ ...form, arrival: event.target.value })} aria-invalid={!!errors.arrival} />{errors.arrival && <span>{errors.arrival}</span>}</label>
          <label className={styles.field}>Departure<input type="date" min={form.arrival} value={form.departure} onChange={(event) => setForm({ ...form, departure: event.target.value })} aria-invalid={!!errors.departure} />{errors.departure && <span>{errors.departure}</span>}</label>
          <label className={`${styles.field} ${styles.fullField}`}>Notes for the team<textarea rows="3" maxLength="180" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Arrival details or guest preferences" /><small>{form.note.length}/180</small></label>
          <div className={styles.formFoot}><p>Room assignment depends on current room readiness.</p><div><button type="button" className={styles.secondary} onClick={() => setDialog(null)}>Cancel</button><button type="submit" className={styles.primary}><FiPlus aria-hidden="true" /> {dialog.reservation ? "Save changes" : "Create reservation"}</button></div></div>
        </form>
      </Dialog>}

      {dialog?.type === "details" && <Dialog title={dialog.reservation.guest} description={`Reservation ${dialog.reservation.id}`} onClose={() => setDialog(null)}>
        <div className={styles.detailGrid}><div><FiMail aria-hidden="true" /><span>Email<strong>{dialog.reservation.email}</strong></span></div><div><FiCalendar aria-hidden="true" /><span>Stay dates<strong>{displayDate(dialog.reservation.arrival)} to {displayDate(dialog.reservation.departure)}</strong></span></div><div><FiUsers aria-hidden="true" /><span>Room and guests<strong>{dialog.reservation.roomType} room {dialog.reservation.room} · {dialog.reservation.guests} guests</strong></span></div><div><FiClock aria-hidden="true" /><span>Stay status<strong>{dialog.reservation.status}</strong></span></div></div>
        {dialog.reservation.note && <p className={styles.note}><strong>Team note</strong>{dialog.reservation.note}</p>}
        <div className={styles.detailActions}><button type="button" className={styles.secondary} onClick={() => openEdit(dialog.reservation)}><FiEdit2 aria-hidden="true" /> Edit stay</button>{dialog.reservation.status === "Confirmed" && <button type="button" className={styles.primary} onClick={() => { onCheckIn(dialog.reservation.id); setDialog(null); }}>Check in</button>}{dialog.reservation.status === "Checked in" && <button type="button" className={styles.primary} onClick={() => { onCheckOut(dialog.reservation.id); setDialog(null); }}>Check out</button>}</div>
      </Dialog>}

      {deleteTarget && <ConfirmDialog title="Remove this reservation?" message={`${deleteTarget.guest}'s stay (${deleteTarget.id}) will be removed from this demo.`} confirmLabel="Remove reservation" onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </div>
  );
};

export default Reservations;
