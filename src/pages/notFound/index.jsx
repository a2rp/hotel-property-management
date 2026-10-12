import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFound = () => (
  <div className={styles.page}>
    <span className={styles.mark}><FiHome aria-hidden="true" /></span>
    <p>MAISON NORTH · HOTEL DESK</p>
    <h1>This page is off the map.</h1>
    <span>The address may have changed. Your hotel desk is still right here.</span>
    <Link to="/overview"><FiArrowLeft aria-hidden="true" /> Back to the desk</Link>
  </div>
);

export default NotFound;
