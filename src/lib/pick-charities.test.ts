import { N_MAX_STATE, N_MIN_ANIMAL_RELATED, N_TOTAL } from '../constants';
import Charity from '../types/Charity';
import { FeaturedOption } from '../types/Featured';
import Profile from '../types/Profile';
import pickCharities from './pick-charities';
import { readCharities } from './read-helpers';

const CHARITIES_PATH = './data/charities.csv';

describe('pick-charities', () => {
  describe('when supplying a default profile (with all flags false)', () => {
    const profile: Profile = {
      age: 65,
      hasChildren: false,
      hasPets: false,
      id: 789,
      isMarried: false,
      name: 'John Doe',
      state: 'NEW_YORK',
    };
    let results: Array<Charity>;

    beforeAll(async () => {
      const charities = await readCharities(CHARITIES_PATH);
      results = pickCharities(charities, profile);
    });

    it('should return the correct total number of charities', () => {
      expect(results.length).toEqual(N_TOTAL);
    });

    it('should return a valid number of state charities', () => {
      const stateCharities = results.filter(
        (r) => r.featured === FeaturedOption.STATE,
      );
      expect(stateCharities.length).toBeLessThanOrEqual(N_MAX_STATE);
    });

    it('should be that all state charities match the profile state', () => {
      const stateCharities = results.filter(
        (r) => r.featured === FeaturedOption.STATE,
      );
      expect(stateCharities.every((c) => c.state === profile.state)).toEqual(
        true,
      );
    });

    it('should return a valid number of national charities', () => {
      const stateCharities = results.filter(
        (r) => r.featured === FeaturedOption.STATE,
      );
      const nationalCharities = results.filter(
        (r) => r.featured === FeaturedOption.NATIONAL,
      );
      expect(nationalCharities.length).toEqual(
        results.length - stateCharities.length,
      );
    });
  });

  describe('when supplying a profile that hasPets', () => {
    const profile: Profile = {
      age: 65,
      hasChildren: false,
      hasPets: true,
      id: 789,
      isMarried: false,
      name: 'John Doe',
      state: 'NEW_YORK',
    };
    let results: Array<Charity>;

    beforeAll(async () => {
      const charities = await readCharities(CHARITIES_PATH);
      results = pickCharities(charities, profile);
    });

    it('should return the correct total number of charities', () => {
      expect(results.length).toEqual(N_TOTAL);
    });

    it('should return a valid number of state charities', () => {
      const stateCharities = results.filter(
        (r) => r.featured === FeaturedOption.STATE,
      );
      expect(stateCharities.length).toBeLessThanOrEqual(N_MAX_STATE);
    });

    it('should be that all state charities match the profile state', () => {
      const stateCharities = results.filter(
        (r) => r.featured === FeaturedOption.STATE,
      );
      expect(stateCharities.every((c) => c.state === profile.state)).toEqual(
        true,
      );
    });

    it('should return a valid number of national charities', () => {
      const stateCharities = results.filter(
        (r) => r.featured === FeaturedOption.STATE,
      );
      const nationalCharities = results.filter(
        (r) => r.featured === FeaturedOption.NATIONAL,
      );
      expect(nationalCharities.length).toEqual(
        results.length - stateCharities.length,
      );
    });

    it('should return at least the min number of animal related charities', () => {
      const animalRelatedCharities = results.filter(
        (r) => r.category === 'ANIMAL_RELATED',
      );
      expect(animalRelatedCharities.length).toBeGreaterThanOrEqual(
        N_MIN_ANIMAL_RELATED,
      );
    });
  });
});
