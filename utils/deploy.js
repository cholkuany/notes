// scripts/deploy.js
const { execSync } = require('child_process')
const fs = require('fs')

// --- Parse CLI Arguments ---
// Usage: npm run deploy:full "message" [branch] [bumpType]
let msg = process.argv[2] || 'uibuild'
let branch = 'main'
let bumpType = 'patch'

const arg3 = process.argv[3]
const arg4 = process.argv[4]

// Smart argument detection
if (arg3) {
  if (['patch', 'minor', 'major'].includes(arg3)) {
    bumpType = arg3
  } else {
    branch = arg3
    if (arg4 && ['patch', 'minor', 'major'].includes(arg4)) {
      bumpType = arg4
    }
  }
}

function run(cmd) {
  console.log(`\n👉 Running: ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

function bumpVersion(version, type) {
  const parts = version.replace(/^v/, '').split('.').map(Number)
  let [major, minor, patch] = parts

  switch (type) {
  case 'major':
    major += 1
    minor = 0
    patch = 0
    break
  case 'minor':
    minor += 1
    patch = 0
    break
  default:
    patch += 1
  }

  return `v${major}.${minor}.${patch}`
}

function getCurrentVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    return pkg.version.startsWith('v') ? pkg.version : `v${pkg.version}`
  } catch {
    try {
      return execSync('git describe --tags --abbrev=0').toString().trim()
    } catch {
      return 'v1.0.0'
    }
  }
}

function updatePackageJsonVersion(newVersion) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    pkg.version = newVersion.replace(/^v/, '') // remove 'v' for package.json
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
    console.log(`📦 Updated package.json version → ${pkg.version}`)
  } catch (err) {
    console.warn('⚠️ Could not update package.json:', err.message)
  }
}

try {
  console.log('🔨 Building UI...')
  run('npm run build:ui')

  console.log('📦 Committing changes...')
  run('git add .')
  run(`git commit -m "${msg}"`)

  console.log(`🚀 Pushing to remote branch: ${branch}`)
  run(`git push origin ${branch}`)

  const currentVersion = getCurrentVersion()
  const newVersion = bumpVersion(currentVersion, bumpType)
  updatePackageJsonVersion(newVersion)

  console.log(`🏷️ Creating new tag: ${newVersion}`)
  run('git add package.json')
  run(
    `git commit -m "bump version to ${newVersion}" || echo "No version bump commit"`
  )
  run(`git push origin ${branch}`)
  run(`git tag ${newVersion}`)
  run(`git push origin ${newVersion}`)

  console.log(`✅ Deployment complete! (${newVersion})`)
} catch (err) {
  console.error('❌ Deployment failed:', err.message)
  process.exit(1)
}
