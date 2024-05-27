import logger from './lib/logger';
import pickCharities from './lib/pick-charities';
import { readCharities, readProfile } from './lib/read-helpers';

async function main() {
  // Input arguments
  const [, , charitiesPath, profilePath] = process.argv;
  logger.trace('charitiesPath: %s', charitiesPath);
  logger.trace('profilePath: %s', profilePath);

  const charities = await readCharities(charitiesPath);
  const profile = await readProfile(profilePath);

  const charitiesToFeature = pickCharities(charities, profile);

  // Output result to standard out, one per line
  console.dir(charitiesToFeature);
}
main();
