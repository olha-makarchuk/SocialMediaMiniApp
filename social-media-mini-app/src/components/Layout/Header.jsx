import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, Box, Button, CardHeader } from "@mui/material";
import styles from "./Header.module.css";
import SearchBar from "../Search/SearchBar";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleNavigateToFeed = () => {
    navigate("/feed");
  };

  const handleNavigateToProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={handleNavigateToFeed}>
        Link
      </div>

      <SearchBar />
      
      <div className={styles.actions}>
        {isAuthenticated ? (
          <div>
            <div className={styles.userSection}>
              <Box sx={{ cursor: "pointer" }}>
                <Avatar
                  src={user.avatar}
                  onClick={handleNavigateToProfile}
                  sx={{ bgcolor: "secondary.main" }}
                />
              </Box>
            </div>
          </div>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/login")}
            sx={{ backgroundColor: "var(--primary)", borderRadius: "8px" }}
          >
            Увійти
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
