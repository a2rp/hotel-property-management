import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCalendar, FiGrid, FiGithub, FiMenu, FiPlus, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const navigation = [
  { to: "/overview", label: "Desk", icon: FiGrid },
  { to: "/reservations", label: "Reservations", icon: FiCalendar },
  { to: "/rooms", label: "Rooms", icon: FiGrid },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const previousScroll = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (menuOpen || current < 24 || current < previousScroll.current - 4) setHidden(false);
      else if (current > previousScroll.current + 5) setHidden(true);
      previousScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const openNewReservation = () => {
    setMenuOpen(false);
    navigate("/reservations?create=1");
  };

  return (
    <header className={[styles.header, hidden && styles.hidden, menuOpen && styles.menuOpen].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <NavLink className={styles.brand} to="/overview" aria-label="Maison North hotel desk" onClick={() => setMenuOpen(false)}>
          <span className={styles.brandMark} aria-hidden="true"><i /><i /><i /></span>
          <span className={styles.brandText}>Maison North<small>HOTEL DESK</small></span>
        </NavLink>

        <span className={styles.property}>ASHEVILLE <i /> 48 ROOMS</span>

        <nav className={[styles.navigation, menuOpen && styles.navigationOpen].filter(Boolean).join(" ")} aria-label="Main navigation" id="hotel-navigation">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => [styles.navLink, isActive && styles.active].filter(Boolean).join(" ")} onClick={() => setMenuOpen(false)}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.repository} href="https://github.com/a2rp/hotel-property-management" target="_blank" rel="noreferrer" aria-label="Repository">
            <FiGithub aria-hidden="true" /><span>Repository</span>
          </a>
          <button className={styles.newBooking} type="button" onClick={openNewReservation} aria-label="New reservation">
            <FiPlus aria-hidden="true" /><span>New reservation</span>
          </button>
          <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="hotel-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
