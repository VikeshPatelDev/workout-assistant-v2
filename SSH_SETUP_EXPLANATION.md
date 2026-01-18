# SSH Setup Problem Explanation

## The Core Issue

Your SSH key (`id_rsa_github_vikeshpateldev`) is **encrypted with a passphrase** for security. This is a good security practice, but it creates a challenge for automated deployments.

## What's Happening

### 1. **SSH Key Requires Passphrase**
   - Your private key file is encrypted
   - Every time it's used, SSH needs the passphrase to decrypt it
   - This is a security feature to protect your key if someone gains access to your computer

### 2. **Non-Interactive Environment Problem**
   - When running automated scripts (like `npm run deploy`), there's no interactive terminal
   - SSH can't prompt you to enter the passphrase
   - Result: `Permission denied (publickey)` error

### 3. **SSH Agent Solution**
   - The SSH agent is a background service that holds decrypted keys in memory
   - Once you enter the passphrase and add the key to the agent, it stays loaded
   - Git/SSH can then use the key without prompting for the passphrase again

## What We Found During Troubleshooting

✅ **What's Working:**
- SSH config file is correctly set up (`~/.ssh/config`)
- SSH key file exists and has correct permissions
- Public key is added to your GitHub account
- Git remote is set to SSH URL

❌ **What's Not Working:**
- SSH agent doesn't have the key loaded (or it expired)
- When Git tries to use SSH, it can't access the key because:
  - Key isn't in the agent, OR
  - Agent session expired (Windows SSH agent doesn't persist across sessions by default)

## The Error We Saw

```
debug1: Offering public key: /c/Users/patel/.ssh/id_rsa_github_vikeshpateldev RSA
debug1: Server accepts key: /c/Users/patel/.ssh/id_rsa_github_vikeshpateldev RSA
debug1: read_passphrase: can't open /dev/tty: No such device or address
debug1: No more authentication methods to try.
git@github.com: Permission denied (publickey).
```

**Translation:**
- GitHub recognizes your key ✅
- But SSH can't prompt for passphrase in non-interactive mode ❌
- So authentication fails ❌

## Solutions

### Solution 1: Use SSH Agent (Recommended)
**How it works:**
1. You manually add the key to the SSH agent once (enter passphrase)
2. Key stays in memory for that session
3. All Git operations work without prompting

**Commands:**
```powershell
# Add key to agent (you'll be prompted for passphrase)
ssh-add $env:USERPROFILE\.ssh\id_rsa_github_vikeshpateldev

# Now deploy works
npm run deploy
```

**Limitation:** Key is only loaded for the current PowerShell session. If you close the terminal, you need to add it again.

### Solution 2: Use Deploy Script (What We Created)
**How it works:**
- Script checks if key is loaded
- If not, prompts you to add it
- Then runs deployment

**Command:**
```powershell
npm run deploy:ssh
```

### Solution 3: Use HTTPS Instead
**How it works:**
- No passphrase needed
- Uses GitHub credentials or Personal Access Token
- Works in all environments

**Command:**
```powershell
git remote set-url origin https://github.com/VikeshPatelDev/workout-assistant-v2.git
npm run deploy
```

## Why This Happens on Windows

Windows SSH agent behavior differs from Linux/Mac:
- **Linux/Mac:** SSH agent can persist across sessions with proper setup
- **Windows:** SSH agent typically only persists for the current session
- **Solution:** You need to add the key each time you open a new terminal, OR use a tool like `winssh-agent` for persistence

## Best Practice Recommendation

For **automated deployments** (CI/CD, scripts):
- Use HTTPS with Personal Access Token (more reliable)

For **manual deployments** (your local machine):
- Use SSH with the deploy script (`npm run deploy:ssh`)
- Or manually add key to agent before deploying

## Quick Fix for Right Now

Run these commands in your terminal:

```powershell
cd workout-assistant-v2

# Add your SSH key (enter passphrase when prompted)
ssh-add $env:USERPROFILE\.ssh\id_rsa_github_vikeshpateldev

# Verify it's loaded
ssh-add -l

# Now deploy
npm run deploy
```

This should work because you'll be in an interactive terminal where you can enter the passphrase.

