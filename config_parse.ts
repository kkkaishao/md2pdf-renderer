import yaml from 'yaml';
import fs from 'fs';

export function parseConfigFile() {
    const file = fs.readFileSync('config.yaml', 'utf8');
    const config = yaml.parse(file);
    return config;
}