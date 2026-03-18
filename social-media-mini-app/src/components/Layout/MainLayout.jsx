import { Outlet } from "react-router-dom";
import Header from "./Header";
import styles from "./MainLayout.module.css";

function MainLayout() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
