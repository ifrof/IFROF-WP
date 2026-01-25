// Set session cookie (auto-login)
await createUserSession(newUser.id, ctx.req, ctx.res, {
  maxAgeMs: 7 * 24 * 60 * 60 * 1000,
});
