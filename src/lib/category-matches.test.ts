import CategoryMatch from '../types/CategoryMatch';
import Charity from '../types/Charity';
import { addCategoryMatches, pluckCategoryMatch } from './category-matches';

describe('category-matches', () => {
  let charities: Array<Charity>;
  beforeEach(() => {
    charities = [
      {
        category: 'ANIMAL_RELATED',
        featured: 'STATE',
        id: 469,
        name: 'Zoological Society Of Buffalo Inc',
        state: 'NEW_YORK',
      },
      {
        category: 'HUMAN_SERVICES',
        featured: 'NATIONAL',
        id: 4416,
        name: 'Bluestem Pace Inc',
        state: 'KANSAS',
      },
      {
        category: 'ANIMAL_RELATED',
        featured: 'STATE',
        id: 4123,
        name: 'Woodstock Farm Animal Sanctuary Inc',
        state: 'NEW_YORK',
      },
    ];
  });

  describe('pluckCategoryMatch', () => {
    it('should return a Charity when there is a match', () => {
      expect(
        pluckCategoryMatch({
          category: 'ANIMAL_RELATED',
          charities,
        }),
      ).toBeDefined();
    });

    it('should return undefined when there is not a match', () => {
      expect(
        pluckCategoryMatch({
          category: 'no-match',
          charities,
        }),
      ).toBeUndefined();
    });
  });

  describe('addCategoryMatches', () => {
    it('should return the requested matches when they exist', () => {
      const categoryMatches: Array<CategoryMatch> = [
        {
          category: 'ANIMAL_RELATED',
          numToFind: 2,
        },
      ];

      expect(
        addCategoryMatches({
          categoryMatches,
          charities,
        }).length,
      ).toEqual(2);
    });

    it('should return the maximum matches when there are not enough', () => {
      const categoryMatches: Array<CategoryMatch> = [
        {
          category: 'ANIMAL_RELATED',
          numToFind: 3,
        },
      ];

      expect(
        addCategoryMatches({
          categoryMatches,
          charities,
        }).length,
      ).toEqual(2);
    });

    it('should return none when there are no matches', () => {
      const categoryMatches: Array<CategoryMatch> = [
        {
          category: 'FOO',
          numToFind: 3,
        },
      ];

      expect(
        addCategoryMatches({
          categoryMatches,
          charities,
        }).length,
      ).toEqual(0);
    });
  });
});
