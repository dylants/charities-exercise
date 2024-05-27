import _ from 'lodash';
import CategoryMatch from '../types/CategoryMatch';
import Charity from '../types/Charity';
import logger from './logger';
import { N_MIN_ANIMAL_RELATED } from '../constants';

function pluckCategoryMatch({
  category,
  charities,
}: {
  category: CategoryMatch['category'];
  charities: Array<Charity>;
}): Charity {
  const index = charities.findIndex((charity) => charity.category === category);
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
      return _.times(numToFind, () =>
        pluckCategoryMatch({ category, charities }),
      ).flat();
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

  const numNationalCategoryMatches =
    numStateCategoryMatches >= N_MIN_ANIMAL_RELATED
      ? 0
      : N_MIN_ANIMAL_RELATED - numStateCategoryMatches;
  logger.trace('numStateCategoryMatches: %d', numStateCategoryMatches);
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
