import _ from 'lodash';
import CategoryMatch from '../types/CategoryMatch';
import Charity from '../types/Charity';
import logger from './logger';
import { N_MIN_ANIMAL_RELATED, N_TOTAL } from '../constants';

export function pluckCategoryMatch({
  category,
  charities,
}: {
  category: CategoryMatch['category'];
  charities: Array<Charity>;
}): Charity | undefined {
  const index = charities.findIndex((charity) => charity.category === category);

  if (index === -1) {
    return undefined;
  }

  return charities.splice(index, 1)[0];
}

export function addCategoryMatches({
  categoryMatches,
  charities,
}: {
  categoryMatches: Array<CategoryMatch>;
  charities: Array<Charity>;
}): Array<Charity> {
  return categoryMatches
    .map((categoryMatch) => {
      const { category, numToFind } = categoryMatch;
      logger.trace('category: %s', category);
      logger.trace('numToFind: %d', numToFind);

      const charitiesFound = _.times(numToFind, () =>
        pluckCategoryMatch({ category, charities }),
      )
        .flat()
        // remove any undefined and make TypeScript happy
        .filter((c) => c !== undefined) as Array<Charity>;
      logger.trace('charitiesFound: %j', charitiesFound);
      return charitiesFound;
    })
    .flat();
}

type BuildCategoryMatchesResult = {
  nationalCategoryMatch: CategoryMatch;
  stateCategoryMatch: CategoryMatch;
};
export function buildAnimalRelatedCategoryMatches({
  numNationalCharities,
  numStateCharities,
}: {
  numNationalCharities: number;
  numStateCharities: number;
}): BuildCategoryMatchesResult {
  logger.trace('N_MIN_ANIMAL_RELATED: %d', N_MIN_ANIMAL_RELATED);
  logger.trace('numStateCharities: %d', numStateCharities);
  logger.trace('numNationalCharities: %d', numNationalCharities);

  // There should be _at least_ N_MIN_ANIMAL_RELATED, but no more than
  // the N_TOTAL number of charities.
  const numAnimalRelatedCharities = _.random(N_MIN_ANIMAL_RELATED, N_TOTAL);
  logger.trace('numAnimalRelatedCharities: %d', numAnimalRelatedCharities);

  // do not exceed the required matches, or number of state charities
  const maxStateMatches = Math.min(
    numAnimalRelatedCharities,
    numStateCharities,
  );

  const numStateCategoryMatches =
    numAnimalRelatedCharities > numNationalCharities
      ? // if we need more than we have slots in national charities,
        // this number must be _at least_ the difference
        _.random(
          numAnimalRelatedCharities - numNationalCharities,
          maxStateMatches,
        )
      : // else the number can be 0 to the max
        _.random(0, maxStateMatches);
  logger.trace('numStateCategoryMatches: %d', numStateCategoryMatches);

  const numNationalCategoryMatches =
    numStateCategoryMatches === numAnimalRelatedCharities
      ? // when all matches are in state, none are needed in national
        0
      : // else we need the rest in national
        numAnimalRelatedCharities - numStateCategoryMatches;
  logger.trace('numNationalCategoryMatches: %d', numNationalCategoryMatches);

  const stateCategoryMatch: CategoryMatch = {
    category: 'ANIMAL_RELATED',
    numToFind: numStateCategoryMatches,
  };
  const nationalCategoryMatch: CategoryMatch = {
    category: 'ANIMAL_RELATED',
    numToFind: numNationalCategoryMatches,
  };

  return {
    nationalCategoryMatch,
    stateCategoryMatch,
  };
}
