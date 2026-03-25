import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  InputAdornment, 
  Alert,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => setIsSubmitted(true), 1500);
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
      {/* LEFT - Context Section */}
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
        {/* Background abstract shapes */}
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
            textAlign: 'center'
          }}
        >
          Password Recovery
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
          Don't worry, it happens to the best of us. Enter your email and we'll help you get back into your account in no time.
        </Typography>

        {/* Floating Lock Icon Animation */}
        <Box
          component={motion.div}
          animate={{ 
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          sx={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            opacity: 0.1,
            fontSize: '10rem',
            filter: 'blur(2px)',
          }}
        >
          🔒
        </Box>
      </Box>

      {/* RIGHT - Form Section */}
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
          
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mb: 4, 
              color: '#64748b',
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', color: '#334155' }
            }}
          >
            Back to Login
          </Button>

          {isSubmitted ? (
            <Fade in={true}>
              <Box textAlign="center" py={4}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
                </motion.div>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Check your inbox
                </Typography>
                <Typography color="text.secondary" mb={4}>
                  We have sent password reset instructions to <strong>{email}</strong>
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setIsSubmitted(false)}
                >
                  Try another email
                </Button>
              </Box>
            </Fade>
          ) : (
            <form onSubmit={handleSubmit}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom
                sx={{ color: '#1e293b' }}
              >
                Forgot Password?
              </Typography>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 5 }}
              >
                Enter your email address to verify your identity.
              </Typography>

              <TextField
                fullWidth
                required
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1.6,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
                  '&:hover': {
                    bgcolor: '#5a67d8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.45)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
}