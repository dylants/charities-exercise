import { readCharities, readProfile } from './lib/read-helpers';
import Charity from './types/Charity';
import Profile from './types/Profile';

// const N_TOTAL = 12;
// const N_MAX_STATE = 5;

function pickCharities(charities: Array<Charity>, profile: Profile) {
  console.log(charities.slice(0, 5));
  console.log(profile);

  return [];
}

async function main() {
  // Input arguments
  const [, , charitiesPath, profilePath] = process.argv;

  const charities = await readCharities(charitiesPath);
  const profile = await readProfile(profilePath);

  const charitiesToFeature = pickCharities(charities, profile);

  // Output result to standard out, one per line
  console.dir(charitiesToFeature);
}
main();
