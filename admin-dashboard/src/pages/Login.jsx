import { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../services/api';

export default function SplitLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(username, password);
      const { token, role } = response.data;

      // Store token and role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);

      // Navigate based on role
      if (role === 'SUPER_ADMIN') {
        navigate('/dashboard');
      } else if (role === 'CLASS_TEACHER' || role === 'SUBJECT_TEACHER') {
        navigate('/dashboard');
      } else {
        setError('Access denied. This portal is for admin and teachers only.');
        localStorage.clear();
      }

    } catch (err) {
      if (err.response?.status === 500) {
        setError('Invalid username or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* LEFT - Welcome Section */}
      <Box
        component={motion.div}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        sx={{
          width: { xs: '0%', md: '50%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 8,
          position: 'relative',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0%, transparent 40%),' +
              'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <Typography
          variant="h3"
          component={motion.h1}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          sx={{
            fontWeight: 800,
            mb: 3,
            background: 'linear-gradient(90deg, #ffffff, #e0e0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            zIndex: 2,
          }}
        >
          Welcome Back Admin
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 420,
            textAlign: 'center',
            opacity: 0.9,
            lineHeight: 1.7,
            zIndex: 2,
          }}
        >
          We're excited to see you again! Log in to access your dashboard,
          manage your profile, and continue your journey with us.
        </Typography>

        <Box
          component={motion.div}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.15), transparent)',
            top: '15%',
            left: '10%',
            filter: 'blur(40px)',
          }}
        />
      </Box>

      {/* RIGHT - Login Form */}
      <Box
        component={motion.div}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{
          width: { xs: '100%', md: '50%' },
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 4, sm: 8 },
          borderTopLeftRadius: { md: 60 },
          borderBottomLeftRadius: { md: 60 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
            sx={{ mb: 1, color: '#1e293b' }}
          >
            Admin Login
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 5 }}
          >
            Enter your credentials to continue
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: '#64748b' }}>✉</Box>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: '#64748b' }}>🔒</Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              mb: 4,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: '#6366f1', '&.Mui-checked': { color: '#6366f1' } }}
                />
              }
              label={<Typography variant="body2">Remember me</Typography>}
            />

            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.6,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.45)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

