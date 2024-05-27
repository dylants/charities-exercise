import { parse, Options } from 'csv-parse';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import Charity from '../types/Charity';
import Profile from '../types/Profile';

function buildParsePromise<T>() {
  return promisify<Buffer | string, Options, Array<T>>(parse);
}

// Passed to csv.parse to correct type of booleans
const cast = (v: string) => {
  if (v === 'TRUE') return true;
  if (v === 'FALSE') return false;
  return v;
};

/**
 * Read charities from a file and parses into objects.
 * @returns array of charity objects
 */
async function readCharities(path: string): Promise<Array<Charity>> {
  const charitiesBuffer = await fs.readFile(path);
  const parsePromise = buildParsePromise<Charity>();
  return parsePromise(charitiesBuffer, { columns: true });
}

/**
 * Read profile from a 1-entry csv at `path`.
 * @returns profile object
 */
async function readProfile(path: string): Promise<Profile> {
  const profileBuffer = await fs.readFile(path);
  const parsePromise = buildParsePromise<Profile>();
  return (await parsePromise(profileBuffer, { cast, columns: true }))[0];
}

export { readCharities, readProfile };
