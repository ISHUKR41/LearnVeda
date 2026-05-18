# Forgot Password Route

This folder owns the `/forgot-password` recovery page.

## Files

- `page.tsx` renders the password recovery form and user-facing recovery flow.
- `ForgotPassword.module.css` contains page-specific form and responsive styles.

## Notes

Email token generation and password reset persistence must remain in backend auth services. The page should only collect input, show validation, and call a backend API when that API is available.
