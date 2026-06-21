import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

/* ─── tiny sub-components ──────────────────────────────────────────────── */

function InputField({ id, label, type = 'text', placeholder, icon: Icon, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="auth-field-wrap">
      <label htmlFor={id} className="type-label" style={{ color: 'var(--color-text-secondary)', marginBottom: '6px', display: 'block' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={15}
            style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-tertiary)', pointerEvents: 'none',
            }}
          />
        )}
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="input-field"
          style={{
            width: '100%',
            padding: isPassword ? '12px 44px 12px 40px' : '12px 16px 12px 40px',
            fontSize: 'var(--text-body)',
            boxSizing: 'border-box',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-tertiary)',
            }}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      <span className="type-caption" style={{ color: 'var(--color-text-tertiary)' }}>or</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}

/* ─── main modal ────────────────────────────────────────────────────────── */

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('signup'); // 'signup' | 'signin'

  // Sign-up fields
  const [signupName,  setSignupName]  = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass,  setSignupPass]  = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  // Sign-in fields
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPass,  setSigninPass]  = useState('');

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: wire to backend / Supabase auth
    console.log(tab === 'signup'
      ? { signupName, signupEmail, signupPass, signupConfirm }
      : { signinEmail, signinPass });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── backdrop ── */
        <motion.div
          key="auth-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* ── card ── */}
          <motion.div
            key="auth-card"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'var(--color-modal-bg)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '20px',
              boxShadow: '0 0 60px rgba(0, 212, 255, 0.12), 0 24px 60px rgba(0,0,0,0.6)',
              padding: '36px 32px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* cyan top glow bar */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
              background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
              borderRadius: '0 0 8px 8px',
            }} />

            {/* close button */}
            <button
              id="auth-modal-close"
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text-secondary)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <X size={15} />
            </button>

            {/* brand mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={16} color="#000" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                GlobeX AI
              </span>
            </div>

            {/* heading */}
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: 'var(--color-text-primary)',
              marginBottom: '4px',
            }}>
              {tab === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="type-body" style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              {tab === 'signup'
                ? 'Start your free trial — no credit card required.'
                : 'Sign in to continue to GlobeX AI.'}
            </p>

            {/* ── tab switcher ── */}
            <div style={{
              display: 'flex', gap: '4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px', padding: '4px',
              marginBottom: '24px',
            }}>
              {['signup', 'signin'].map(t => (
                <button
                  key={t}
                  id={`auth-tab-${t}`}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: '8px 0',
                    borderRadius: '7px', border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600, fontSize: 'var(--text-small)',
                    transition: 'all 0.2s ease',
                    background: tab === t
                      ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.15))'
                      : 'transparent',
                    color: tab === t
                      ? '#00d4ff'
                      : 'var(--color-text-tertiary)',
                    boxShadow: tab === t
                      ? 'inset 0 0 0 1px rgba(0,212,255,0.25)'
                      : 'none',
                  }}
                >
                  {t === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
              ))}
            </div>

            {/* ── Google OAuth ── */}
            <button
              id="auth-google-btn"
              type="button"
              style={{
                width: '100%', padding: '11px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600, fontSize: 'var(--text-body)',
                color: 'var(--color-text-primary)',
                transition: 'background 0.2s, border-color 0.2s',
                marginBottom: '16px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              {/* Google G logo */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <Divider />

            {/* ── form ── */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
              <AnimatePresence mode="wait">
                {tab === 'signup' ? (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <InputField
                      id="signup-name"
                      label="Full Name"
                      placeholder="Jane Smith"
                      icon={User}
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      autoComplete="name"
                    />
                    <InputField
                      id="signup-email"
                      label="Work Email"
                      type="email"
                      placeholder="jane@company.com"
                      icon={Mail}
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <InputField
                      id="signup-password"
                      label="Password"
                      type="password"
                      placeholder="Min. 8 characters"
                      icon={Lock}
                      value={signupPass}
                      onChange={e => setSignupPass(e.target.value)}
                      autoComplete="new-password"
                    />
                    <InputField
                      id="signup-confirm"
                      label="Confirm Password"
                      type="password"
                      placeholder="Repeat your password"
                      icon={Lock}
                      value={signupConfirm}
                      onChange={e => setSignupConfirm(e.target.value)}
                      autoComplete="new-password"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin-fields"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <InputField
                      id="signin-email"
                      label="Email"
                      type="email"
                      placeholder="jane@company.com"
                      icon={Mail}
                      value={signinEmail}
                      onChange={e => setSigninEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <InputField
                      id="signin-password"
                      label="Password"
                      type="password"
                      placeholder="Your password"
                      icon={Lock}
                      value={signinPass}
                      onChange={e => setSigninPass(e.target.value)}
                      autoComplete="current-password"
                    />
                    <div style={{ textAlign: 'right', marginTop: '-6px' }}>
                      <a
                        href="#"
                        className="type-small"
                        style={{ color: '#00d4ff', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        Forgot password?
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* submit */}
              <button
                id="auth-submit-btn"
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '10px',
                  fontSize: 'var(--text-body)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  marginTop: '4px',
                }}
              >
                {tab === 'signup' ? 'Create Account' : 'Sign In'}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* footer switch */}
            <p className="type-small" style={{
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
              marginTop: '20px',
            }}>
              {tab === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setTab(tab === 'signup' ? 'signin' : 'signup')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#00d4ff', fontFamily: 'var(--font-sans)',
                  fontWeight: 600, fontSize: 'var(--text-small)',
                  padding: 0,
                }}
              >
                {tab === 'signup' ? 'Sign in' : 'Sign up free'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
