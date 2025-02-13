const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../src/manifest.json');
const manifest = require(manifestPath);

const [,, versionType = 'patch'] = process.argv;

const [major, minor, patch] = manifest.version.split('.').map(Number);

switch(versionType) {
    case 'major':
        manifest.version = `${major + 1}.0.0`;
        break;
    case 'minor':
        manifest.version = `${major}.${minor + 1}.0`;
        break;
    case 'patch':
        manifest.version = `${major}.${minor}.${patch + 1}`;
        break;
    default:
        console.error('Invalid version type. Use: major, minor, or patch');
        process.exit(1);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Version bumped to ${manifest.version}`);
