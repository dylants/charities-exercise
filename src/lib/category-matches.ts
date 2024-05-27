import _ from 'lodash';
import CategoryMatch from '../types/CategoryMatch';
import Charity from '../types/Charity';
import logger from './logger';
import { N_MIN_ANIMAL_RELATED } from '../constants';

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
  numStateCharities,
}: {
  numStateCharities: number;
}): BuildCategoryMatchesResult {
  logger.trace('N_MIN_ANIMAL_RELATED: %d', N_MIN_ANIMAL_RELATED);

  const numStateCategoryMatches =
    N_MIN_ANIMAL_RELATED >= numStateCharities
      ? _.random(0, numStateCharities)
      : _.random(N_MIN_ANIMAL_RELATED, numStateCharities);
  logger.trace('numStateCategoryMatches: %d', numStateCategoryMatches);

  const numNationalCategoryMatches =
    numStateCategoryMatches >= N_MIN_ANIMAL_RELATED
      ? 0
      : N_MIN_ANIMAL_RELATED - numStateCategoryMatches;
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
