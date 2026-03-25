import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to control the confirmation dialog
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOutClick = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close without signing out
  };

  const handleConfirmSignOut = () => {
    setOpen(false);
    navigate("/"); // Perform the sign out
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: "rgba(255, 255, 255, 0.85)", 
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          color: "#1E293B",
          zIndex: 1000
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 70 }}>
            
            {/* Logo Section */}
            <Box 
              onClick={() => navigate("/dashboard")} 
              sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1.5 }}
            >
              <Box sx={{ bgcolor: "#3B82F6", color: "white", p: 1, borderRadius: 2, display: "flex", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
                  <SchoolRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Smartcampus
              </Typography>
            </Box>

            {/* Actions */}
            <Box display="flex" gap={2}>
              <Button 
                onClick={() => navigate("/dashboard")}
                sx={{ 
                  color: isActive("/dashboard") ? "#3B82F6" : "#64748B", 
                  bgcolor: isActive("/dashboard") ? "#EFF6FF" : "transparent",
                  fontWeight: 600, 
                  px: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": { color: "#3B82F6", bgcolor: "#EFF6FF" }
                }}
              >
                Dashboard
              </Button>
              <Button 
                startIcon={<LogoutRoundedIcon />} 
                onClick={handleSignOutClick} // Changed this
                variant="outlined"
                sx={{ 
                  borderColor: "#E2E8F0", 
                  color: "#475569",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2,
                  "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F8FAFC", color: "#0F172A" }
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 3, p: 1, width: "100%", maxWidth: 400 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Confirm Sign Out
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748B" }}>
            Are you sure you want to log out of Smartcampus?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            sx={{ color: "#64748B", fontWeight: 600, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSignOut} 
            variant="contained" 
            color="error"
            sx={{ 
              borderRadius: 2, 
              px: 3, 
              textTransform: "none", 
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
            }}
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}