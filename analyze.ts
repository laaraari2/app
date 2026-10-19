import fs from 'fs';
import path from 'path';

const domainsDir = path.join(process.cwd(), 'src', 'domains');
const domains = fs.readdirSync(domainsDir).filter(d => fs.statSync(path.join(domainsDir, d)).isDirectory());

let crossDomainCalls = 0;
let infraLeaks = 0;
let dtoLeaks = 0;
let totalFiles = 0;

function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            totalFiles++;
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Check for cross-domain calls
            const domainMatch = fullPath.match(/src[\\/]domains[\\/]([^\\/]+)/);
            const currentDomain = domainMatch ? domainMatch[1] : null;

            if (currentDomain) {
                for (const otherDomain of domains) {
                    if (otherDomain !== currentDomain) {
                        if (content.includes(`domains/${otherDomain}`) || content.includes(`../${otherDomain}`)) {
                            crossDomainCalls++;
                            console.log(`Cross-domain call in ${fullPath} to ${otherDomain}`);
                        }
                    }
                }
            }

            // Check for infra leaks into domain
            if (fullPath.includes('domain') && !fullPath.includes('infrastructure')) {
                if (content.includes('import') && (content.includes('db/') || content.includes('infrastructure/'))) {
                    infraLeaks++;
                    console.log(`Infra leak in ${fullPath}`);
                }
            }

            // Check for DTOs in domain
            if (fullPath.includes('domain') && !fullPath.includes('application') && !fullPath.includes('dto')) {
                if (content.includes('Dto') || content.includes('.dto')) {
                    dtoLeaks++;
                    console.log(`DTO leak in ${fullPath}`);
                }
            }
        }
    }
}

walk(domainsDir);

console.log('--- Analysis Results ---');
console.log(`Total Files Analyzed: ${totalFiles}`);
console.log(`Cross-Domain Calls: ${crossDomainCalls}`);
console.log(`Infrastructure Leaks into Domain: ${infraLeaks}`);
console.log(`DTO Leaks into Domain: ${dtoLeaks}`);
